import { useCallback, useState } from 'react'
import GameShell, { WinScreen } from '../components/GameShell'
import { useApp } from '../store/AppContext'

const ROUNDS = 8
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

function makeRound(level) {
  const max = level < 4 ? 10 : 20
  const plus = Math.random() < 0.5
  let a = 1 + Math.floor(Math.random() * (max - 1))
  let b = 1 + Math.floor(Math.random() * (max - a))
  if (!plus) {
    const s = a + b
    a = s
    b = Math.min(b, a - 1)
  }
  const answer = plus ? a + b : a - b
  const wrongs = new Set()
  while (wrongs.size < 3) {
    const w = answer + (Math.floor(Math.random() * 7) - 3)
    if (w !== answer && w >= 0) wrongs.add(w)
  }
  return { a, b, plus, answer, choices: shuffle([answer, ...wrongs]) }
}

export default function MonkeyMath() {
  const { t, sfx, addStars } = useApp()
  const [round, setRound] = useState(0)
  const [r, setR] = useState(() => makeRound(0))
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)

  const restart = useCallback(() => {
    setRound(0)
    setR(makeRound(0))
    setScore(0)
    setPicked(null)
    setDone(false)
  }, [])

  const choose = (n) => {
    if (picked != null) return
    setPicked(n)
    const ok = n === r.answer
    sfx(ok ? 'good' : 'wrong')
    if (ok) setScore((s) => s + 1)
    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        setDone(true)
        addStars(3)
        sfx('great')
      } else {
        setRound(round + 1)
        setR(makeRound(round + 1))
        setPicked(null)
      }
    }, 800)
  }

  if (done) {
    return (
      <GameShell title={t('ลิงบวกลบ', 'Monkey math')} backTo="/games">
        <WinScreen
          emoji="🐵"
          title={t('เยี่ยมมาก!', 'Excellent!')}
          subtitle={t(`ตอบถูก ${score}/${ROUNDS}`, `${score}/${ROUNDS} correct`)}
          stars={score >= 7 ? 3 : score >= 5 ? 2 : 1}
          onAgain={restart}
          backTo="/games"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={t('ลิงบวกลบ', 'Monkey math')}
      backTo="/games"
      hint={t('นับกล้วยแล้วเลือกคำตอบ', 'Count the bananas, then pick the answer')}
      score={score}
      level={round + 1}
      onRestart={restart}
    >
      <div className="space-y-3 rounded-3xl bg-butter p-5 text-center">
        <span className="text-5xl">🐵</span>
        <div className="flex flex-wrap items-center justify-center gap-1 text-2xl">
          {Array.from({ length: Math.min(r.a, 20) }, (_, i) => (
            <span key={i}>🍌</span>
          ))}
        </div>
        <p className="text-3xl font-extrabold text-ink-900">
          {r.a} {r.plus ? '+' : '−'} {r.b} = ?
        </p>
        <p className="text-sm font-semibold text-butter-ink">
          {r.plus
            ? t(`ลิงเจอกล้วยเพิ่มอีก ${r.b} ลูก`, `The monkey finds ${r.b} more`)
            : t(`ลิงกินไป ${r.b} ลูก`, `The monkey eats ${r.b}`)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {r.choices.map((c) => {
          const isRight = c === r.answer
          const isPicked = picked === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => choose(c)}
              className={`press rounded-3xl py-6 text-3xl font-extrabold border-2 transition ${
                picked != null && isRight
                  ? 'bg-sage text-sage-ink border-sage-ink'
                  : isPicked
                    ? 'animate-shake bg-clay text-clay-ink border-clay-ink'
                    : 'bg-surface text-ink-900 border-edge'
              }`}
            >
              {c}
            </button>
          )
        })}
      </div>
    </GameShell>
  )
}
