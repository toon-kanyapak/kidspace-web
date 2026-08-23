import { useCallback, useEffect, useState } from 'react'
import Icon from '../components/Icon'
import GameShell, { WinScreen } from '../components/GameShell'
import { useApp } from '../store/AppContext'

/** Thai consonants with their traditional word and picture. */
const CONSONANTS = [
  ['ก', 'ก ไก่', '🐔'],
  ['ข', 'ข ไข่', '🥚'],
  ['ค', 'ค ควาย', '🐃'],
  ['ง', 'ง งู', '🐍'],
  ['จ', 'จ จาน', '🍽️'],
  ['ฉ', 'ฉ ฉิ่ง', '🔔'],
  ['ช', 'ช ช้าง', '🐘'],
  ['ด', 'ด เด็ก', '🧒'],
  ['ต', 'ต เต่า', '🐢'],
  ['น', 'น หนู', '🐭'],
  ['ป', 'ป ปลา', '🐟'],
  ['ม', 'ม ม้า', '🐴'],
  ['ย', 'ย ยักษ์', '👹'],
  ['ร', 'ร เรือ', '🚣'],
  ['ล', 'ล ลิง', '🐵'],
  ['ว', 'ว แหวน', '💍'],
  ['ส', 'ส เสือ', '🐯'],
  ['ห', 'ห หีบ', '🧰'],
  ['อ', 'อ อ่าง', '🛁'],
  ['ฮ', 'ฮ นกฮูก', '🦉'],
]
const ROUNDS = 8
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

const makeRound = () => {
  const pool = shuffle(CONSONANTS)
  const answer = pool[0]
  return { answer, fish: shuffle(pool.slice(0, 4)) }
}

export default function ConsonantFish() {
  const { t, speak, sfx, addStars } = useApp()
  const [round, setRound] = useState(0)
  const [r, setR] = useState(makeRound)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    speak(r.answer[1], { lang: 'th-TH' })
  }, [r, speak])

  const restart = useCallback(() => {
    setRound(0)
    setR(makeRound())
    setScore(0)
    setPicked(null)
    setDone(false)
  }, [])

  const choose = (c) => {
    if (picked) return
    setPicked(c[0])
    const ok = c[0] === r.answer[0]
    sfx(ok ? 'good' : 'wrong')
    if (ok) setScore((s) => s + 1)
    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        setDone(true)
        addStars(3)
        sfx('great')
      } else {
        setRound(round + 1)
        setR(makeRound())
        setPicked(null)
      }
    }, 850)
  }

  if (done) {
    return (
      <GameShell title={t('ตกปลาพยัญชนะ', 'Consonant fishing')} backTo="/games">
        <WinScreen
          emoji="🎣"
          title={t('ตกปลาได้เยอะเลย!', 'Great catch!')}
          subtitle={t(`ตอบถูก ${score}/${ROUNDS}`, `${score}/${ROUNDS} correct`)}
          stars={score >= 7 ? 3 : score >= 5 ? 2 : 1}
          onAgain={restart}
          backTo="/games"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={t('ตกปลาพยัญชนะ', 'Consonant fishing')}
      backTo="/games"
      hint={t(
        'ฟังเสียงแล้วตกปลาตัวที่มีพยัญชนะตรงกัน',
        'Listen, then catch the fish with the matching consonant.',
      )}
      score={score}
      level={round + 1}
      onRestart={restart}
    >
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-sky p-6">
        <button
          type="button"
          onClick={() => speak(r.answer[1], { lang: 'th-TH' })}
          className="press grid size-20 place-items-center rounded-full bg-surface text-brand-600 shadow-md"
          aria-label={t('ฟังอีกครั้ง', 'Listen again')}
        >
          <Icon name="volume" size={34} />
        </button>
        <p className="text-sm font-semibold text-ink-700">{t('แตะเพื่อฟังอีกครั้ง', 'Tap to hear again')}</p>
        {picked && <p className="animate-pop text-2xl font-extrabold text-ink-900">{r.answer[1]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {r.fish.map((c) => {
          const isRight = c[0] === r.answer[0]
          const isPicked = picked === c[0]
          return (
            <button
              key={c[0]}
              type="button"
              onClick={() => choose(c)}
              className={`press flex flex-col items-center gap-1 rounded-3xl py-6 border-2 transition ${
                picked && isRight
                  ? 'bg-sage border-sage-ink'
                  : isPicked
                    ? 'animate-shake bg-clay border-clay-ink'
                    : 'bg-surface border-edge'
              }`}
            >
              <span className="text-5xl font-extrabold text-ink-900">{c[0]}</span>
              <span className="text-2xl">{c[2]}</span>
            </button>
          )
        })}
      </div>
    </GameShell>
  )
}
