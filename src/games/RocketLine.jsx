import { useCallback, useState } from 'react'
import GameShell, { WinScreen } from '../components/GameShell'
import { useApp } from '../store/AppContext'

const MAX = 26
const ROUNDS = 7

function makeRound(round) {
  const from = Math.floor(Math.random() * (MAX - 8))
  const plus = round < 3 ? true : Math.random() < 0.6
  const step = 1 + Math.floor(Math.random() * (round < 3 ? 5 : 8))
  const to = plus ? Math.min(MAX, from + step) : Math.max(0, from - step)
  return { from, to, plus, step: Math.abs(to - from) }
}

export default function RocketLine() {
  const { t, sfx, addStars } = useApp()
  const [round, setRound] = useState(0)
  const [first] = useState(() => makeRound(0))
  const [r, setR] = useState(first)
  const [current, setPos] = useState(first.from)
  const [score, setScore] = useState(0)
  const [state, setState] = useState(null)
  const [done, setDone] = useState(false)

  const restart = useCallback(() => {
    const nr = makeRound(0)
    setRound(0)
    setR(nr)
    setPos(nr.from)
    setScore(0)
    setState(null)
    setDone(false)
  }, [])

  const tick = (d) => {
    if (state) return
    const nx = Math.max(0, Math.min(MAX, current + d))
    setPos(nx)
    sfx('tap')
  }

  const check = () => {
    if (current === r.to) {
      setState('ok')
      setScore((s) => s + 1)
      sfx('good')
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          setDone(true)
          addStars(3)
          sfx('great')
        } else {
          const nr = makeRound(round + 1)
          setRound(round + 1)
          setR(nr)
          setPos(nr.from)
          setState(null)
        }
      }, 800)
    } else {
      setState('no')
      sfx('wrong')
      setTimeout(() => setState(null), 600)
    }
  }

  if (done) {
    return (
      <GameShell title={t('จรวดเส้นจำนวน', 'Rocket number line')} backTo="/games">
        <WinScreen
          emoji="🚀"
          title={t('บินได้สวยมาก!', 'Perfect flight!')}
          subtitle={t(`ผ่าน ${score}/${ROUNDS} ด่าน`, `${score}/${ROUNDS} solved`)}
          stars={score >= 6 ? 3 : score >= 4 ? 2 : 1}
          onAgain={restart}
          backTo="/games"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={t('จรวดเส้นจำนวน', 'Rocket number line')}
      backTo="/games"
      hint={t(
        'เดินจรวดไปให้ถึงคำตอบ — บวกคือเดินหน้า ลบคือถอยหลัง',
        'Move the rocket to the answer — plus goes forward, minus goes back.',
      )}
      score={score}
      level={round + 1}
      onRestart={restart}
    >
      <div
        className={`rounded-3xl p-5 text-center transition ${state === 'ok' ? 'bg-sage' : state === 'no' ? 'animate-shake bg-clay' : 'bg-sky'}`}
      >
        <p className="text-3xl font-extrabold text-ink-900">
          {r.from} {r.plus ? '+' : '−'} {r.step} = ?
        </p>
        <p className="mt-1 text-sm font-semibold text-ink-500">
          {t('จรวดอยู่ที่', 'Rocket at')} <span className="font-extrabold text-brand-600">{current}</span>
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-surface p-3 border-[1.5px] border-edge">
        <div className="flex items-end gap-1" style={{ minWidth: `${(MAX + 1) * 30}px` }}>
          {Array.from({ length: MAX + 1 }, (_, n) => (
            <div key={n} className="flex w-7 shrink-0 flex-col items-center gap-1">
              <span className={`text-lg transition-opacity ${current === n ? 'opacity-100' : 'opacity-0'}`}>
                🚀
              </span>
              <span className={`h-6 w-1 rounded-full ${n % 5 === 0 ? 'bg-brand-300' : 'bg-brand-100'}`} />
              <span className={`text-[10px] font-bold ${current === n ? 'text-brand-600' : 'text-ink-300'}`}>
                {n}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => tick(-1)}
          className="press rounded-2xl bg-surface py-5 text-2xl border-[1.5px] border-edge"
        >
          ⬅️
        </button>
        <button
          type="button"
          onClick={check}
          className="press rounded-2xl bg-brand-500 py-5 font-extrabold text-white"
        >
          {t('ตรวจ', 'Check')}
        </button>
        <button
          type="button"
          onClick={() => tick(1)}
          className="press rounded-2xl bg-surface py-5 text-2xl border-[1.5px] border-edge"
        >
          ➡️
        </button>
      </div>
    </GameShell>
  )
}
