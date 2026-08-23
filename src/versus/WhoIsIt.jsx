import { useCallback, useMemo, useState } from 'react'
import GameShell from '../components/GameShell'
import { Button, Chip } from '../components/ui'
import { useApp } from '../store/AppContext'

/** 24 characters described by four yes/no attributes. */
const CHARS = [
  { e: '👦', name: 'บอย', glasses: false, hat: false, hair: 'dark', smile: true },
  { e: '👧', name: 'แพร', glasses: false, hat: false, hair: 'dark', smile: true },
  { e: '🧑‍🦰', name: 'ฟ้า', glasses: false, hat: false, hair: 'light', smile: true },
  { e: '👨‍🦳', name: 'ปู่', glasses: false, hat: false, hair: 'light', smile: false },
  { e: '🧔', name: 'ตี๋', glasses: false, hat: false, hair: 'dark', smile: false },
  { e: '👵', name: 'ย่า', glasses: true, hat: false, hair: 'light', smile: true },
  { e: '👴', name: 'ตา', glasses: true, hat: false, hair: 'light', smile: false },
  { e: '🧑‍🎓', name: 'นัท', glasses: false, hat: true, hair: 'dark', smile: true },
  { e: '👮', name: 'ต้น', glasses: false, hat: true, hair: 'dark', smile: false },
  { e: '👷', name: 'ช่าง', glasses: false, hat: true, hair: 'dark', smile: true },
  { e: '🤠', name: 'โจ', glasses: false, hat: true, hair: 'light', smile: true },
  { e: '🕵️', name: 'สืบ', glasses: true, hat: true, hair: 'dark', smile: false },
  { e: '🧙', name: 'มด', glasses: false, hat: true, hair: 'light', smile: false },
  { e: '🎅', name: 'ซานต้า', glasses: true, hat: true, hair: 'light', smile: true },
  { e: '🧑‍🍳', name: 'เชฟ', glasses: false, hat: true, hair: 'dark', smile: true },
  { e: '👩‍⚕️', name: 'หมอ', glasses: true, hat: false, hair: 'dark', smile: true },
  { e: '🧑‍🏫', name: 'ครู', glasses: true, hat: false, hair: 'dark', smile: false },
  { e: '👩‍🎤', name: 'มิ้น', glasses: false, hat: false, hair: 'light', smile: true },
  { e: '🧑‍🚀', name: 'ดาว', glasses: false, hat: true, hair: 'dark', smile: false },
  { e: '👳', name: 'อาลี', glasses: false, hat: true, hair: 'dark', smile: true },
  { e: '🧑‍🎨', name: 'ศิลป์', glasses: true, hat: false, hair: 'light', smile: true },
  { e: '👲', name: 'หลง', glasses: false, hat: true, hair: 'dark', smile: false },
  { e: '🥷', name: 'นิน', glasses: false, hat: true, hair: 'dark', smile: false },
  { e: '🧑‍🌾', name: 'นา', glasses: false, hat: true, hair: 'light', smile: true },
]

const QUESTIONS = [
  { id: 'glasses', th: 'ใส่แว่นไหม?', test: (c) => c.glasses },
  { id: 'hat', th: 'ใส่หมวกไหม?', test: (c) => c.hat },
  { id: 'hair', th: 'ผมสีเข้มไหม?', test: (c) => c.hair === 'dark' },
  { id: 'smile', th: 'ยิ้มอยู่ไหม?', test: (c) => c.smile },
]

export default function WhoIsIt() {
  const { t, sfx } = useApp()
  const [secret] = useState(() => CHARS[Math.floor(Math.random() * CHARS.length)])
  const [secretKey, setSecretKey] = useState(0)
  const [folded, setFolded] = useState([])
  const [asked, setAsked] = useState([])
  const [result, setResult] = useState(null)

  const current = useMemo(
    () => (secretKey === 0 ? secret : CHARS[secretKey % CHARS.length]),
    [secret, secretKey],
  )

  const reset = useCallback(() => {
    setSecretKey(1 + Math.floor(Math.random() * 1000))
    setFolded([])
    setAsked([])
    setResult(null)
  }, [])

  const ask = (q) => {
    if (result) return
    const yes = q.test(current)
    setAsked((a) => [...a, { q: q.th, yes }])
    // fold away everyone who contradicts the answer
    setFolded((f) => [...new Set([...f, ...CHARS.filter((c) => q.test(c) !== yes).map((c) => c.name)])])
    sfx(yes ? 'good' : 'tap')
  }

  const guess = (c) => {
    if (result) return
    const ok = c.name === current.name
    setResult(ok ? 'win' : 'lose')
    sfx(ok ? 'great' : 'wrong')
  }

  const left = CHARS.filter((c) => !folded.includes(c.name)).length

  return (
    <GameShell
      title={t('ใครเอ่ย?', 'Who is it?')}
      backTo="/versus"
      hint={t(
        'ถามคำถามใช่/ไม่ใช่ หน้าที่ไม่ตรงจะถูกพับเก็บ แล้วเดาตัวลับให้ถูก',
        'Ask yes/no questions — faces that do not fit fold away. Then guess.',
      )}
      onRestart={reset}
    >
      <div className="flex flex-wrap gap-2">
        {QUESTIONS.map((q) => (
          <Chip key={q.id} active={asked.some((a) => a.q === q.th)} onClick={() => ask(q)}>
            {q.th}
          </Chip>
        ))}
      </div>

      {asked.length > 0 && (
        <div className="space-y-1.5 rounded-2xl bg-surface p-4 border-[1.5px] border-edge">
          {asked.map((a, i) => (
            <p key={i} className="flex items-center justify-between text-sm">
              <span className="text-ink-700">{a.q}</span>
              <span className={`font-extrabold ${a.yes ? 'text-sage-ink' : 'text-clay-ink'}`}>
                {a.yes ? t('ใช่ ✓', 'Yes ✓') : t('ไม่ใช่ ✗', 'No ✗')}
              </span>
            </p>
          ))}
        </div>
      )}

      <p className="text-center text-sm font-bold text-ink-500">
        {t(
          `เหลือ ${left} คน · ถามไปแล้ว ${asked.length} คำถาม`,
          `${left} left · ${asked.length} questions asked`,
        )}
      </p>

      <div className="grid grid-cols-6 gap-1.5 rounded-3xl bg-blush p-3">
        {CHARS.map((c) => {
          const down = folded.includes(c.name)
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => guess(c)}
              disabled={down}
              className={`press grid aspect-square place-items-center rounded-xl text-2xl transition ${
                down ? 'scale-90 bg-surface/30 opacity-25' : 'bg-surface'
              } ${result && c.name === current.name ? 'border-2 border-sage-ink' : ''}`}
            >
              {c.e}
            </button>
          )
        })}
      </div>

      {result && (
        <div className="animate-pop space-y-3 rounded-3xl bg-surface p-5 text-center border-[1.5px] border-edge">
          <p className="text-4xl">{current.e}</p>
          <p className="text-lg font-extrabold text-ink-900">
            {result === 'win'
              ? t(`ถูกต้อง! ตัวลับคือ ${current.name} 🎉`, `Correct — it was ${current.name}! 🎉`)
              : t(`ยังไม่ใช่ ตัวลับคือ ${current.name}`, `Not quite — it was ${current.name}`)}
          </p>
          <Button onClick={reset}>{t('เล่นอีกรอบ', 'Play again')}</Button>
        </div>
      )}
    </GameShell>
  )
}
