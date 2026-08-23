import { useCallback, useEffect, useRef, useState } from 'react'
import GameShell from '../components/GameShell'
import { Button, Chip } from '../components/ui'
import { useApp } from '../store/AppContext'

const FACES = ['🐶', '🐱', '🐰', '🐼', '🦊', '🐸', '🦁', '🐵']
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

export default function MemoryMatch() {
  const { t, sfx, addStars } = useApp()
  const [pairs, setPairs] = useState(6)
  const [players, setPlayers] = useState(2)
  const [deck, setDeck] = useState([])
  const [open, setOpen] = useState([])
  const [found, setFound] = useState([])
  const [turn, setTurn] = useState(0)
  const [scores, setScores] = useState([0, 0])
  const lock = useRef(false)

  const reset = useCallback(
    (p = pairs) => {
      const faces = FACES.slice(0, p)
      setDeck(shuffle([...faces, ...faces]).map((f, i) => ({ id: i, f })))
      setOpen([])
      setFound([])
      setTurn(0)
      setScores([0, 0])
      lock.current = false
    },
    [pairs],
  )

  useEffect(() => {
    reset(pairs)
  }, [pairs, reset])

  const done = deck.length > 0 && found.length === deck.length

  const flip = (card) => {
    if (lock.current || open.includes(card.id) || found.includes(card.id)) return
    const nx = [...open, card.id]
    setOpen(nx)
    sfx('tap')
    if (nx.length < 2) return
    lock.current = true
    const [a, b] = nx.map((id) => deck.find((c) => c.id === id))
    setTimeout(() => {
      if (a.f === b.f) {
        const nf = [...found, a.id, b.id]
        setFound(nf)
        setScores((s) => s.map((v, i) => (i === turn ? v + 1 : v)))
        if (nf.length === deck.length) {
          sfx('great')
          addStars(2)
        } else sfx('good')
      } else {
        if (players === 2) setTurn((tn) => 1 - tn)
        sfx('wrong')
      }
      setOpen([])
      lock.current = false
    }, 750)
  }

  const cols = pairs <= 6 ? 4 : 4
  const winner = scores[0] === scores[1] ? null : scores[0] > scores[1] ? 0 : 1

  return (
    <GameShell
      title={t('จับคู่ภาพ', 'Memory match')}
      backTo="/versus"
      hint={t(
        'เปิดการ์ดทีละสองใบ ถ้าเหมือนกันได้แต้มและได้เล่นต่อ',
        'Flip two cards — a match scores a point and keeps your turn.',
      )}
      onRestart={() => reset(pairs)}
    >
      <div className="flex flex-wrap gap-2">
        {[4, 6, 8].map((p) => (
          <Chip
            key={p}
            active={pairs === p}
            onClick={() => {
              setPairs(p)
              sfx('tap')
            }}
          >
            {p} {t('คู่', 'pairs')}
          </Chip>
        ))}
        <Chip
          active={players === 1}
          onClick={() => {
            setPlayers(1)
            reset(pairs)
            sfx('tap')
          }}
        >
          🙋 {t('คนเดียว', 'Solo')}
        </Chip>
        <Chip
          active={players === 2}
          onClick={() => {
            setPlayers(2)
            reset(pairs)
            sfx('tap')
          }}
        >
          👥 {t('2 คน', '2 players')}
        </Chip>
      </div>

      {players === 2 ? (
        <div className="grid grid-cols-2 gap-3">
          {[0, 1].map((p) => (
            <div
              key={p}
              className={`rounded-2xl px-4 py-3 text-center border-2 transition ${turn === p && !done ? 'bg-surface border-brand-400' : 'bg-surface/60 border-transparent'}`}
            >
              <p className="text-xs font-bold text-ink-500">{t(`ผู้เล่น ${p + 1}`, `Player ${p + 1}`)}</p>
              <p className="text-2xl font-extrabold text-ink-900">{scores[p]}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm font-bold text-ink-700">
          {t(`จับคู่ได้ ${scores[0]}/${pairs}`, `${scores[0]}/${pairs} matched`)}
        </p>
      )}

      <div
        className="grid gap-2.5 rounded-3xl bg-lilac p-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      >
        {deck.map((c) => {
          const shown = open.includes(c.id) || found.includes(c.id)
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => flip(c)}
              className={`press grid aspect-square place-items-center rounded-2xl text-3xl transition ${
                found.includes(c.id) ? 'bg-sage' : shown ? 'bg-surface' : 'bg-surface/60'
              }`}
            >
              {shown ? (
                <span className="animate-pop">{c.f}</span>
              ) : (
                <span className="text-2xl opacity-30">❓</span>
              )}
            </button>
          )
        })}
      </div>

      {done && (
        <div className="animate-pop space-y-3 rounded-3xl bg-surface p-5 text-center border-[1.5px] border-edge">
          <p className="text-lg font-extrabold text-ink-900">
            {players === 1
              ? t('จับคู่ครบแล้ว! 🎉', 'All matched! 🎉')
              : winner == null
                ? t('เสมอกัน! 🤝', 'A draw! 🤝')
                : t(`ผู้เล่น ${winner + 1} ชนะ! 🎉`, `Player ${winner + 1} wins! 🎉`)}
          </p>
          <Button onClick={() => reset(pairs)}>{t('เล่นอีกรอบ', 'Play again')}</Button>
        </div>
      )}
    </GameShell>
  )
}
