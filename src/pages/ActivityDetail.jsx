import { useEffect, useRef, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Badge, Button, Card, tint } from '../components/ui'
import { ACTIVITY_CATS, activityById } from '../data/activities'
import { useApp } from '../store/AppContext'

function fmt(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function ActivityDetail() {
  const { id } = useParams()
  const { t, sfx, addStars, markDone, progress, favorites, toggleFavorite } = useApp()
  const a = activityById(id)

  const [left, setLeft] = useState(a ? a.mins * 60 : 0)
  const [running, setRunning] = useState(false)
  const [checked, setChecked] = useState([])
  const timer = useRef(null)

  useEffect(() => {
    if (!running) return undefined
    timer.current = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(timer.current)
          setRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer.current)
  }, [running])

  useEffect(() => {
    if (left === 0 && a) sfx('great')
  }, [left, a, sfx])

  if (!a) return <Navigate to="/activities" replace />

  const cat = ACTIVITY_CATS.find((c) => c.id === a.cat)
  const tn = tint(a.tone)
  const doneKey = `activity:${a.id}`
  const isDone = !!progress[doneKey]
  const isFav = favorites.includes(a.id)

  const finish = () => {
    if (!isDone) {
      addStars(2)
      sfx('great')
    } else sfx('tap')
    markDone(doneKey, true)
  }

  return (
    <>
      <PageHeader
        title={a.th}
        to="/activities"
        right={
          <button
            type="button"
            onClick={() => {
              toggleFavorite(a.id)
              sfx('pop')
            }}
            aria-label="บันทึกไว้"
            className="press grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-600 border-[1.5px] border-edge"
          >
            <Icon name="heart" size={18} className={isFav ? 'fill-brand-400' : ''} />
          </button>
        }
      />

      <div className="mx-auto w-full max-w-[680px] space-y-4 pb-8">
        <div
          className={`relative flex h-40 items-center justify-center overflow-hidden rounded-3xl ${tn.bg}`}
        >
          <span className="pointer-events-none absolute -right-10 -bottom-12 size-40 rounded-full bg-surface/40" />
          <span className={`relative animate-float ${tn.fg}`}>
            <Icon name={a.icon} size={72} strokeWidth={1.4} />
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={a.tone}>{cat?.th}</Badge>
          <Badge tone="sky">
            <Icon name="clock" size={11} /> ~{a.mins} {t('นาที', 'min')}
          </Badge>
          <Badge tone="mint">
            {a.age.join(' · ')} {t('ขวบ', 'yrs')}
          </Badge>
          {isDone && (
            <Badge tone="sage">
              <Icon name="check" size={11} /> {t('ทำแล้ว', 'Done')}
            </Badge>
          )}
        </div>

        <Card className="p-4">
          <p className="text-sm font-bold text-ink-700">{t('ต้องเตรียมอะไรบ้าง', 'What you need')}</p>
          <p className="mt-1 text-sm text-ink-500">{a.needTh}</p>
        </Card>

        {/* Timer */}
        <Card className="flex items-center gap-4 p-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-700">
            <span className="text-lg font-extrabold tabular-nums">{fmt(left)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink-900">{t('จับเวลากิจกรรม', 'Activity timer')}</p>
            <p className="text-xs text-ink-500">
              {t('ไม่ต้องเป๊ะ — ใช้เป็นตัวช่วยไม่ให้ลืมเวลา', 'A gentle nudge, not a rule.')}
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                setRunning((r) => !r)
                sfx('tap')
              }}
              className="press grid size-10 place-items-center rounded-2xl bg-brand-500 text-white"
              aria-label={running ? 'หยุดชั่วคราว' : 'เริ่มจับเวลา'}
            >
              <Icon name={running ? 'pause' : 'play'} size={17} />
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false)
                setLeft(a.mins * 60)
                sfx('tap')
              }}
              className="press grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-600 border-[1.5px] border-edge"
              aria-label="รีเซ็ต"
            >
              <Icon name="refresh" size={17} />
            </button>
          </div>
        </Card>

        {/* Steps */}
        <section className="space-y-2.5">
          <h2 className="text-[17px] font-bold text-ink-900">{t('ทำยังไง', 'How to play')}</h2>
          {a.stepsTh.map((step, i) => {
            const on = checked.includes(i)
            return (
              <button
                key={step}
                type="button"
                onClick={() => {
                  setChecked((c) => (on ? c.filter((x) => x !== i) : [...c, i]))
                  sfx(on ? 'tap' : 'good')
                }}
                className={`press flex w-full items-start gap-3 rounded-2xl p-4 text-left border-[1.5px] transition ${
                  on ? 'bg-brand-50 border-brand-200' : 'bg-surface border-edge'
                }`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
                    on ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700'
                  }`}
                >
                  {on ? <Icon name="check" size={14} /> : i + 1}
                </span>
                <span
                  className={`text-sm leading-relaxed ${on ? 'text-ink-500 line-through' : 'text-ink-900'}`}
                >
                  {step}
                </span>
              </button>
            )
          })}
        </section>

        <Card className="border-l-4 border-brand-300 p-4">
          <p className="flex items-center gap-1.5 text-sm font-bold text-brand-700">
            <Icon name="bulb" size={15} /> {t('ทำไมกิจกรรมนี้ถึงดี', 'Why it works')}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{a.whyTh}</p>
        </Card>

        <Button size="lg" onClick={finish}>
          <Icon name="star" size={17} className={isDone ? 'fill-white' : ''} />
          {isDone
            ? t('ทำกิจกรรมนี้แล้ว', 'Already done')
            : t('เล่นจบแล้ว รับดาว 2 ดวง', 'Finished — collect 2 stars')}
        </Button>
      </div>
    </>
  )
}
