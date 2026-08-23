import { useCallback, useEffect, useRef, useState } from 'react'
import GameShell, { WinScreen } from '../components/GameShell'
import { useApp } from '../store/AppContext'

const ITEMS = ['🍎', '🚗', '🐶', '⚽', '🎈', '🧸', '🍌', '🐟', '🌸', '🔑', '🍪', '🎩', '🦋', '🍇', '🚀']
const ROUNDS = 6
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

const makeRound = (round) => {
  const n = Math.min(4 + Math.floor(round / 2), 8)
  const items = shuffle(ITEMS).slice(0, n)
  const missing = items[Math.floor(Math.random() * n)]
  return { items, missing, shown: items.filter((i) => i !== missing) }
}

export default function WhatsMissing() {
  const { t, sfx, addStars } = useApp()
  const [round, setRound] = useState(0)
  const [r, setR] = useState(() => makeRound(0))
  const [phase, setPhase] = useState('memorise') // memorise | dark | guess
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => () => clearTimers(), [])

  const runRound = useCallback((nr) => {
    clearTimers()
    setR(nr)
    setPicked(null)
    setPhase('memorise')
    timers.current.push(setTimeout(() => setPhase('dark'), 3200))
    timers.current.push(setTimeout(() => setPhase('guess'), 4000))
  }, [])

  useEffect(() => {
    runRound(makeRound(0))
  }, [runRound])

  const restart = useCallback(() => {
    setRound(0)
    setScore(0)
    setDone(false)
    runRound(makeRound(0))
  }, [runRound])

  const choose = (item) => {
    if (phase !== 'guess' || picked) return
    setPicked(item)
    const ok = item === r.missing
    sfx(ok ? 'good' : 'wrong')
    if (ok) setScore((s) => s + 1)
    timers.current.push(
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          setDone(true)
          addStars(2)
          sfx('great')
        } else {
          setRound(round + 1)
          runRound(makeRound(round + 1))
        }
      }, 900),
    )
  }

  if (done) {
    return (
      <GameShell title={t('อะไรหายไป', 'What’s missing')} backTo="/brain">
        <WinScreen
          emoji="🕵️"
          title={t('ความจำดีมาก!', 'Great memory!')}
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
      title={t('อะไรหายไป', 'What’s missing')}
      backTo="/brain"
      hint={
        phase === 'memorise'
          ? t('จำของทั้งหมดไว้นะ…', 'Memorise everything…')
          : phase === 'dark'
            ? t('ปิดไฟแล้ว!', 'Lights out!')
            : t('อะไรหายไป? แตะเลย', 'What’s missing? Tap it.')
      }
      score={score}
      level={round + 1}
      onRestart={restart}
    >
      <div
        className={`grid min-h-52 grid-cols-4 place-items-center gap-3 rounded-3xl p-5 transition-colors duration-300 ${
          phase === 'dark' ? 'bg-ink-900' : 'bg-lilac'
        }`}
      >
        {phase === 'dark' ? (
          <span className="col-span-4 text-5xl">🌑</span>
        ) : (
          (phase === 'memorise' ? r.items : r.shown).map((it, i) => (
            <span key={`${it}${i}`} className="animate-pop text-4xl">
              {it}
            </span>
          ))
        )}
      </div>

      {phase === 'guess' && (
        <div className="grid grid-cols-4 gap-2.5">
          {r.items.map((it) => {
            const isRight = it === r.missing
            const isPicked = picked === it
            return (
              <button
                key={it}
                type="button"
                onClick={() => choose(it)}
                className={`press grid aspect-square place-items-center rounded-2xl text-3xl border-2 transition ${
                  picked && isRight
                    ? 'bg-sage border-sage-ink'
                    : isPicked
                      ? 'animate-shake bg-clay border-clay-ink'
                      : 'bg-surface border-edge'
                }`}
              >
                {it}
              </button>
            )
          })}
        </div>
      )}
    </GameShell>
  )
}
