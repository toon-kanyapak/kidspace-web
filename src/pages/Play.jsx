import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Badge, Button, Empty, Paper, SectionTitle, Sticker } from '../components/ui'
import { ACTIVITIES, ACTIVITY_CATS, AGES, PLACES, TIMES } from '../data/activities'
import { useApp } from '../store/AppContext'

const catOf = (id) => ACTIVITY_CATS.find((c) => c.id === id) || ACTIVITY_CATS[0]

/** A segmented control — one row, always visible, no multi-step wizard. */
function Segments({ label, icon, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-ink-500">
        <Icon name={icon} size={13} className="text-brand-500" /> {label}
      </p>
      <div className="inline-flex flex-wrap gap-1.5 rounded-2xl border-[1.5px] border-edge bg-cream/60 p-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`press rounded-xl px-4 py-2 text-sm font-semibold transition ${
              value === o.id
                ? 'border-[1.5px] border-brand-600 bg-brand-500 text-white shadow-[2px_3px_0_var(--color-brand-700)]'
                : 'border-[1.5px] border-transparent text-ink-700 hover:bg-surface'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Play() {
  const { t, sfx } = useApp()
  const [params] = useSearchParams()

  const [mins, setMins] = useState(Number(params.get('mins')) || 15)
  const [age, setAge] = useState('3-6')
  const [place, setPlace] = useState('in')
  const [seed, setSeed] = useState(1)

  /* Results are live — changing any control re-mixes the list in place. */
  const matches = useMemo(() => {
    const exact = ACTIVITIES.filter((a) => a.mins <= mins && a.age.includes(age) && a.place.includes(place))
    const loose =
      exact.length >= 3 ? exact : ACTIVITIES.filter((a) => a.mins <= mins && a.place.includes(place))
    const pool = loose.length ? loose : ACTIVITIES.filter((a) => a.mins <= mins)
    const rotated = [...pool].sort((a, b) => {
      const ka = Math.abs(Math.sin(seed * 7.13 + a.id.length * 3.1 + a.mins))
      const kb = Math.abs(Math.sin(seed * 7.13 + b.id.length * 3.1 + b.mins))
      return ka - kb
    })
    return rotated.slice(0, 4)
  }, [mins, age, place, seed])

  return (
    <>
      <PageHeader
        eyebrow={t('ตัวช่วยเลือก', 'Mixer')}
        title={t('ว่างกี่นาที เดี๋ยวเราจัดให้', 'Tell us the minutes, we’ll do the rest')}
        lead={t(
          'ปรับสามอย่างข้างล่างแล้วรายการจะเปลี่ยนตามทันที ไม่ต้องกดยืนยัน',
          'Adjust the three controls below and the list updates as you go.',
        )}
      />

      <div className="space-y-8 pb-6">
        <Paper lift className="flex flex-wrap gap-x-8 gap-y-5 p-5 sm:p-6">
          <Segments
            label={t('เวลาที่มี', 'Time')}
            icon="clock"
            value={mins}
            onChange={(v) => {
              setMins(v)
              sfx('tap')
            }}
            options={TIMES.map((m) => ({ id: m, label: `${m} ${t('นาที', 'min')}` }))}
          />
          <Segments
            label={t('อายุลูก', 'Age')}
            icon="user"
            value={age}
            onChange={(v) => {
              setAge(v)
              sfx('tap')
            }}
            options={AGES.map((a) => ({ id: a.id, label: t(a.th, a.en) }))}
          />
          <Segments
            label={t('อยู่ที่ไหน', 'Where')}
            icon="home"
            value={place}
            onChange={(v) => {
              setPlace(v)
              sfx('tap')
            }}
            options={PLACES.map((p) => ({ id: p.id, label: t(p.th, p.en) }))}
          />
        </Paper>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <SectionTitle size="lg">{t('น่าจะเข้าทาง', 'Might suit you')}</SectionTitle>
            <Button
              variant="white"
              size="sm"
              onClick={() => {
                setSeed((s) => s + 1)
                sfx('pop')
              }}
            >
              <Icon name="refresh" size={15} /> {t('สลับใหม่', 'Re-mix')}
            </Button>
          </div>

          {matches.length === 0 ? (
            <Empty
              icon="clock"
              title={t('ยังไม่เจอที่พอดี', 'Nothing matched')}
              hint={t('ลองเพิ่มเวลาหรือเปลี่ยนสถานที่ดู', 'Try more time or another place.')}
            />
          ) : (
            <div className="grid gap-3.5 sm:grid-cols-2">
              {matches.map((a, i) => {
                const c = catOf(a.cat)
                return (
                  <Paper
                    as={Link}
                    to={`/activities/${a.id}`}
                    key={a.id}
                    lift
                    className="press animate-rise flex gap-4 p-5"
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    <Sticker tone={a.tone} icon={a.icon} size="lg" className={i % 2 ? 'tilt-r' : 'tilt-l'} />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <Badge tone={a.tone}>{t(c.th, c.en)}</Badge>
                        <span className="text-[11px] font-bold text-ink-300">
                          ~{a.mins} {t('นาที', 'min')}
                        </span>
                      </span>
                      <span className="mt-2 block font-display text-[17px] font-bold leading-snug text-ink-900">
                        {a.th}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-500">{a.needTh}</span>
                    </span>
                  </Paper>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
