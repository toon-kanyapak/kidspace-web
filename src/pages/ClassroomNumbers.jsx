import { useCallback, useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Card, Chip } from '../components/ui'
import { WinScreen } from '../components/GameShell'
import { useApp } from '../store/AppContext'

const NAMES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
]

const RANGES = [
  { id: '1-10', th: '1–10', from: 1, to: 10 },
  { id: '1-20', th: '1–20', from: 1, to: 20 },
]

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

export default function ClassroomNumbers() {
  const { t, speak, sfx, addStars } = useApp()
  const [range, setRange] = useState('1-10')
  const [target, setTarget] = useState(null)
  const [choices, setChoices] = useState([])
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [done, setDone] = useState(false)

  const cfg = RANGES.find((r) => r.id === range)

  const nextRound = useCallback(() => {
    const pool = Array.from({ length: cfg.to - cfg.from + 1 }, (_, i) => cfg.from + i)
    const answer = pool[Math.floor(Math.random() * pool.length)]
    const others = shuffle(pool.filter((n) => n !== answer)).slice(0, 3)
    setTarget(answer)
    setChoices(shuffle([answer, ...others]))
    setPicked(null)
  }, [cfg])

  useEffect(() => {
    setRound(0)
    setScore(0)
    setDone(false)
    nextRound()
  }, [range, nextRound])
  useEffect(() => {
    if (target != null) speak(NAMES[target], { lang: 'en-US' })
  }, [target, speak])

  const choose = (n) => {
    if (picked != null) return
    setPicked(n)
    const ok = n === target
    sfx(ok ? 'good' : 'wrong')
    if (ok) setScore((s) => s + 1)
    setTimeout(() => {
      if (round + 1 >= 10) {
        setDone(true)
        addStars(3)
        sfx('great')
      } else {
        setRound(round + 1)
        nextRound()
      }
    }, 750)
  }

  if (done) {
    return (
      <>
        <PageHeader title={t('ฟังเลขอังกฤษ', 'Listen to numbers')} to="/classroom" />
        <WinScreen
          emoji="🔢"
          title={t('จบรอบแล้ว!', 'Round complete!')}
          subtitle={t(`ตอบถูก ${score} จาก 10`, `${score} of 10 correct`)}
          stars={score >= 9 ? 3 : score >= 6 ? 2 : 1}
          onAgain={() => {
            setRound(0)
            setScore(0)
            setDone(false)
            nextRound()
          }}
          backTo="/classroom"
        />
      </>
    )
  }

  return (
    <>
      <PageHeader title={t('ฟังเลขอังกฤษ', 'Listen to numbers')} to="/classroom" />
      <div className="mx-auto w-full max-w-[560px] space-y-4 pb-8">
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <Chip
              key={r.id}
              active={range === r.id}
              onClick={() => {
                setRange(r.id)
                sfx('tap')
              }}
            >
              {r.th}
            </Chip>
          ))}
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-sm font-bold text-ink-700 border-[1.5px] border-edge">
            {round + 1}/10 · <Icon name="star" size={13} className="fill-brand-300 text-brand-500" /> {score}
          </span>
        </div>

        <Card className="flex flex-col items-center gap-3 bg-sky p-8">
          <button
            type="button"
            onClick={() => speak(NAMES[target], { lang: 'en-US' })}
            className="press grid size-24 place-items-center rounded-full bg-surface text-brand-600 shadow-md"
            aria-label={t('ฟังอีกครั้ง', 'Listen again')}
          >
            <Icon name="volume" size={40} />
          </button>
          <p className="text-sm font-semibold text-ink-700">
            {t('แตะเพื่อฟังอีกครั้ง แล้วเลือกตัวเลขที่ได้ยิน', 'Tap to hear again, then pick the number')}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {choices.map((n) => {
            const isPicked = picked === n
            const isRight = n === target
            return (
              <button
                key={n}
                type="button"
                onClick={() => choose(n)}
                className={`press grid aspect-[3/2] place-items-center rounded-3xl text-5xl font-extrabold border-2 transition ${
                  picked != null && isRight
                    ? 'bg-sage text-sage-ink border-sage-ink'
                    : isPicked
                      ? 'animate-shake bg-clay text-clay-ink border-clay-ink'
                      : 'bg-surface text-ink-900 border-edge'
                }`}
              >
                {n}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
