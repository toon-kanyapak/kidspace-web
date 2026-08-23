import { useCallback, useEffect, useRef, useState } from 'react'
import GameShell from '../components/GameShell'
import { Button, Chip } from '../components/ui'
import { useApp } from '../store/AppContext'

const PAIRS = [
  ['🐶', '🐕'],
  ['🍎', '🍏'],
  ['⭐', '🌟'],
  ['🐱', '🐈'],
  ['🌸', '🌺'],
  ['🔵', '🔷'],
  ['😀', '😃'],
  ['🚗', '🚙'],
]
const ROUNDS = 8

function makeRound(round, players) {
  const size = Math.min(4 + Math.floor(round / 3), 6)
  const [base, odd] = PAIRS[Math.floor(Math.random() * PAIRS.length)]
  const n = size * size
  const at = Math.floor(Math.random() * n)
  return { size, base, odd, at, players }
}

export default function SpotDiff() {
  const { t, sfx, addStars } = useApp()
  const [players, setPlayers] = useState(2)
  const [round, setRound] = useState(0)
  const [r, setR] = useState(() => makeRound(0, 2))
  const [scores, setScores] = useState([0, 0])
  const [flash, setFlash] = useState(null)
  const [done, setDone] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startAt = useRef(Date.now())
  const tick = useRef(null)

  const reset = useCallback(
    (p = players) => {
      clearInterval(tick.current)
      setRound(0)
      setR(makeRound(0, p))
      setScores([0, 0])
      setDone(false)
      setElapsed(0)
      startAt.current = Date.now()
      tick.current = setInterval(() => setElapsed(Math.floor((Date.now() - startAt.current) / 1000)), 500)
    },
    [players],
  )

  useEffect(() => {
    reset(players)
    return () => clearInterval(tick.current)
  }, [players, reset])

  const pick = (i, who) => {
    if (done) return
    if (i !== r.at) {
      setFlash('no')
      sfx('wrong')
      setTimeout(() => setFlash(null), 300)
      return
    }
    setScores((s) => s.map((v, k) => (k === who ? v + 1 : v)))
    setFlash('ok')
    sfx('good')
    setTimeout(() => {
      setFlash(null)
      if (round + 1 >= ROUNDS) {
        clearInterval(tick.current)
        setDone(true)
        addStars(2)
        sfx('great')
      } else {
        setRound(round + 1)
        setR(makeRound(round + 1, players))
      }
    }, 400)
  }

  const Grid = ({ who, flip }) => (
    <div
      className={`grid gap-1.5 rounded-3xl p-2.5 transition ${flash === 'no' ? 'bg-clay' : flash === 'ok' ? 'bg-sage' : 'bg-sage/40'} ${flip ? 'rotate-180' : ''}`}
      style={{ gridTemplateColumns: `repeat(${r.size}, minmax(0,1fr))` }}
    >
      {Array.from({ length: r.size * r.size }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => pick(i, who)}
          className="press grid aspect-square place-items-center rounded-lg bg-surface/80 text-[min(4.5vw,1.4rem)]"
        >
          {i === r.at ? r.odd : r.base}
        </button>
      ))}
    </div>
  )

  const winner = scores[0] === scores[1] ? null : scores[0] > scores[1] ? 0 : 1

  return (
    <GameShell
      title={t('หาตัวที่ต่าง', 'Spot the difference')}
      backTo="/versus"
      hint={
        players === 2
          ? t(
              'วางเครื่องไว้กลางโต๊ะ — คนละฝั่งจอ ใครแตะตัวที่ต่างก่อนได้แต้ม',
              'Put the device between you — first to tap the odd one scores.',
            )
          : t('หาตัวที่ต่างจากตัวอื่นให้ไวที่สุด', 'Find the odd one out as fast as you can.')
      }
      onRestart={() => reset(players)}
    >
      <div className="flex gap-2">
        <Chip
          active={players === 1}
          onClick={() => {
            setPlayers(1)
            sfx('tap')
          }}
        >
          🙋 {t('คนเดียว', 'Solo')}
        </Chip>
        <Chip
          active={players === 2}
          onClick={() => {
            setPlayers(2)
            sfx('tap')
          }}
        >
          👥 {t('2 คน', '2 players')}
        </Chip>
        <span className="ml-auto rounded-full bg-surface px-3 py-1.5 text-sm font-bold tabular-nums text-ink-700 border-[1.5px] border-edge">
          {round}/{ROUNDS} · {elapsed}s
        </span>
      </div>

      {players === 2 && (
        <>
          <div className="rounded-2xl bg-surface/60 px-4 py-2 text-center text-xs font-bold text-sky-ink">
            {t('ผู้เล่น 2', 'Player 2')} · {scores[1]}
          </div>
          <Grid who={1} flip />
        </>
      )}

      <Grid who={0} />

      <div className="rounded-2xl bg-surface/60 px-4 py-2 text-center text-xs font-bold text-brand-600">
        {t('ผู้เล่น 1', 'Player 1')} · {scores[0]}
      </div>

      {done && (
        <div className="animate-pop space-y-3 rounded-3xl bg-surface p-5 text-center border-[1.5px] border-edge">
          <p className="text-lg font-extrabold text-ink-900">
            {players === 1
              ? t(`จบแล้ว! ใช้เวลา ${elapsed} วินาที`, `Done in ${elapsed}s!`)
              : winner == null
                ? t('เสมอกัน! 🤝', 'A draw! 🤝')
                : t(`ผู้เล่น ${winner + 1} ชนะ! 🎉`, `Player ${winner + 1} wins! 🎉`)}
          </p>
          <Button onClick={() => reset(players)}>{t('เล่นอีกรอบ', 'Play again')}</Button>
        </div>
      )}
    </GameShell>
  )
}
