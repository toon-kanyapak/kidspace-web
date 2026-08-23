import { useCallback, useEffect, useRef, useState } from 'react'
import GameShell, { WinScreen } from '../components/GameShell'
import { Button, Chip } from '../components/ui'
import { load, save } from '../lib/storage'
import { useApp } from '../store/AppContext'

const SIZES = [
  { n: 3, th: 'ง่าย' },
  { n: 4, th: 'ปานกลาง' },
  { n: 5, th: 'ยาก' },
]
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

export default function StarGrid() {
  const { t, sfx, addStars } = useApp()
  const [size, setSize] = useState(3)
  const [cells, setCells] = useState([])
  const [next, setNext] = useState(1)
  const [started, setStarted] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)
  const [best, setBest] = useState(() => load('brain:starGrid:best', {}))
  const startAt = useRef(0)
  const raf = useRef(null)

  const total = size * size

  const reset = useCallback(
    (n = size) => {
      setCells(shuffle(Array.from({ length: n * n }, (_, i) => i + 1)))
      setNext(1)
      setStarted(false)
      setElapsed(0)
      setDone(false)
      cancelAnimationFrame(raf.current)
    },
    [size],
  )

  useEffect(() => {
    reset(size)
  }, [size, reset])
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const tickTimer = useCallback(() => {
    setElapsed((Date.now() - startAt.current) / 1000)
    raf.current = requestAnimationFrame(tickTimer)
  }, [])

  const tap = (v) => {
    if (done) return
    if (!started) {
      setStarted(true)
      startAt.current = Date.now()
      raf.current = requestAnimationFrame(tickTimer)
    }
    if (v !== next) {
      sfx('wrong')
      return
    }
    sfx('tap')
    if (v === total) {
      cancelAnimationFrame(raf.current)
      const secs = (Date.now() - startAt.current) / 1000
      setElapsed(secs)
      setDone(true)
      addStars(2)
      sfx('great')
      const key = String(size)
      if (!best[key] || secs < best[key]) {
        const nb = { ...best, [key]: secs }
        setBest(nb)
        save('brain:starGrid:best', nb)
      }
    } else {
      setNext(v + 1)
    }
  }

  if (done) {
    return (
      <GameShell title={t('ตารางดาว', 'Star grid')} backTo="/brain">
        <WinScreen
          emoji="⭐"
          title={t('ครบทุกดวงแล้ว!', 'All stars found!')}
          subtitle={t(`ใช้เวลา ${elapsed.toFixed(1)} วินาที`, `${elapsed.toFixed(1)} seconds`)}
          stars={elapsed < total * 0.8 ? 3 : elapsed < total * 1.4 ? 2 : 1}
          onAgain={() => reset(size)}
          backTo="/brain"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={t('ตารางดาว', 'Star grid')}
      backTo="/brain"
      hint={t(
        `แตะดาวเรียงจาก 1 ถึง ${total} ให้เร็วที่สุด`,
        `Tap the stars 1 to ${total} as fast as you can`,
      )}
      onRestart={() => reset(size)}
    >
      <div className="flex items-center gap-2">
        {SIZES.map((s) => (
          <Chip
            key={s.n}
            active={size === s.n}
            onClick={() => {
              setSize(s.n)
              sfx('tap')
            }}
          >
            {s.th} {s.n}×{s.n}
          </Chip>
        ))}
        <span className="ml-auto rounded-full bg-surface px-3 py-1.5 text-sm font-extrabold tabular-nums text-ink-700 border-[1.5px] border-edge">
          {elapsed.toFixed(1)}s
        </span>
      </div>

      <p className="text-center text-lg font-extrabold text-brand-600">
        {t('หาเลข', 'Find')} {next}
      </p>

      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0,1fr))` }}>
        {cells.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => tap(v)}
            disabled={v < next}
            className={`press grid aspect-square place-items-center rounded-2xl text-xl font-extrabold border-[1.5px] transition ${
              v < next ? 'bg-brand-100 text-brand-300 border-edge' : 'bg-surface text-ink-900 border-edge'
            }`}
          >
            {v < next ? '⭐' : v}
          </button>
        ))}
      </div>

      {best[String(size)] && (
        <p className="text-center text-xs font-semibold text-ink-500">
          🏆 {t('สถิติดีที่สุด', 'Best')}: {best[String(size)].toFixed(1)}s
        </p>
      )}
      {!started && (
        <Button variant="soft" onClick={() => reset(size)}>
          {t('สลับตำแหน่งใหม่', 'Reshuffle')}
        </Button>
      )}
    </GameShell>
  )
}
