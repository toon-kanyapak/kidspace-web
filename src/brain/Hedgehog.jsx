import { useCallback, useEffect, useRef, useState } from 'react'
import GameShell, { WinScreen } from '../components/GameShell'
import { useApp } from '../store/AppContext'

const GOOD = ['🐰', '🐸', '🐥', '🐨', '🐼']
const BAD = '🦔'
const HOLES = 9
const DURATION = 45

export default function Hedgehog() {
  const { t, sfx, addStars } = useApp()
  const [active, setActive] = useState(null) // { hole, emoji, bad }
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)
  const [left, setLeft] = useState(DURATION)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [flash, setFlash] = useState(null)
  const popTimer = useRef(null)
  const tickTimer = useRef(null)
  const roundRef = useRef(0)

  const clearAll = () => {
    clearTimeout(popTimer.current)
    clearInterval(tickTimer.current)
  }

  const pop = useCallback(() => {
    const bad = Math.random() < 0.3
    const emoji = bad ? BAD : GOOD[Math.floor(Math.random() * GOOD.length)]
    const hole = Math.floor(Math.random() * HOLES)
    const id = ++roundRef.current
    setActive({ hole, emoji, bad, id })
    const speed = Math.max(520, 1300 - roundRef.current * 22)
    popTimer.current = setTimeout(() => {
      setActive((a) => {
        if (a && a.id === id && !a.bad) setMiss((m) => m + 1)
        return null
      })
      popTimer.current = setTimeout(pop, 260)
    }, speed)
  }, [])

  const start = useCallback(() => {
    clearAll()
    roundRef.current = 0
    setScore(0)
    setMiss(0)
    setLeft(DURATION)
    setDone(false)
    setActive(null)
    setRunning(true)
    pop()
    tickTimer.current = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearAll()
          setRunning(false)
          setDone(true)
          addStars(2)
          sfx('great')
          return 0
        }
        return s - 1
      })
    }, 1000)
  }, [pop, addStars, sfx])

  useEffect(() => () => clearAll(), [])

  const hit = (hole) => {
    if (!running || !active || active.hole !== hole) return
    if (active.bad) {
      setMiss((m) => m + 1)
      setScore((s) => Math.max(0, s - 1))
      setFlash('bad')
      sfx('wrong')
    } else {
      setScore((s) => s + 1)
      setFlash('good')
      sfx('good')
    }
    setActive(null)
    setTimeout(() => setFlash(null), 220)
  }

  if (done) {
    return (
      <GameShell title={t('เม่นห้ามแตะ', 'Hedgehog no-touch')} backTo="/brain">
        <WinScreen
          emoji="🦔"
          title={t('หมดเวลา!', 'Time’s up!')}
          subtitle={t(`ได้ ${score} คะแนน · พลาด ${miss} ครั้ง`, `${score} points · ${miss} misses`)}
          stars={score >= 25 ? 3 : score >= 15 ? 2 : 1}
          onAgain={start}
          backTo="/brain"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={t('เม่นห้ามแตะ', 'Hedgehog no-touch')}
      backTo="/brain"
      hint={t(
        'แตะสัตว์ที่โผล่ขึ้นมาให้ไว แต่ถ้าเป็นเม่น 🦔 ห้ามแตะ!',
        'Tap the animals fast — but never the hedgehog 🦔!',
      )}
      score={score}
      onRestart={start}
    >
      <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 border-[1.5px] border-edge">
        <span className="text-sm font-bold text-ink-700">⏱ {left}s</span>
        <span className="text-sm font-bold text-ink-500">
          {t('พลาด', 'Misses')} {miss}
        </span>
      </div>

      <div
        className={`grid grid-cols-3 gap-3 rounded-3xl p-3 transition ${flash === 'good' ? 'bg-sage' : flash === 'bad' ? 'bg-clay' : 'bg-sage'}`}
      >
        {Array.from({ length: HOLES }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => hit(i)}
            className="press grid aspect-square place-items-center rounded-full bg-surface/70 text-4xl border-[1.5px] border-white"
          >
            {active?.hole === i ? (
              <span className="animate-pop">{active.emoji}</span>
            ) : (
              <span className="opacity-20">🕳️</span>
            )}
          </button>
        ))}
      </div>

      {!running && (
        <button
          type="button"
          onClick={start}
          className="press w-full rounded-full bg-brand-500 py-4 font-bold text-white"
        >
          {t('เริ่มเล่น', 'Start')}
        </button>
      )}
    </GameShell>
  )
}
