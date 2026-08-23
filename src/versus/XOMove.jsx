import { useCallback, useState } from 'react'
import GameShell from '../components/GameShell'
import { Button } from '../components/ui'
import { useApp } from '../store/AppContext'

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]
const MARKS = ['🔴', '🔵']
const ADJ = {
  0: [1, 3, 4],
  1: [0, 2, 4],
  2: [1, 5, 4],
  3: [0, 4, 6],
  4: [0, 1, 2, 3, 5, 6, 7, 8],
  5: [2, 4, 8],
  6: [3, 4, 7],
  7: [6, 4, 8],
  8: [5, 4, 7],
}

const winnerOf = (b) => {
  for (const [a, c, d] of LINES)
    if (b[a] != null && b[a] === b[c] && b[a] === b[d]) return { p: b[a], line: [a, c, d] }
  return null
}

export default function XOMove() {
  const { t, sfx } = useApp()
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState(0)
  const [placed, setPlaced] = useState([0, 0])
  const [selected, setSelected] = useState(null)
  const [scores, setScores] = useState([0, 0])
  const result = winnerOf(board)
  const phase = placed[0] < 3 || placed[1] < 3 ? 'place' : 'move'

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null))
    setTurn(0)
    setPlaced([0, 0])
    setSelected(null)
  }, [])

  /** Awards the point at the moment the winning board is produced. */
  const settle = (nb, tapSound) => {
    const w = winnerOf(nb)
    if (!w) {
      sfx(tapSound)
      return
    }
    setScores((s) => s.map((v, i) => (i === w.p ? v + 1 : v)))
    sfx('great')
  }

  const tap = (i) => {
    if (result) return
    if (phase === 'place') {
      if (board[i] != null || placed[turn] >= 3) return
      const nb = [...board]
      nb[i] = turn
      setBoard(nb)
      setPlaced((p) => p.map((v, k) => (k === turn ? v + 1 : v)))
      setTurn(1 - turn)
      settle(nb, 'tap')
      return
    }
    if (board[i] === turn) {
      setSelected(selected === i ? null : i)
      sfx('tap')
      return
    }
    if (selected != null && board[i] == null && ADJ[selected].includes(i)) {
      const nb = [...board]
      nb[i] = turn
      nb[selected] = null
      setBoard(nb)
      setSelected(null)
      setTurn(1 - turn)
      settle(nb, 'pop')
    }
  }

  const movable = selected != null ? ADJ[selected].filter((i) => board[i] == null) : []

  return (
    <GameShell
      title={t('XO หมากเดิน', 'XO move')}
      backTo="/versus"
      hint={
        phase === 'place'
          ? t('ผลัดกันวางหมากคนละ 3 ตัวก่อน', 'Take turns placing three pieces each')
          : t(
              'แตะหมากของตัวเอง แล้วเลื่อนไปช่องว่างที่ติดกัน — เกมนี้ไม่มีเสมอ',
              'Tap your piece, slide it to a neighbouring empty square — no draws here.',
            )
      }
      onRestart={() => {
        reset()
        setScores([0, 0])
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((p) => (
          <div
            key={p}
            className={`rounded-2xl px-4 py-3 text-center border-2 transition ${turn === p && !result ? 'bg-surface border-brand-400' : 'bg-surface/60 border-transparent'}`}
          >
            <p className="text-xs font-bold text-ink-500">
              {t(`ผู้เล่น ${p + 1}`, `Player ${p + 1}`)} {MARKS[p]}
            </p>
            <p className="text-2xl font-extrabold text-ink-900">{scores[p]}</p>
            <p className="text-[11px] text-ink-500">{t(`วางแล้ว ${placed[p]}/3`, `${placed[p]}/3 placed`)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2.5 rounded-3xl bg-clay p-3">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            onClick={() => tap(i)}
            className={`press grid aspect-square place-items-center rounded-2xl text-4xl transition ${
              result?.line.includes(i)
                ? 'bg-brand-300'
                : selected === i
                  ? 'bg-brand-200 border-2 border-brand-500'
                  : movable.includes(i)
                    ? 'bg-surface border-2 border-dashed border-brand-400'
                    : 'bg-surface'
            }`}
          >
            {cell != null && <span className="animate-pop">{MARKS[cell]}</span>}
          </button>
        ))}
      </div>

      {result && (
        <div className="animate-pop space-y-3 rounded-3xl bg-surface p-5 text-center border-[1.5px] border-edge">
          <p className="text-lg font-extrabold text-ink-900">
            {t(`ผู้เล่น ${result.p + 1} ชนะ! 🎉`, `Player ${result.p + 1} wins! 🎉`)}
          </p>
          <Button onClick={reset}>{t('เล่นอีกรอบ', 'Play again')}</Button>
        </div>
      )}
    </GameShell>
  )
}
