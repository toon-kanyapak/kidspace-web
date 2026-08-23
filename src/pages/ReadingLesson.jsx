import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card, Progress } from '../components/ui'
import { WinScreen } from '../components/GameShell'
import { READING_LEVELS, readingById } from '../data/reading'
import { useApp } from '../store/AppContext'
import { scrollScreenTop } from '../lib/scroll'

export default function ReadingLesson() {
  const { id } = useParams()
  const { t, sfx, addStars, markDone, progress, speak } = useApp()
  const r = readingById(id)

  const [stage, setStage] = useState('read') // read | quiz | done
  const [qi, setQi] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)

  if (!r) return <Navigate to="/reading" replace />
  const lv = READING_LEVELS.find((l) => l.id === r.level)
  const q = r.qs[qi]

  const restart = () => {
    setStage('read')
    setQi(0)
    setPicked(null)
    setScore(0)
  }

  const choose = (i) => {
    if (picked != null) return
    setPicked(i)
    const ok = i === q.a
    sfx(ok ? 'good' : 'wrong')
    if (ok) setScore((s) => s + 1)
    setTimeout(() => {
      if (qi + 1 >= r.qs.length) {
        const key = `reading:${r.id}`
        if (!progress[key]) addStars(3)
        markDone(key, true)
        setStage('done')
        scrollScreenTop(false)
        sfx('great')
      } else {
        setQi(qi + 1)
        setPicked(null)
      }
    }, 850)
  }

  if (stage === 'done') {
    const pct = score / r.qs.length
    return (
      <>
        <PageHeader title={r.th} to="/reading" />
        <WinScreen
          emoji={r.emoji}
          title={pct === 1 ? t('ตอบถูกหมดเลย!', 'All correct!') : t('เก่งมาก!', 'Nice work!')}
          subtitle={t(`ตอบถูก ${score} จาก ${r.qs.length} ข้อ`, `${score} of ${r.qs.length} correct`)}
          stars={pct === 1 ? 3 : pct >= 0.6 ? 2 : 1}
          onAgain={restart}
          backTo="/reading"
          backLabel={t('เรื่องอื่น', 'Other stories')}
        />
      </>
    )
  }

  return (
    <>
      <PageHeader title={r.th} to="/reading" />
      <div className="mx-auto w-full max-w-[640px] space-y-4 pb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
          {lv.th} · {lv.age}
        </span>

        <Card className="space-y-3 p-5">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{r.emoji}</span>
            <p className="flex-1 text-[16px] leading-[2] text-ink-900">{r.text}</p>
          </div>
          <button
            type="button"
            onClick={() => speak(r.text, { lang: 'th-TH' })}
            className="press inline-flex items-center gap-1.5 text-sm font-bold text-brand-600"
          >
            <Icon name="volume" size={15} /> {t('อ่านให้ฟัง', 'Read aloud')}
          </button>
        </Card>

        {stage === 'read' ? (
          <Button
            size="lg"
            onClick={() => {
              setStage('quiz')
              sfx('tap')
              scrollScreenTop()
            }}
          >
            {t('อ่านจบแล้ว ไปตอบคำถาม', 'Done reading — answer questions')}{' '}
            <Icon name="arrowRight" size={16} />
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Progress value={qi + 1} max={r.qs.length} className="flex-1" />
              <span className="shrink-0 text-xs font-bold tabular-nums text-ink-500">
                {qi + 1}/{r.qs.length}
              </span>
            </div>
            <Card key={qi} className="animate-rise space-y-3 p-5">
              <p className="text-lg font-extrabold leading-snug text-ink-900">{q.q}</p>
              <div className="space-y-2.5">
                {q.choices.map((c, i) => {
                  const isRight = i === q.a
                  const isPicked = picked === i
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => choose(i)}
                      className={`press flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left font-semibold border-2 transition ${
                        picked != null && isRight
                          ? 'bg-sage text-sage-ink border-sage-ink'
                          : isPicked
                            ? 'animate-shake bg-clay text-clay-ink border-clay-ink'
                            : 'bg-surface text-ink-900 border-edge'
                      }`}
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-extrabold text-brand-700">
                        {['ก', 'ข', 'ค'][i] ?? i + 1}
                      </span>
                      {c}
                    </button>
                  )
                })}
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  )
}
