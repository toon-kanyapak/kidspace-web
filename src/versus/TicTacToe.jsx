import { useCallback, useEffect, useState } from 'react'
import GameShell from '../components/GameShell'
import { Button, Chip } from '../components/ui'
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
const MARKS = ['✕', '◯']

const winnerOf = (b) => {
  for (const [a, c, d] of LINES)
    if (b[a] != null && b[a] === b[c] && b[a] === b[d]) return { p: b[a], line: [a, c, d] }
  return b.every((x) => x != null) ? { p: null, line: [] } : null
}

/** Minimax so single-player mode is a real opponent, not a random tapper. */
function bestMove(board, me) {
  const foe = 1 - me
  const score = (b, depth) => {
    const w = winnerOf(b)
    if (w) {
      if (w.p === me) return 10 - depth
      if (w.p === foe) return depth - 10
      return 0
    }
    return null
  }
  const mm = (b, turn, depth) => {
    const s = score(b, depth)
    if (s !== null) return { s }
    let best = null
    b.forEach((cell, i) => {
      if (cell != null) return
      const nb = [...b]
      nb[i] = turn
      const { s: got } = mm(nb, 1 - turn, depth + 1)
      if (best === null || (turn === me ? got > best.s : got < best.s)) best = { s: got, i }
    })
    return best
  }
  return mm(board, me, 0).i
}

export default function TicTacToe() {
  const { t, sfx } = useApp()
  const [mode, setMode] = useState('two')
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState(0)
  const [scores, setScores] = useState([0, 0])
  const result = winnerOf(board)

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null))
    setTurn(0)
  }, [])

  useEffect(() => {
    if (mode !== 'one' || turn !== 1 || result) return undefined
    const tm = setTimeout(() => {
      const i = bestMove(board, 1)
      if (i != null) {
        const nb = [...board]
        nb[i] = 1
        setBoard(nb)
        setTurn(0)
        settle(nb, 'tap')
      }
    }, 420)
    return () => clearTimeout(tm)
  }, [mode, turn, board, result, sfx])

  /** Applies a finished board: awards the point once, right where the move happens. */
  const settle = (nb, tapSound) => {
    const w = winnerOf(nb)
    if (!w) {
      sfx(tapSound)
      return
    }
    if (w.p != null) setScores((s) => s.map((v, i) => (i === w.p ? v + 1 : v)))
    sfx(w.p != null ? 'great' : 'pop')
  }

  const play = (i) => {
    if (board[i] != null || result) return
    if (mode === 'one' && turn === 1) return
    const nb = [...board]
    nb[i] = turn
    setBoard(nb)
    setTurn(1 - turn)
    settle(nb, 'tap')
  }

  return (
    <GameShell
      title={t('XO โอเอกซ์', 'Tic-tac-toe')}
      backTo="/versus"
      hint={t(
        'วางหมากให้ครบ 3 ตัวเรียงกัน แนวตั้ง แนวนอน หรือทแยง',
        'Get three in a row — across, down, or diagonally.',
      )}
      onRestart={() => {
        reset()
        setScores([0, 0])
      }}
    >
      <div className="flex gap-2">
        <Chip
          active={mode === 'two'}
          onClick={() => {
            setMode('two')
            reset()
            sfx('tap')
          }}
        >
          👥 {t('2 คน', '2 players')}
        </Chip>
        <Chip
          active={mode === 'one'}
          onClick={() => {
            setMode('one')
            reset()
            sfx('tap')
          }}
        >
          🤖 {t('เล่นกับเครื่อง', 'vs computer')}
        </Chip>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((p) => (
          <div
            key={p}
            className={`rounded-2xl px-4 py-3 text-center border-2 transition ${turn === p && !result ? 'bg-surface border-brand-400' : 'bg-surface/60 border-transparent'}`}
          >
            <p className="text-xs font-bold text-ink-500">
              {p === 0
                ? t('ผู้เล่น 1', 'Player 1')
                : mode === 'one'
                  ? t('คอมพิวเตอร์', 'Computer')
                  : t('ผู้เล่น 2', 'Player 2')}{' '}
              {MARKS[p]}
            </p>
            <p className="text-2xl font-extrabold text-ink-900">{scores[p]}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2.5 rounded-3xl bg-sky p-3">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            onClick={() => play(i)}
            className={`press grid aspect-square place-items-center rounded-2xl text-5xl font-extrabold transition ${
              result?.line.includes(i) ? 'bg-brand-300 text-white' : 'bg-surface text-ink-900'
            }`}
          >
            {cell != null && <span className="animate-pop">{MARKS[cell]}</span>}
          </button>
        ))}
      </div>

      {result && (
        <div className="animate-pop space-y-3 rounded-3xl bg-surface p-5 text-center border-[1.5px] border-edge">
          <p className="text-lg font-extrabold text-ink-900">
            {result.p == null
              ? t('เสมอกัน! 🤝', 'It’s a draw! 🤝')
              : t(
                  `${result.p === 0 ? 'ผู้เล่น 1' : mode === 'one' ? 'คอมพิวเตอร์' : 'ผู้เล่น 2'} ชนะ! 🎉`,
                  `${MARKS[result.p]} wins! 🎉`,
                )}
          </p>
          <Button onClick={reset}>{t('เล่นอีกรอบ', 'Play again')}</Button>
        </div>
      )}
    </GameShell>
  )
}
