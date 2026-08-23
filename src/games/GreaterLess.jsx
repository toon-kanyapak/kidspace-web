import { useCallback, useEffect, useState } from 'react'
import GameShell, { WinScreen } from '../components/GameShell'
import { useApp } from '../store/AppContext'

const FRUIT = ['🍎', '🍌', '🍇', '🍓', '🍊', '🥝']
const OPS = [
  { id: 'gt', glyph: '>', th: 'มากกว่า' },
  { id: 'eq', glyph: '=', th: 'เท่ากับ' },
  { id: 'lt', glyph: '<', th: 'น้อยกว่า' },
]
const ROUNDS = 8

function makeRound() {
  const a = 1 + Math.floor(Math.random() * 9)
  const b = Math.random() < 0.25 ? a : 1 + Math.floor(Math.random() * 9)
  return { a, b, fruit: FRUIT[Math.floor(Math.random() * FRUIT.length)] }
}

export default function GreaterLess() {
  const { t, sfx, addStars } = useApp()
  const [r, setR] = useState(makeRound)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)

  const correct = r.a > r.b ? 'gt' : r.a < r.b ? 'lt' : 'eq'

  const restart = useCallback(() => {
    setR(makeRound())
    setRound(0)
    setScore(0)
    setPicked(null)
    setDone(false)
  }, [])

  useEffect(() => () => {}, [])

  const choose = (id) => {
    if (picked) return
    setPicked(id)
    const ok = id === correct
    sfx(ok ? 'good' : 'wrong')
    if (ok) setScore((s) => s + 1)
    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        setDone(true)
        addStars(3)
        sfx('great')
      } else {
        setRound(round + 1)
        setR(makeRound())
        setPicked(null)
      }
    }, 800)
  }

  if (done) {
    return (
      <GameShell title={t('มากกว่า–น้อยกว่า', 'Greater or less')} backTo="/games">
        <WinScreen
          emoji="🐊"
          title={t('เก่งมาก!', 'Great job!')}
          subtitle={t(`ตอบถูก ${score}/${ROUNDS}`, `${score}/${ROUNDS} correct`)}
          stars={score >= 7 ? 3 : score >= 5 ? 2 : 1}
          onAgain={restart}
          backTo="/games"
        />
      </GameShell>
    )
  }

  const Pile = ({ n }) => (
    <div className="grid flex-1 place-items-center gap-2 rounded-3xl bg-surface p-4 border-[1.5px] border-edge">
      <div className="grid grid-cols-3 gap-1 text-2xl">
        {Array.from({ length: n }, (_, i) => (
          <span key={i}>{r.fruit}</span>
        ))}
      </div>
      <span className="text-3xl font-extrabold text-ink-900">{n}</span>
    </div>
  )

  return (
    <GameShell
      title={t('มากกว่า–น้อยกว่า', 'Greater or less')}
      backTo="/games"
      hint={t(
        'ฝั่งไหนมากกว่า? จระเข้หิวจะอ้าปากไปทางฝั่งที่เยอะกว่าเสมอ',
        'Which side has more? The crocodile always opens toward the bigger pile.',
      )}
      score={score}
      level={round + 1}
      onRestart={restart}
    >
      <div className="flex items-stretch gap-3">
        <Pile n={r.a} />
        <div className="grid w-16 shrink-0 place-items-center text-4xl">
          {picked ? <span className="animate-pop">{OPS.find((o) => o.id === correct).glyph}</span> : '🐊'}
        </div>
        <Pile n={r.b} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {OPS.map((o) => {
          const isRight = o.id === correct
          const isPicked = picked === o.id
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id)}
              className={`press flex flex-col items-center gap-1 rounded-3xl py-5 border-2 transition ${
                picked && isRight
                  ? 'bg-sage text-sage-ink border-sage-ink'
                  : isPicked
                    ? 'animate-shake bg-clay text-clay-ink border-clay-ink'
                    : 'bg-surface text-ink-900 border-edge'
              }`}
            >
              <span className="text-4xl font-extrabold">{o.glyph}</span>
              <span className="text-xs font-bold">{o.th}</span>
            </button>
          )
        })}
      </div>
    </GameShell>
  )
}
