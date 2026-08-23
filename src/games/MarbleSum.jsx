import { useCallback, useState } from 'react'
import Icon from '../components/Icon'
import GameShell, { WinScreen } from '../components/GameShell'
import { Button } from '../components/ui'
import { useApp } from '../store/AppContext'

const ROUNDS = 6
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5)

function makeRound(round) {
  const target = 6 + Math.floor(Math.random() * (6 + round * 2))
  // guarantee at least one exact pair exists
  const a = 1 + Math.floor(Math.random() * (target - 2))
  const b = target - a
  const filler = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * Math.max(2, target - 1)))
  return { target, blocks: shuffle([a, b, ...filler]).map((v, i) => ({ id: i, v })) }
}

export default function MarbleSum() {
  const { t, sfx, addStars } = useApp()
  const [round, setRound] = useState(0)
  const [r, setR] = useState(() => makeRound(0))
  const [chosen, setChosen] = useState([])
  const [score, setScore] = useState(0)
  const [flash, setFlash] = useState(null)
  const [done, setDone] = useState(false)

  const sum = chosen.reduce((s, id) => s + r.blocks.find((b) => b.id === id).v, 0)

  const restart = useCallback(() => {
    setRound(0)
    setR(makeRound(0))
    setChosen([])
    setScore(0)
    setFlash(null)
    setDone(false)
  }, [])

  const toggle = (id) => {
    if (flash) return
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
    sfx('tap')
  }

  const check = () => {
    if (sum === r.target) {
      setFlash('ok')
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
          setChosen([])
          setFlash(null)
        }
      }, 800)
    } else {
      setFlash('no')
      sfx('wrong')
      setTimeout(() => setFlash(null), 600)
    }
  }

  if (done) {
    return (
      <GameShell title={t('ลูกแก้วผลรวม', 'Marble sum')} backTo="/games">
        <WinScreen
          emoji="🔮"
          title={t('คิดเลขเก่งมาก!', 'Great adding!')}
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
      title={t('ลูกแก้วผลรวม', 'Marble sum')}
      backTo="/games"
      hint={t(
        'เลือกบล็อกที่รวมกันได้เท่ากับเป้าหมาย จะเลือกกี่ก้อนก็ได้',
        'Pick blocks that add up to the target — any number of them.',
      )}
      score={score}
      level={round + 1}
      onRestart={restart}
    >
      <div
        className={`rounded-3xl p-6 text-center transition ${flash === 'ok' ? 'bg-sage' : flash === 'no' ? 'animate-shake bg-clay' : 'bg-lilac'}`}
      >
        <p className="text-sm font-bold text-ink-500">{t('เป้าหมาย', 'Target')}</p>
        <p className="text-6xl font-extrabold text-ink-900">{r.target}</p>
        <p className="mt-2 text-lg font-bold text-ink-700">
          {t('ตอนนี้รวมได้', 'Current total')}{' '}
          <span className={sum === r.target ? 'text-brand-600' : ''}>{sum}</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {r.blocks.map((b) => {
          const on = chosen.includes(b.id)
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => toggle(b.id)}
              className={`press grid aspect-square place-items-center rounded-3xl text-3xl font-extrabold border-2 transition ${
                on ? 'bg-brand-500 text-white border-brand-500' : 'bg-surface text-ink-900 border-edge'
              }`}
            >
              {b.v}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="white"
          onClick={() => {
            setChosen([])
            sfx('tap')
          }}
        >
          <Icon name="refresh" size={16} /> {t('ล้าง', 'Clear')}
        </Button>
        <Button onClick={check} disabled={!chosen.length}>
          <Icon name="check" size={16} /> {t('ตรวจคำตอบ', 'Check')}
        </Button>
      </div>
    </GameShell>
  )
}
