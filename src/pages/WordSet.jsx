import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card, Chip, Progress, tint } from '../components/ui'
import { WORD_LEVELS, wordSetById } from '../data/words'
import { useApp } from '../store/AppContext'
import { WinScreen } from '../components/GameShell'
import { scrollScreenTop } from '../lib/scroll'

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

export default function WordSet() {
  const { id } = useParams()
  const { t, speak, sfx, addStars, markDone, progress } = useApp()
  const set = wordSetById(id)

  const [level, setLevel] = useState('listen')
  const [round, setRound] = useState(0)
  const [order, setOrder] = useState([])
  const [choices, setChoices] = useState([])
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [dragging, setDragging] = useState(null)
  const [solved, setSolved] = useState([])

  const target = order[round]

  const buildRound = useCallback(
    (r, ord) => {
      if (!set) return
      const correct = ord[r]
      if (!correct) return
      const others = shuffle(set.words.filter((w) => w.en !== correct.en)).slice(0, 3)
      setChoices(shuffle([correct, ...others]))
      setPicked(null)
    },
    [set],
  )

  const reset = useCallback(
    (lv = level) => {
      if (!set) return
      const ord = shuffle(set.words)
      setOrder(ord)
      setRound(0)
      setScore(0)
      setDone(false)
      setSolved([])
      setDragging(null)
      if (lv !== 'drag') buildRound(0, ord)
    },
    [set, level, buildRound],
  )

  useEffect(() => {
    reset(level) /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [id, level])

  // auto-play the word at the start of each listen round
  useEffect(() => {
    if (level === 'listen' && target) speak(target.en, { lang: 'en-US' })
  }, [level, target, speak])

  const dragPairs = useMemo(() => {
    if (!set || level !== 'drag') return { imgs: [], labels: [] }
    const four = order.slice(0, 4)
    return { imgs: four, labels: shuffle(four) }
  }, [set, order, level])

  if (!set) return <Navigate to="/words" replace />
  const tn = tint(set.tone)

  const finishLevel = () => {
    const key = `words:${set.id}:${level}`
    if (!progress[key]) addStars(3)
    markDone(key, true)
    setDone(true)
    scrollScreenTop(false)
    sfx('great')
  }

  const answer = (w) => {
    if (picked) return
    setPicked(w.en)
    const ok = w.en === target.en
    sfx(ok ? 'good' : 'wrong')
    if (ok) setScore((s) => s + 1)
    setTimeout(() => {
      if (round + 1 >= order.length) finishLevel()
      else {
        setRound(round + 1)
        buildRound(round + 1, order)
      }
    }, 750)
  }

  const dropOn = (img) => {
    if (!dragging) return
    if (dragging.en === img.en) {
      sfx('good')
      const nextSolved = [...solved, img.en]
      setSolved(nextSolved)
      setScore((s) => s + 1)
      if (nextSolved.length >= dragPairs.imgs.length) setTimeout(finishLevel, 400)
    } else {
      sfx('wrong')
    }
    setDragging(null)
  }

  if (done) {
    const lvIdx = WORD_LEVELS.findIndex((l) => l.id === level)
    const nextLv = WORD_LEVELS[lvIdx + 1]
    return (
      <>
        <PageHeader title={set.th} to="/words" />
        <WinScreen
          emoji={set.emoji}
          title={t('เก่งมาก!', 'Great job!')}
          subtitle={t(
            `ระดับ${WORD_LEVELS[lvIdx].th} · ได้ ${score} คะแนน`,
            `${WORD_LEVELS[lvIdx].en} · ${score} points`,
          )}
          stars={score >= order.length ? 3 : score >= order.length * 0.6 ? 2 : 1}
          onAgain={() => reset(level)}
          backTo="/words"
          backLabel={nextLv ? t('ชุดคำอื่น', 'Other sets') : t('กลับ', 'Back')}
        />
        {nextLv && (
          <Button className="mt-3" size="lg" onClick={() => setLevel(nextLv.id)}>
            {t(`ไประดับ${nextLv.th}`, `Go to ${nextLv.en}`)} <Icon name="arrowRight" size={16} />
          </Button>
        )}
      </>
    )
  }

  return (
    <>
      <PageHeader title={set.th} to="/words" />
      <div className="mx-auto w-full max-w-[560px] space-y-4 pb-8">
        <div className="flex gap-2">
          {WORD_LEVELS.map((lv) => (
            <Chip
              key={lv.id}
              active={level === lv.id}
              onClick={() => {
                setLevel(lv.id)
                sfx('tap')
              }}
            >
              {t(lv.th, lv.en)}
              {progress[`words:${set.id}:${lv.id}`] && ' ✓'}
            </Chip>
          ))}
        </div>
        <p className="text-center text-sm font-semibold text-ink-500">
          {WORD_LEVELS.find((l) => l.id === level).hintTh}
        </p>

        {level !== 'drag' && (
          <div className="flex items-center gap-3">
            <Progress value={round} max={order.length} className="flex-1" />
            <span className="shrink-0 text-xs font-bold tabular-nums text-ink-500">
              {round + 1}/{order.length}
            </span>
          </div>
        )}

        {/* --- LISTEN: hear the word, tap the picture --- */}
        {level === 'listen' && target && (
          <>
            <Card className={`flex flex-col items-center gap-3 ${tn.bg} p-6`}>
              <button
                type="button"
                onClick={() => speak(target.en, { lang: 'en-US' })}
                className="press grid size-20 place-items-center rounded-full bg-surface text-brand-600 shadow-md"
                aria-label={t('ฟังอีกครั้ง', 'Listen again')}
              >
                <Icon name="volume" size={34} />
              </button>
              <p className="text-sm font-semibold text-ink-700">
                {t('แตะเพื่อฟังอีกครั้ง', 'Tap to hear again')}
              </p>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              {choices.map((c) => {
                const isPicked = picked === c.en
                const isRight = c.en === target.en
                return (
                  <button
                    key={c.en}
                    type="button"
                    onClick={() => answer(c)}
                    className={`press grid aspect-square place-items-center rounded-3xl text-6xl border-2 transition ${
                      picked && isRight
                        ? 'bg-sage border-sage-ink'
                        : isPicked
                          ? 'animate-shake bg-clay border-clay-ink'
                          : 'bg-surface border-edge'
                    }`}
                  >
                    {c.emoji}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* --- DRAG: match word labels onto pictures --- */}
        {level === 'drag' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {dragPairs.imgs.map((img) => {
                const ok = solved.includes(img.en)
                return (
                  <div
                    key={img.en}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      dropOn(img)
                    }}
                    onClick={() => dragging && dropOn(img)}
                    className={`grid aspect-square place-items-center rounded-3xl text-5xl border-2 transition ${
                      ok
                        ? 'bg-sage border-sage-ink'
                        : dragging
                          ? 'bg-brand-50 border-brand-300'
                          : 'bg-surface border-edge'
                    }`}
                  >
                    <span>{img.emoji}</span>
                    {ok && <span className="mt-1 block text-xs font-extrabold text-sage-ink">{img.en}</span>}
                  </div>
                )
              })}
            </div>
            <p className="text-center text-xs text-ink-500">
              {t(
                'ลากคำไปวางบนรูป (หรือแตะคำแล้วแตะรูป)',
                'Drag a word onto a picture — or tap word then picture.',
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {dragPairs.labels
                .filter((l) => !solved.includes(l.en))
                .map((l) => (
                  <button
                    key={l.en}
                    type="button"
                    draggable
                    onDragStart={() => setDragging(l)}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => {
                      setDragging(dragging?.en === l.en ? null : l)
                      speak(l.en, { lang: 'en-US' })
                    }}
                    className={`press rounded-full px-4 py-2.5 font-extrabold border-2 transition ${
                      dragging?.en === l.en
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-surface text-ink-900 border-brand-200'
                    }`}
                  >
                    {l.en}
                  </button>
                ))}
            </div>
          </>
        )}

        {/* --- READ: see the picture, pick the written word --- */}
        {level === 'read' && target && (
          <>
            <Card className={`flex flex-col items-center gap-2 ${tn.bg} p-8`}>
              <span className="text-7xl">{target.emoji}</span>
              <span className="text-sm font-semibold text-ink-700">{target.th}</span>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              {choices.map((c) => {
                const isPicked = picked === c.en
                const isRight = c.en === target.en
                return (
                  <button
                    key={c.en}
                    type="button"
                    onClick={() => answer(c)}
                    className={`press rounded-2xl px-4 py-5 text-lg font-extrabold border-2 transition ${
                      picked && isRight
                        ? 'bg-sage text-sage-ink border-sage-ink'
                        : isPicked
                          ? 'animate-shake bg-clay text-clay-ink border-clay-ink'
                          : 'bg-surface text-ink-900 border-edge'
                    }`}
                  >
                    {c.en}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </>
  )
}
