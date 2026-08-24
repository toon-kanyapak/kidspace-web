import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Badge, Chip, Empty } from '../components/ui'
import { ACTIVITIES, ACTIVITY_CATS } from '../data/activities'
import { tint } from '../components/ui'
import { useApp } from '../store/AppContext'

export default function Activities() {
  const { t, tx, sfx } = useApp()
  const [cat, setCat] = useState('all')

  const list = useMemo(() => (cat === 'all' ? ACTIVITIES : ACTIVITIES.filter((a) => a.cat === cat)), [cat])

  return (
    <>
      <PageHeader
        art="blocks"
        eyebrow={t('ทำด้วยกัน', 'Together')}
        title={t('กิจกรรมกับลูก', 'Activities')}
        lead={t(
          'รวมกิจกรรมเล่น กิน เรียนรู้ กับลูก — เลือกตามเวลาที่มี เริ่มได้ทันที ไม่ต้องเตรียมเยอะ',
          'Play, eat, learn — pick by the time you have and start right away.',
        )}
      />

      <div className="space-y-4 pb-6">
        <div className="no-scrollbar bleed flex gap-2 overflow-x-auto">
          {ACTIVITY_CATS.map((c) => (
            <Chip
              key={c.id}
              active={cat === c.id}
              onClick={() => {
                setCat(c.id)
                sfx('tap')
              }}
            >
              {t(c.th, c.en)}
            </Chip>
          ))}
        </div>

        {list.length === 0 ? (
          <Empty title={t('ยังไม่มีกิจกรรมในหมวดนี้', 'Nothing here yet')} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a) => {
              const c = ACTIVITY_CATS.find((x) => x.id === a.cat)
              const tn = tint(a.tone)
              return (
                <Link
                  key={a.id}
                  to={`/activities/${a.id}`}
                  className="press flex flex-col overflow-hidden rounded-3xl bg-surface border-[1.5px] border-edge"
                >
                  <span className={`relative flex h-28 items-center justify-center ${tn.bg}`}>
                    <span className="pointer-events-none absolute -right-6 -bottom-8 size-24 rounded-full bg-surface/40" />
                    <span className={`relative ${tn.fg}`}>
                      <Icon name={a.icon} size={44} strokeWidth={1.6} />
                    </span>
                    <span className="absolute left-2.5 top-2.5">
                      <Badge tone={a.tone} className="!bg-surface/85">
                        {t(c?.th, c?.en)}
                      </Badge>
                    </span>
                    <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-surface/85 px-2 py-0.5 text-[11px] font-bold text-ink-700">
                      <Icon name="clock" size={11} /> ~{a.mins} {t('นาที', 'min')}
                    </span>
                    {a.game && (
                      <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-white">
                        <Icon name="game" size={11} /> {t('เล่นได้', 'Playable')}
                      </span>
                    )}
                  </span>
                  <span className="flex flex-1 flex-col gap-1 p-3.5">
                    <span className="font-bold leading-snug text-ink-900">{t(a.th, a.en)}</span>
                    <span className="line-clamp-2 text-xs leading-snug text-ink-500">{tx(a, 'need')}</span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-bold text-brand-600">
                      {t('เริ่มกิจกรรมนี้', 'Start')} <Icon name="arrowRight" size={13} />
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
