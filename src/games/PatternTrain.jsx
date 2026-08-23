import { useCallback, useState } from 'react'
import GameShell, { WinScreen } from '../components/GameShell'
import { useApp } from '../store/AppContext'

const CARS = ['🟥', '🟦', '🟨', '🟩', '🟪', '🟧']
const PATTERNS = [
  { id: 'AB', len: 2 },
  { id: 'AAB', len: 3 },
  { id: 'ABC', len: 3 },
  { id: 'ABB', len: 3 },
]
const ROUNDS = 7
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

function makeRound(round) {
  const pat = PATTERNS[Math.min(Math.floor(round / 2), PATTERNS.length - 1)]
  const colours = shuffle(CARS).slice(0, 3)
  const map = { A: colours[0], B: colours[1], C: colours[2] }
  const unit = pat.id.split('').map((k) => map[k])
  const visible = []
  while (visible.length < unit.length * 2 + 1) visible.push(unit[visible.length % unit.length])
  const answer = unit[visible.length % unit.length]
  const wrongs = shuffle(colours.filter((c) => c !== answer)).slice(0, 2)
  return { visible, answer, choices: shuffle([answer, ...wrongs]), label: pat.id }
}

export default function PatternTrain() {
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

  const choose = (c) => {
    if (picked) return
    setPicked(c)
    const ok = c === r.answer
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
    }, 850)
  }

  if (done) {
    return (
      <GameShell title={t('รถไฟแพตเทิร์น', 'Pattern train')} backTo="/games">
        <WinScreen
          emoji="🚂"
          title={t('รถไฟวิ่งได้แล้ว!', 'The train is rolling!')}
          subtitle={t(`ตอบถูก ${score}/${ROUNDS}`, `${score}/${ROUNDS} correct`)}
          stars={score >= 6 ? 3 : score >= 4 ? 2 : 1}
          onAgain={restart}
          backTo="/games"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={t('รถไฟแพตเทิร์น', 'Pattern train')}
      backTo="/games"
      hint={t(
        'ตู้ถัดไปควรเป็นสีอะไร? สังเกตแบบซ้ำ ๆ ของตู้ก่อนหน้า',
        'What colour comes next? Look at the repeating pattern.',
      )}
      score={score}
      level={round + 1}
      onRestart={restart}
    >
      <div className="overflow-x-auto rounded-3xl bg-clay p-4">
        <div className="flex items-center gap-1.5">
          <span className="shrink-0 text-3xl">🚂</span>
          {r.visible.map((c, i) => (
            <span
              key={i}
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface/70 text-2xl"
            >
              {c}
            </span>
          ))}
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-xl text-2xl border-2 border-dashed border-clay-ink ${picked ? 'bg-surface' : 'bg-surface/40'}`}
          >
            {picked ? <span className="animate-pop">{r.answer}</span> : '❓'}
          </span>
        </div>
        <p className="mt-3 text-center text-xs font-bold text-clay-ink">
          {t('แบบ', 'Pattern')} {r.label}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {r.choices.map((c) => {
          const isRight = c === r.answer
          const isPicked = picked === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => choose(c)}
              className={`press grid aspect-square place-items-center rounded-3xl text-5xl border-2 transition ${
                picked && isRight
                  ? 'bg-sage border-sage-ink'
                  : isPicked
                    ? 'animate-shake bg-clay border-clay-ink'
                    : 'bg-surface border-edge'
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
