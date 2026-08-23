import { useCallback, useMemo, useState } from 'react'
import GameShell, { WinScreen } from '../components/GameShell'
import { useApp } from '../store/AppContext'

const BALLOONS = ['🎈', '🟡', '🟣', '🟢', '🔵']
const ANIMALS = ['🐶', '🐱', '🐰', '🐼', '🦊']
const ROUNDS = 6
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

function makeRound(round) {
  const n = Math.min(3 + Math.floor(round / 2), 5)
  const tops = BALLOONS.slice(0, n)
  const bottoms = ANIMALS.slice(0, n)
  const mapping = shuffle([...Array(n).keys()]) // tops[i] -> bottoms[mapping[i]]
  const askTop = Math.floor(Math.random() * n)
  return { n, tops, bottoms, mapping, askTop }
}

export default function Tangled() {
  const { t, sfx, addStars } = useApp()
  const [round, setRound] = useState(0)
  const [r, setR] = useState(() => makeRound(0))
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)

  const answer = r.mapping[r.askTop]

  const restart = useCallback(() => {
    setRound(0)
    setR(makeRound(0))
    setScore(0)
    setPicked(null)
    setDone(false)
  }, [])

  // build wavy SVG paths from each top point to its bottom point
  const paths = useMemo(() => {
    const W = 300,
      H = 190
    const step = W / (r.n + 1)
    return r.mapping.map((to, from) => {
      const x1 = step * (from + 1)
      const x2 = step * (to + 1)
      const mid = H / 2
      return {
        d: `M ${x1} 12 C ${x1} ${mid - 20}, ${x2} ${mid + 20}, ${x2} ${H - 12}`,
        from,
        hue: [340, 200, 45, 130, 275][from % 5],
      }
    })
  }, [r])

  const choose = (i) => {
    if (picked != null) return
    setPicked(i)
    const ok = i === answer
    sfx(ok ? 'good' : 'wrong')
    if (ok) setScore((s) => s + 1)
    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        setDone(true)
        addStars(2)
        sfx('great')
      } else {
        setRound(round + 1)
        setR(makeRound(round + 1))
        setPicked(null)
      }
    }, 950)
  }

  if (done) {
    return (
      <GameShell title={t('เส้นพันกัน', 'Tangled lines')} backTo="/brain">
        <WinScreen
          emoji="🎈"
          title={t('สายตาไวมาก!', 'Sharp tracking!')}
          subtitle={t(`ตอบถูก ${score}/${ROUNDS}`, `${score}/${ROUNDS} correct`)}
          stars={score >= 5 ? 3 : score >= 3 ? 2 : 1}
          onAgain={restart}
          backTo="/brain"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={t('เส้นพันกัน', 'Tangled lines')}
      backTo="/brain"
      hint={t(
        'ใช้สายตาไล่เส้นจากลูกโป่งที่เรืองแสง ไปดูว่าปลายทางคือสัตว์ตัวไหน',
        'Follow the glowing balloon’s string with your eyes — which animal is at the end?',
      )}
      score={score}
      level={round + 1}
      onRestart={restart}
    >
      <div className="rounded-3xl bg-surface p-3 border-[1.5px] border-edge">
        <div className="mb-1 flex justify-around">
          {r.tops.map((b, i) => (
            <span
              key={i}
              className={`text-3xl transition ${i === r.askTop ? 'scale-125 drop-shadow-[0_0_10px_rgba(249,127,175,.9)]' : 'opacity-40'}`}
            >
              {b}
            </span>
          ))}
        </div>
        <svg viewBox="0 0 300 190" className="h-44 w-full">
          {paths.map((p) => (
            <path
              key={p.from}
              d={p.d}
              fill="none"
              strokeWidth={p.from === r.askTop && picked != null ? 5 : 3}
              strokeLinecap="round"
              stroke={p.from === r.askTop && picked != null ? '#f97faf' : `hsl(${p.hue} 65% 72%)`}
              opacity={picked != null && p.from !== r.askTop ? 0.25 : 1}
            />
          ))}
        </svg>
        <div className="mt-1 flex justify-around">
          {r.bottoms.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              className={`press grid size-14 place-items-center rounded-2xl text-3xl border-2 transition ${
                picked != null && i === answer
                  ? 'bg-sage border-sage-ink'
                  : picked === i
                    ? 'animate-shake bg-clay border-clay-ink'
                    : 'bg-brand-50 border-transparent'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-sm font-bold text-ink-700">
        {t('ลูกโป่ง', 'Balloon')} <span className="text-xl">{r.tops[r.askTop]}</span>{' '}
        {t('ผูกอยู่กับสัตว์ตัวไหน?', 'is tied to which animal?')}
      </p>
    </GameShell>
  )
}
