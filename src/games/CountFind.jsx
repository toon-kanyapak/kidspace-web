import { useCallback, useMemo, useState } from 'react'
import GameShell, { WinScreen } from '../components/GameShell'
import { useApp } from '../store/AppContext'

const SETS = [
  ['🐟', '🐠', '🦑', '🐙'],
  ['🍎', '🍏', '🍐', '🍑'],
  ['⭐', '✨', '🌟', '💫'],
  ['🚗', '🚙', '🚕', '🚌'],
]
const ROUNDS = 6
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

function makeRound(round) {
  const set = SETS[Math.floor(Math.random() * SETS.length)]
  const target = set[0]
  const total = 14 + round * 3
  const count = 3 + Math.floor(Math.random() * 6)
  const grid = shuffle([
    ...Array.from({ length: count }, () => target),
    ...Array.from({ length: total - count }, () => set[1 + Math.floor(Math.random() * (set.length - 1))]),
  ])
  const wrongs = new Set()
  while (wrongs.size < 3) {
    const w = count + Math.floor(Math.random() * 5) - 2
    if (w !== count && w > 0) wrongs.add(w)
  }
  return { target, grid, count, choices: shuffle([count, ...wrongs]) }
}

export default function CountFind() {
  const { t, sfx, addStars } = useApp()
  const [round, setRound] = useState(0)
  const [r, setR] = useState(() => makeRound(0))
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)
  const [tapped, setTapped] = useState([])
  const [done, setDone] = useState(false)

  const restart = useCallback(() => {
    setRound(0)
    setR(makeRound(0))
    setScore(0)
    setPicked(null)
    setTapped([])
    setDone(false)
  }, [])

  const cols = useMemo(() => (r.grid.length > 22 ? 6 : 5), [r.grid.length])

  const choose = (n) => {
    if (picked != null) return
    setPicked(n)
    const ok = n === r.count
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
        setTapped([])
      }
    }, 900)
  }

  if (done) {
    return (
      <GameShell title={t('นับแล้วหา', 'Count and find')} backTo="/games">
        <WinScreen
          emoji="🔍"
          title={t('สายตาดีมาก!', 'Sharp eyes!')}
          subtitle={t(`ตอบถูก ${score}/${ROUNDS}`, `${score}/${ROUNDS} correct`)}
          stars={score >= 5 ? 3 : score >= 3 ? 2 : 1}
          onAgain={restart}
          backTo="/games"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={t('นับแล้วหา', 'Count and find')}
      backTo="/games"
      hint={t(
        `มี ${r.target} กี่ตัว? แตะเพื่อทำเครื่องหมายช่วยนับได้`,
        `How many ${r.target}? Tap them to mark as you count.`,
      )}
      score={score}
      level={round + 1}
      onRestart={restart}
    >
      <div className="rounded-3xl bg-sky p-3">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {r.grid.map((g, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTapped((tp) => (tp.includes(i) ? tp.filter((x) => x !== i) : [...tp, i]))
                sfx('tap')
              }}
              className={`press grid aspect-square place-items-center rounded-xl text-2xl transition ${
                tapped.includes(i) ? 'bg-brand-300/60 border-2 border-brand-500' : 'bg-surface/70'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm font-bold text-ink-700">
        {t('มี', 'How many')} <span className="text-2xl">{r.target}</span> {t('กี่ตัว?', '?')}
      </p>

      <div className="grid grid-cols-4 gap-2.5">
        {r.choices.map((c) => {
          const isRight = c === r.count
          const isPicked = picked === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => choose(c)}
              className={`press rounded-2xl py-5 text-2xl font-extrabold border-2 transition ${
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
