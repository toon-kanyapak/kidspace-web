import { useCallback, useEffect, useRef, useState } from 'react'
import GameShell, { WinScreen } from '../components/GameShell'
import { Button } from '../components/ui'
import { useApp } from '../store/AppContext'

const CARDS = ['🍓', '🐳', '🌻', '🎃', '🐝', '🦄']
const TOTAL = 20

export default function SameAgain() {
  const { t, sfx, addStars } = useApp()
  const [card, setCard] = useState(null)
  const [prev, setPrev] = useState(null)
  const [index, setIndex] = useState(0)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [flash, setFlash] = useState(null)
  const answered = useRef(false)
  const timer = useRef(null)

  const stop = () => clearTimeout(timer.current)
  useEffect(() => () => stop(), [])

  const nextCard = useCallback(
    (i, previous) => {
      if (i >= TOTAL) {
        setRunning(false)
        setDone(true)
        addStars(2)
        sfx('great')
        return
      }
      const repeat = previous && Math.random() < 0.32
      const next = repeat ? previous : CARDS[Math.floor(Math.random() * CARDS.length)]
      answered.current = false
      setPrev(previous)
      setCard(next)
      setIndex(i + 1)
      timer.current = setTimeout(() => {
        if (!answered.current && previous && next === previous) {
          setMisses((m) => m + 1)
          setFlash('miss')
          setTimeout(() => setFlash(null), 250)
        }
        nextCard(i + 1, next)
      }, 1900)
    },
    [addStars, sfx],
  )

  const start = () => {
    stop()
    setHits(0)
    setMisses(0)
    setWrong(0)
    setDone(false)
    setPrev(null)
    setIndex(0)
    setRunning(true)
    nextCard(0, null)
  }

  const ring = () => {
    if (!running || answered.current) return
    answered.current = true
    if (prev && card === prev) {
      setHits((h) => h + 1)
      setFlash('hit')
      sfx('good')
    } else {
      setWrong((w) => w + 1)
      setFlash('wrong')
      sfx('wrong')
    }
    setTimeout(() => setFlash(null), 250)
  }

  if (done) {
    const acc = hits - wrong
    return (
      <GameShell title={t('เหมือนเดิมไหม', 'Same again?')} backTo="/brain">
        <WinScreen
          emoji="🔔"
          title={t('จบรอบแล้ว!', 'Round complete!')}
          subtitle={t(
            `ถูก ${hits} · พลาด ${misses} · กดเกิน ${wrong}`,
            `${hits} hits · ${misses} missed · ${wrong} false alarms`,
          )}
          stars={acc >= 5 ? 3 : acc >= 3 ? 2 : 1}
          onAgain={start}
          backTo="/brain"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={t('เหมือนเดิมไหม', 'Same again?')}
      backTo="/brain"
      hint={t(
        'แตะกระดิ่งเมื่อการ์ดใบนี้ "เหมือนใบก่อนหน้า"',
        'Ring the bell when this card matches the one before it',
      )}
      score={hits}
      onRestart={start}
    >
      <div
        className={`grid aspect-square place-items-center rounded-[2rem] transition-colors ${
          flash === 'hit'
            ? 'bg-sage'
            : flash === 'wrong' || flash === 'miss'
              ? 'bg-clay'
              : 'bg-surface border-[1.5px] border-edge'
        }`}
      >
        {card ? (
          <span key={index} className="animate-pop text-[7rem]">
            {card}
          </span>
        ) : (
          <span className="text-6xl opacity-25">❔</span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm font-bold text-ink-500">
        <span>
          {index}/{TOTAL}
        </span>
        <span>
          {t('พลาด', 'Missed')} {misses} · {t('กดเกิน', 'False')} {wrong}
        </span>
      </div>

      {running ? (
        <button
          type="button"
          onClick={ring}
          className="press grid w-full place-items-center rounded-[2rem] bg-brand-500 py-10 text-6xl text-white"
          aria-label={t('กดกระดิ่ง', 'Ring the bell')}
        >
          🔔
        </button>
      ) : (
        <Button size="lg" onClick={start}>
          {t('เริ่มเล่น', 'Start')}
        </Button>
      )}
    </GameShell>
  )
}
