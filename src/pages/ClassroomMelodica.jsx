import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card, Chip } from '../components/ui'
import { useApp } from '../store/AppContext'

const KEYS = [
  { n: 'C', th: 'โด', f: 261.63, sharp: false },
  { n: 'D', th: 'เร', f: 293.66, sharp: false },
  { n: 'E', th: 'มี', f: 329.63, sharp: false },
  { n: 'F', th: 'ฟา', f: 349.23, sharp: false },
  { n: 'G', th: 'ซอล', f: 392.0, sharp: false },
  { n: 'A', th: 'ลา', f: 440.0, sharp: false },
  { n: 'B', th: 'ที', f: 493.88, sharp: false },
  { n: "C'", th: 'โด สูง', f: 523.25, sharp: false },
]

const SONGS = [
  {
    id: 'twinkle',
    th: 'ดาวระยิบระยับ',
    notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'],
  },
  {
    id: 'mary',
    th: 'แมรี่มีแกะน้อย',
    notes: ['E', 'D', 'C', 'D', 'E', 'E', 'E', 'D', 'D', 'D', 'E', 'G', 'G'],
  },
  { id: 'chang', th: 'ช้าง ช้าง ช้าง', notes: ['G', 'E', 'E', 'F', 'D', 'D', 'C', 'E', 'G', 'G', 'E'] },
  { id: 'scale', th: 'ไล่เสียงโดเรมี', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', "C'"] },
]

export default function ClassroomMelodica() {
  const { t, sfx, sound, addStars } = useApp()
  const ctxRef = useRef(null)
  const [mode, setMode] = useState('free')
  const [song, setSong] = useState(SONGS[0])
  const [step, setStep] = useState(0)
  const [active, setActive] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setStep(0)
    setDone(false)
  }, [song, mode])

  const play = (key) => {
    setActive(key.n)
    setTimeout(() => setActive(null), 220)
    if (!sound) return
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return
      if (!ctxRef.current) ctxRef.current = new AC()
      const ac = ctxRef.current
      if (ac.state === 'suspended') ac.resume()
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'triangle'
      osc.frequency.value = key.f
      gain.gain.setValueAtTime(0.0001, ac.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.22, ac.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.7)
      osc.connect(gain).connect(ac.destination)
      osc.start()
      osc.stop(ac.currentTime + 0.75)
    } catch {
      /* ignore */
    }
  }

  const tap = (key) => {
    play(key)
    if (mode !== 'song' || done) return
    if (key.n === song.notes[step]) {
      const nx = step + 1
      setStep(nx)
      if (nx >= song.notes.length) {
        setDone(true)
        addStars(3)
        sfx('great')
      }
    } else {
      sfx('wrong')
    }
  }

  return (
    <>
      <PageHeader title={t('เมโลเดียนเริ่มต้น', 'Melodica')} to="/classroom" />
      <div className="mx-auto w-full max-w-[620px] space-y-4 pb-8">
        <div className="flex gap-2">
          <Chip
            active={mode === 'free'}
            onClick={() => {
              setMode('free')
              sfx('tap')
            }}
          >
            {t('เล่นอิสระ', 'Free play')}
          </Chip>
          <Chip
            active={mode === 'song'}
            onClick={() => {
              setMode('song')
              sfx('tap')
            }}
          >
            {t('กดตามไฟ', 'Follow the light')}
          </Chip>
        </div>

        {mode === 'song' && (
          <>
            <div className="no-scrollbar bleed flex gap-2 overflow-x-auto">
              {SONGS.map((s) => (
                <Chip
                  key={s.id}
                  active={song.id === s.id}
                  onClick={() => {
                    setSong(s)
                    sfx('tap')
                  }}
                >
                  {s.th}
                </Chip>
              ))}
            </div>
            <Card className="p-4">
              <div className="flex flex-wrap gap-1.5">
                {song.notes.map((n, i) => (
                  <span
                    key={i}
                    className={`grid size-9 place-items-center rounded-xl text-xs font-extrabold ${
                      i < step
                        ? 'bg-sage text-sage-ink'
                        : i === step
                          ? 'animate-pulse bg-brand-500 text-white'
                          : 'bg-brand-50 text-ink-500'
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
              {done && (
                <p className="mt-3 text-center text-sm font-extrabold text-brand-600">
                  🎉 {t('เล่นจบเพลงแล้ว! +3 ดาว', 'Song complete! +3 stars')}
                </p>
              )}
            </Card>
          </>
        )}

        <div className="grid grid-cols-4 gap-2">
          {KEYS.map((k) => {
            const isNext = mode === 'song' && !done && song.notes[step] === k.n
            return (
              <button
                key={k.n}
                type="button"
                onPointerDown={() => tap(k)}
                className={`press flex aspect-[2/3] flex-col items-center justify-end gap-1 rounded-2xl pb-3 border-[1.5px] transition ${
                  active === k.n
                    ? 'bg-brand-500 text-white border-brand-500'
                    : isNext
                      ? 'animate-pulse bg-butter text-butter-ink border-butter'
                      : 'bg-surface text-ink-900 border-edge'
                }`}
              >
                <span className="text-lg font-extrabold">{k.n}</span>
                <span className="text-[11px] opacity-70">{k.th}</span>
              </button>
            )
          })}
        </div>

        {mode === 'song' && (
          <Button
            variant="white"
            onClick={() => {
              setStep(0)
              setDone(false)
              sfx('tap')
            }}
          >
            <Icon name="refresh" size={16} /> {t('เริ่มเพลงใหม่', 'Restart song')}
          </Button>
        )}

        <Card className="p-4 text-xs leading-relaxed text-ink-500">
          {t(
            'เสียงสร้างจาก Web Audio ในเบราว์เซอร์ ปิดได้จากหน้าตั้งค่า',
            'Tones are generated in the browser with Web Audio; mute in Settings.',
          )}
        </Card>
      </div>
    </>
  )
}
