import { useCallback, useEffect, useRef, useState } from 'react'
import GameShell, { WinScreen } from '../components/GameShell'
import { Button } from '../components/ui'
import { load, save } from '../lib/storage'
import { useApp } from '../store/AppContext'

const PADS = [
  { id: 0, emoji: '🐶', bg: 'bg-clay', on: 'bg-[#ffb894]', freq: 330 },
  { id: 1, emoji: '🐱', bg: 'bg-sage', on: 'bg-[#8fdcbb]', freq: 392 },
  { id: 2, emoji: '🐸', bg: 'bg-butter', on: 'bg-[#ffdf8f]', freq: 440 },
  { id: 3, emoji: '🦉', bg: 'bg-lilac', on: 'bg-[#cdb0ee]', freq: 523 },
]

export default function Simon() {
  const { t, sfx, sound, addStars } = useApp()
  const [seq, setSeq] = useState([])
  const [step, setStep] = useState(0)
  const [lit, setLit] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | show | play | over
  const [best, setBest] = useState(() => load('brain:simon:best', 0))
  const timers = useRef([])
  const ctxRef = useRef(null)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => () => clearTimers(), [])

  const tone = useCallback(
    (pad) => {
      if (!sound) return
      try {
        const AC = window.AudioContext || window.webkitAudioContext
        if (!AC) return
        if (!ctxRef.current) ctxRef.current = new AC()
        const ac = ctxRef.current
        if (ac.state === 'suspended') ac.resume()
        const osc = ac.createOscillator()
        const g = ac.createGain()
        osc.type = 'sine'
        osc.frequency.value = pad.freq
        g.gain.setValueAtTime(0.0001, ac.currentTime)
        g.gain.exponentialRampToValueAtTime(0.2, ac.currentTime + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.4)
        osc.connect(g).connect(ac.destination)
        osc.start()
        osc.stop(ac.currentTime + 0.45)
      } catch {
        /* ignore */
      }
    },
    [sound],
  )

  const playSequence = useCallback(
    (s) => {
      setPhase('show')
      clearTimers()
      const gap = Math.max(340, 700 - s.length * 22)
      s.forEach((padId, i) => {
        timers.current.push(
          setTimeout(
            () => {
              setLit(padId)
              tone(PADS[padId])
              timers.current.push(setTimeout(() => setLit(null), gap * 0.6))
            },
            gap * (i + 1),
          ),
        )
      })
      timers.current.push(
        setTimeout(
          () => {
            setPhase('play')
            setStep(0)
          },
          gap * (s.length + 1.2),
        ),
      )
    },
    [tone],
  )

  const nextRound = useCallback(
    (prev) => {
      const s = [...prev, Math.floor(Math.random() * 4)]
      setSeq(s)
      playSequence(s)
    },
    [playSequence],
  )

  const start = () => {
    setSeq([])
    setStep(0)
    nextRound([])
  }

  const tap = (padId) => {
    if (phase !== 'play') return
    setLit(padId)
    tone(PADS[padId])
    setTimeout(() => setLit(null), 180)
    if (seq[step] !== padId) {
      setPhase('over')
      sfx('wrong')
      const len = seq.length - 1
      if (len > best) {
        setBest(len)
        save('brain:simon:best', len)
      }
      if (len >= 3) addStars(2)
      return
    }
    if (step + 1 === seq.length) {
      sfx('good')
      setTimeout(() => nextRound(seq), 550)
    } else {
      setStep(step + 1)
    }
  }

  if (phase === 'over') {
    return (
      <GameShell title={t('ไซมอนสัตว์', 'Simon animals')} backTo="/brain">
        <WinScreen
          emoji="🎵"
          title={t('จบรอบแล้ว!', 'Round over!')}
          subtitle={t(
            `จำได้ ${seq.length - 1} ลำดับ · สถิติ ${best}`,
            `${seq.length - 1} in a row · best ${best}`,
          )}
          stars={seq.length - 1 >= 8 ? 3 : seq.length - 1 >= 4 ? 2 : 1}
          onAgain={start}
          backTo="/brain"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={t('ไซมอนสัตว์', 'Simon animals')}
      backTo="/brain"
      hint={
        phase === 'show'
          ? t('ดูให้ดี… จำลำดับไว้', 'Watch carefully… remember the order')
          : phase === 'play'
            ? t('ถึงตาหนูแล้ว แตะตามลำดับเลย', 'Your turn — tap in the same order')
            : t('จำแล้วแตะตามให้ถูกลำดับ', 'Remember, then tap in order')
      }
      score={Math.max(0, seq.length - 1)}
      best={best}
      onRestart={start}
    >
      <div className="grid grid-cols-2 gap-3">
        {PADS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => tap(p.id)}
            disabled={phase !== 'play'}
            className={`press grid aspect-square place-items-center rounded-3xl text-6xl border-[1.5px] border-white transition ${
              lit === p.id ? `${p.on} scale-95` : p.bg
            } ${phase !== 'play' ? 'cursor-default' : ''}`}
          >
            {p.emoji}
          </button>
        ))}
      </div>

      {phase === 'idle' && (
        <Button size="lg" onClick={start}>
          {t('เริ่มเล่น', 'Start')}
        </Button>
      )}
      {phase === 'play' && (
        <p className="text-center text-sm font-bold text-ink-500">
          {step + 1} / {seq.length}
        </p>
      )}
    </GameShell>
  )
}
