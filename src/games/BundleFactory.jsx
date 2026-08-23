import { useCallback, useState } from 'react'
import Icon from '../components/Icon'
import GameShell, { WinScreen } from '../components/GameShell'
import { Button } from '../components/ui'
import { useApp } from '../store/AppContext'

const ROUNDS = 6

function makeRound(round) {
  const plus = round % 2 === 0
  if (plus) {
    // force a carry so the "bundle ten" idea has to be used
    const aOnes = 5 + Math.floor(Math.random() * 5)
    const bOnes = 10 - aOnes + 1 + Math.floor(Math.random() * 3)
    const aTens = 1 + Math.floor(Math.random() * 4)
    const bTens = 1 + Math.floor(Math.random() * 3)
    const a = aTens * 10 + aOnes
    const b = bTens * 10 + Math.min(9, bOnes)
    return { a, b, plus, answer: a + b }
  }
  // force a borrow
  const aTens = 3 + Math.floor(Math.random() * 4)
  const aOnes = Math.floor(Math.random() * 4)
  const bTens = 1 + Math.floor(Math.random() * (aTens - 2))
  const bOnes = aOnes + 2 + Math.floor(Math.random() * 4)
  const a = aTens * 10 + aOnes
  const b = bTens * 10 + Math.min(9, bOnes)
  return { a, b, plus: false, answer: a - b }
}

function Bundles({ n, tone }) {
  const tens = Math.floor(n / 10)
  const ones = n % 10
  return (
    <div className="flex flex-wrap items-end justify-center gap-1.5">
      {Array.from({ length: tens }, (_, i) => (
        <span
          key={`t${i}`}
          className={`grid h-9 w-5 place-items-center rounded-md text-[10px] font-extrabold text-white ${tone}`}
        >
          10
        </span>
      ))}
      {Array.from({ length: ones }, (_, i) => (
        <span key={`o${i}`} className={`size-3 rounded-full ${tone}`} />
      ))}
    </div>
  )
}

export default function BundleFactory() {
  const { t, sfx, addStars } = useApp()
  const [round, setRound] = useState(0)
  const [r, setR] = useState(() => makeRound(0))
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [state, setState] = useState(null)
  const [hint, setHint] = useState(false)
  const [done, setDone] = useState(false)

  const restart = useCallback(() => {
    setRound(0)
    setR(makeRound(0))
    setInput('')
    setScore(0)
    setState(null)
    setHint(false)
    setDone(false)
  }, [])

  const check = () => {
    if (Number(input) === r.answer) {
      setState('ok')
      setScore((s) => s + 1)
      sfx('good')
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          setDone(true)
          addStars(3)
          sfx('great')
        } else {
          setRound(round + 1)
          setR(makeRound(round + 1))
          setInput('')
          setState(null)
          setHint(false)
        }
      }, 850)
    } else {
      setState('no')
      sfx('wrong')
      setTimeout(() => setState(null), 600)
    }
  }

  if (done) {
    return (
      <GameShell title={t('โรงงานมัดสิบ', 'Bundle factory')} backTo="/games">
        <WinScreen
          emoji="📦"
          title={t('มัดสิบได้เก่งมาก!', 'Bundling mastered!')}
          subtitle={t(`ผ่าน ${score}/${ROUNDS} ด่าน`, `${score}/${ROUNDS} solved`)}
          stars={score >= 6 ? 3 : score >= 4 ? 2 : 1}
          onAgain={restart}
          backTo="/games"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={t('โรงงานมัดสิบ', 'Bundle factory')}
      backTo="/games"
      hint={
        r.plus
          ? t(
              'รวมเม็ดเดี่ยวก่อน ครบ 10 เม็ดให้มัดเป็นแท่งสิบ',
              'Add the ones first — every 10 ones becomes one ten-bundle.',
            )
          : t(
              'เม็ดเดี่ยวไม่พอลบ ให้แกะแท่งสิบออกมาเป็น 10 เม็ด',
              'Not enough ones? Unbundle a ten into 10 ones.',
            )
      }
      score={score}
      level={round + 1}
      onRestart={restart}
    >
      <div
        className={`space-y-4 rounded-3xl p-5 transition ${state === 'ok' ? 'bg-sage' : state === 'no' ? 'animate-shake bg-clay' : 'bg-sage'}`}
      >
        <div className="space-y-2 rounded-2xl bg-surface/70 p-3">
          <p className="text-center text-xs font-bold text-ink-500">{r.a}</p>
          <Bundles n={r.a} tone="bg-brand-400" />
        </div>
        <p className="text-center text-3xl font-extrabold text-ink-900">{r.plus ? '+' : '−'}</p>
        <div className="space-y-2 rounded-2xl bg-surface/70 p-3">
          <p className="text-center text-xs font-bold text-ink-500">{r.b}</p>
          <Bundles n={r.b} tone="bg-[#5aa9e6]" />
        </div>
        <p className="text-center text-3xl font-extrabold text-ink-900">
          {r.a} {r.plus ? '+' : '−'} {r.b} = ?
        </p>
      </div>

      {hint && (
        <p className="rounded-2xl bg-butter px-4 py-3 text-center text-sm font-semibold text-butter-ink">
          {r.plus
            ? t(
                `หลักหน่วย: ${r.a % 10} + ${r.b % 10} = ${(r.a % 10) + (r.b % 10)} → มัดสิบได้ ${Math.floor(((r.a % 10) + (r.b % 10)) / 10)} มัด`,
                'Ones first, then bundle.',
              )
            : t(
                `แกะสิบหนึ่งมัด: ${r.a % 10} + 10 = ${(r.a % 10) + 10} แล้วลบ ${r.b % 10}`,
                'Unbundle one ten, then subtract.',
              )}
        </p>
      )}

      <div className="flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 3))}
          inputMode="numeric"
          placeholder="?"
          className="w-full rounded-2xl bg-surface px-5 py-4 text-center text-3xl font-extrabold text-ink-900 outline-none border-[1.5px] border-edge focus:border-brand-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="white"
          onClick={() => {
            setHint((h) => !h)
            sfx('tap')
          }}
        >
          <Icon name="bulb" size={16} /> {t('ใบ้', 'Hint')}
        </Button>
        <Button onClick={check} disabled={!input}>
          <Icon name="check" size={16} /> {t('ตรวจคำตอบ', 'Check')}
        </Button>
      </div>
    </GameShell>
  )
}
