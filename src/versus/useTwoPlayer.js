import { useCallback, useState } from 'react'

/** Shared turn/score bookkeeping for the two-player games. */
export function useTwoPlayer(names = ['ผู้เล่น 1', 'ผู้เล่น 2']) {
  const [turn, setTurn] = useState(0)
  const [scores, setScores] = useState([0, 0])
  const swap = useCallback(() => setTurn((t) => 1 - t), [])
  const award = useCallback((p, n = 1) => setScores((s) => s.map((v, i) => (i === p ? v + n : v))), [])
  const reset = useCallback(() => {
    setTurn(0)
    setScores([0, 0])
  }, [])
  return { turn, setTurn, swap, scores, award, reset, names }
}

export function ScoreBar({ names, scores, turn, colors = ['text-brand-600', 'text-[#4a76b8]'] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {names.map((n, i) => (
        <div
          key={n}
          className={`rounded-2xl px-4 py-3 text-center border-2 transition ${
            turn === i ? 'bg-surface border-brand-400' : 'bg-surface/60 border-transparent'
          }`}
        >
          <p className={`text-xs font-bold ${colors[i]}`}>{n}</p>
          <p className="text-2xl font-extrabold text-ink-900">{scores[i]}</p>
        </div>
      ))}
    </div>
  )
}
