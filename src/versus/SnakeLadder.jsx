import { useCallback, useEffect, useState } from 'react'
import Icon from '../components/Icon'
import GameShell from '../components/GameShell'
import { Button } from '../components/ui'
import { WORD_SETS } from '../data/words'
import { useApp } from '../store/AppContext'

const BOARD = 30
const SNAKES = { 27: 9, 21: 4, 17: 6 }
const LADDERS = { 3: 12, 8: 19, 14: 24 }
const ALL = WORD_SETS.flatMap((s) => s.words)
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

const makeQ = () => {
  const pool = shuffle(ALL)
  const answer = pool[0]
  return { answer, choices: shuffle(pool.slice(0, 4)) }
}

export default function SnakeLadder() {
  const { t, speak, sfx, addStars } = useApp()
  const [pos, setPos] = useState([0, 0])
  const [turn, setTurn] = useState(0)
  const [q, setQ] = useState(makeQ)
  const [picked, setPicked] = useState(null)
  const [dice, setDice] = useState(null)
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    if (!winner) speak(q.answer.en, { lang: 'en-US' })
  }, [q, speak, winner])

  const reset = useCallback(() => {
    setPos([0, 0])
    setTurn(0)
    setQ(makeQ())
    setPicked(null)
    setDice(null)
    setWinner(null)
  }, [])

  const choose = (w) => {
    if (picked || winner) return
    setPicked(w.en)
    const ok = w.en === q.answer.en
    sfx(ok ? 'good' : 'wrong')
    const roll = ok ? 1 + Math.floor(Math.random() * 4) : 0
    setDice(roll)
    setTimeout(() => {
      if (ok) {
        setPos((p) => {
          const np = [...p]
          let next = Math.min(BOARD, np[turn] + roll)
          if (SNAKES[next]) next = SNAKES[next]
          else if (LADDERS[next]) next = LADDERS[next]
          np[turn] = next
          if (next >= BOARD) {
            setWinner(turn)
            addStars(2)
            sfx('great')
          }
          return np
        })
      }
      setTurn((tn) => 1 - tn)
      setQ(makeQ())
      setPicked(null)
      setDice(null)
    }, 1100)
  }

  return (
    <GameShell
      title={t('บันไดงูคำศัพท์', 'Snakes & ladders')}
      backTo="/versus"
      hint={t(
        'ฟังคำอังกฤษแล้วแตะรูปให้ถูก ตอบถูกถึงจะได้ทอยเดิน 🪜 ขึ้น 🐍 ลง',
        'Listen and tap the right picture — a correct answer earns a roll. 🪜 up, 🐍 down.',
      )}
      onRestart={reset}
    >
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((p) => (
          <div
            key={p}
            className={`rounded-2xl px-4 py-3 text-center border-2 transition ${turn === p && !winner ? 'bg-surface border-brand-400' : 'bg-surface/60 border-transparent'}`}
          >
            <p className="text-xs font-bold text-ink-500">
              {t(`ผู้เล่น ${p + 1}`, `Player ${p + 1}`)} {p === 0 ? '🔴' : '🔵'}
            </p>
            <p className="text-2xl font-extrabold text-ink-900">
              {pos[p]}
              <span className="text-sm text-ink-300">/{BOARD}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-1 rounded-3xl bg-butter p-2.5">
        {Array.from({ length: BOARD }, (_, i) => {
          const n = i + 1
          const here = [pos[0] === n, pos[1] === n]
          return (
            <div
              key={n}
              className={`grid aspect-square place-items-center rounded-lg text-[10px] font-bold ${n === BOARD ? 'bg-brand-300 text-white' : 'bg-surface/80 text-ink-300'}`}
            >
              {here[0] || here[1] ? (
                <span className="animate-pop text-base">
                  {here[0] && here[1] ? '🟣' : here[0] ? '🔴' : '🔵'}
                </span>
              ) : SNAKES[n] ? (
                '🐍'
              ) : LADDERS[n] ? (
                '🪜'
              ) : n === BOARD ? (
                '🏁'
              ) : (
                n
              )}
            </div>
          )
        })}
      </div>

      {winner != null ? (
        <div className="animate-pop space-y-3 rounded-3xl bg-surface p-5 text-center border-[1.5px] border-edge">
          <p className="text-lg font-extrabold text-ink-900">
            {t(`ผู้เล่น ${winner + 1} ถึงเส้นชัย! 🎉`, `Player ${winner + 1} wins! 🎉`)}
          </p>
          <Button onClick={reset}>{t('เล่นอีกรอบ', 'Play again')}</Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2 rounded-3xl bg-surface p-5 border-[1.5px] border-edge">
            <p className="text-sm font-bold text-ink-500">
              {t(`ตาผู้เล่น ${turn + 1} — ฟังแล้วเลือกรูป`, `Player ${turn + 1} — listen and pick`)}
            </p>
            <button
              type="button"
              onClick={() => speak(q.answer.en, { lang: 'en-US' })}
              className="press grid size-16 place-items-center rounded-full bg-brand-500 text-white"
              aria-label={t('ฟังอีกครั้ง', 'Listen again')}
            >
              <Icon name="volume" size={26} />
            </button>
            {dice != null && (
              <p className="animate-pop text-sm font-extrabold text-brand-600">
                {dice
                  ? t(`ทอยได้ ${dice} ก้าว 🎲`, `Rolled ${dice} 🎲`)
                  : t('ยังไม่ได้เดิน ลองใหม่รอบหน้า', 'No move this turn')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {q.choices.map((w) => {
              const isRight = w.en === q.answer.en
              const isPicked = picked === w.en
              return (
                <button
                  key={w.en}
                  type="button"
                  onClick={() => choose(w)}
                  className={`press grid aspect-square place-items-center rounded-2xl text-3xl border-2 transition ${
                    picked && isRight
                      ? 'bg-sage border-sage-ink'
                      : isPicked
                        ? 'animate-shake bg-clay border-clay-ink'
                        : 'bg-surface border-edge'
                  }`}
                >
                  {w.emoji}
                </button>
              )
            })}
          </div>
        </>
      )}
    </GameShell>
  )
}
