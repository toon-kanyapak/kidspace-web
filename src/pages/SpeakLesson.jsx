import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card, Chip, Progress } from '../components/ui'
import { SPEAK_LEVELS, speakLessonById } from '../data/speak'
import { useApp } from '../store/AppContext'
import { scrollScreenTop } from '../lib/scroll'

/** Loose comparison so "I can do it." matches "i can do it" from the recogniser. */
const normalise = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

function similarity(a, b) {
  const wa = normalise(a).split(' ')
  const wb = new Set(normalise(b).split(' '))
  if (!wa.length) return 0
  return wa.filter((w) => wb.has(w)).length / wa.length
}

/** Hides a couple of words for the level-3 "fill the gap" drill. */
function withGaps(sentence) {
  const words = sentence.split(' ')
  if (words.length < 3) return words.map((w, i) => ({ w, hidden: i === words.length - 1 }))
  const hide = new Set([Math.floor(words.length / 2), words.length - 1])
  return words.map((w, i) => ({ w, hidden: hide.has(i) }))
}

export default function SpeakLesson() {
  const { id } = useParams()
  const { t, speak, sfx, markDone, addStars, progress, rate } = useApp()
  const lesson = speakLessonById(id)

  const [level, setLevel] = useState(1)
  const [idx, setIdx] = useState(0)
  const [heard, setHeard] = useState('')
  const [status, setStatus] = useState(null) // 'ok' | 'try' | null
  const [listening, setListening] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const recRef = useRef(null)

  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(
    () => () => {
      try {
        recRef.current?.stop()
      } catch {
        /* ignore */
      }
    },
    [],
  )
  useEffect(() => {
    setIdx(0)
    setHeard('')
    setStatus(null)
    setRevealed(false)
  }, [level])

  const gaps = useMemo(() => (lesson ? withGaps(lesson.lines[idx][0]) : []), [lesson, idx])

  if (!lesson) return <Navigate to="/speak" replace />

  const [en, th] = lesson.lines[idx]
  const last = idx === lesson.lines.length - 1

  const listen = () => {
    if (!SR) return
    try {
      const rec = new SR()
      recRef.current = rec
      rec.lang = 'en-US'
      rec.interimResults = false
      rec.maxAlternatives = 3
      rec.onresult = (e) => {
        const said = Array.from(e.results[0])
          .map((r) => r.transcript)
          .join(' ')
        setHeard(said)
        const ok = similarity(en, said) >= 0.6
        setStatus(ok ? 'ok' : 'try')
        sfx(ok ? 'great' : 'wrong')
      }
      rec.onerror = () => {
        setListening(false)
        setStatus('try')
      }
      rec.onend = () => setListening(false)
      rec.start()
      setListening(true)
      setHeard('')
      setStatus(null)
    } catch {
      setListening(false)
    }
  }

  const next = () => {
    setHeard('')
    setStatus(null)
    setRevealed(false)
    if (last) {
      const key = `speak:${lesson.id}:${level}`
      if (!progress[key]) addStars(3)
      markDone(key, true)
      sfx('great')
      scrollScreenTop()
      if (level < 4) setLevel(level + 1)
      else setIdx(0)
    } else {
      setIdx(idx + 1)
      sfx('tap')
    }
  }

  return (
    <>
      <PageHeader title={lesson.th} to="/speak" />
      <div className="mx-auto w-full max-w-[620px] space-y-4 pb-8">
        <div className="no-scrollbar bleed flex gap-2 overflow-x-auto">
          {SPEAK_LEVELS.map((lv) => (
            <Chip
              key={lv.id}
              active={level === lv.id}
              onClick={() => {
                setLevel(lv.id)
                sfx('tap')
              }}
            >
              {lv.id}. {t(lv.th, lv.en)}
              {progress[`speak:${lesson.id}:${lv.id}`] && ' ✓'}
            </Chip>
          ))}
        </div>

        <p className="text-center text-sm font-semibold text-ink-500">
          {t(SPEAK_LEVELS[level - 1].hintTh, SPEAK_LEVELS[level - 1].hintTh)}
        </p>

        <div className="flex items-center gap-3">
          <Progress value={idx + 1} max={lesson.lines.length} className="flex-1" />
          <span className="shrink-0 text-xs font-bold tabular-nums text-ink-500">
            {idx + 1}/{lesson.lines.length}
          </span>
        </div>

        <Card className="space-y-4 p-6 text-center">
          <span className="text-5xl">{lesson.emoji}</span>

          {level === 4 && !revealed ? (
            <p className="text-xl font-extrabold leading-snug text-ink-900">{th}</p>
          ) : level === 3 ? (
            <p className="text-2xl font-extrabold leading-snug text-ink-900">
              {gaps.map((g, i) => (
                <span key={i}>
                  {g.hidden && !revealed ? (
                    <span className="mx-1 inline-block min-w-14 rounded-lg bg-brand-100 px-2 align-middle text-brand-300">
                      ___
                    </span>
                  ) : (
                    ` ${g.w}`
                  )}
                </span>
              ))}
            </p>
          ) : (
            <p className="text-2xl font-extrabold leading-snug text-ink-900">{en}</p>
          )}

          {(level < 4 || revealed) && <p className="text-sm text-ink-500">{th}</p>}
          {level === 4 && revealed && <p className="text-lg font-bold text-brand-600">{en}</p>}

          <div className="flex justify-center gap-2.5 pt-1">
            <Button
              variant="soft"
              onClick={() => {
                speak(en, { lang: 'en-US' })
              }}
            >
              <Icon name="volume" size={17} /> {t('ฟัง', 'Listen')}
            </Button>
            <Button
              variant="white"
              onClick={() => speak(en, { lang: 'en-US', rate: Math.max(0.5, rate * 0.6) })}
            >
              🐢 {t('ช้า ๆ', 'Slow')}
            </Button>
          </div>

          {level >= 3 && (
            <button
              type="button"
              onClick={() => {
                setRevealed((r) => !r)
                sfx('tap')
              }}
              className="press text-sm font-bold text-brand-600"
            >
              {revealed ? t('ซ่อนคำตอบ', 'Hide answer') : t('ดูคำตอบ', 'Show answer')}
            </button>
          )}
        </Card>

        {/* Mic check */}
        {SR ? (
          <Card className="space-y-3 p-4 text-center">
            <button
              type="button"
              onClick={listen}
              disabled={listening}
              className={`press mx-auto grid size-16 place-items-center rounded-full text-white transition ${
                listening ? 'animate-pulse bg-brand-600' : 'bg-brand-500'
              }`}
              aria-label={t('กดแล้วพูด', 'Tap and speak')}
            >
              <Icon name="mic" size={26} />
            </button>
            <p className="text-sm font-semibold text-ink-500">
              {listening
                ? t('กำลังฟัง… พูดได้เลย', 'Listening… speak now')
                : t('กดไมค์แล้วพูดตาม', 'Tap the mic and say it')}
            </p>
            {heard && (
              <p
                className={`rounded-2xl px-4 py-2.5 text-sm font-semibold ${
                  status === 'ok' ? 'bg-sage text-sage-ink' : 'bg-clay text-clay-ink'
                }`}
              >
                {status === 'ok' ? '✅ ' : '🔁 '}
                {t('ได้ยินว่า', 'Heard')}: “{heard}”
              </p>
            )}
          </Card>
        ) : (
          <Card className="p-4 text-center text-sm text-ink-500">
            {t(
              'เบราว์เซอร์นี้ยังไม่รองรับไมค์ตรวจการพูด — ใช้ปุ่มฟังแล้วพูดตามพร้อมลูกได้เลย',
              'This browser has no speech recognition — just listen and repeat together.',
            )}
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            variant="white"
            className="!w-auto"
            disabled={idx === 0}
            onClick={() => {
              setIdx(idx - 1)
              setHeard('')
              setStatus(null)
              setRevealed(false)
            }}
          >
            <Icon name="back" size={16} />
          </Button>
          <Button className="flex-1" onClick={next}>
            {last
              ? level < 4
                ? t('ไประดับถัดไป', 'Next level')
                : t('จบบทเรียน', 'Finish')
              : t('ประโยคถัดไป', 'Next line')}
            <Icon name="arrowRight" size={16} />
          </Button>
        </div>
      </div>
    </>
  )
}
