import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { STORIES } from '../data/stories'
import { tint } from '../components/ui'
import { useApp } from '../store/AppContext'

export default function Stories() {
  const { t, tx, progress } = useApp()
  return (
    <>
      <PageHeader
        art="moon"
        eyebrow={t('ก่อนนอน', 'Bedtime')}
        title={t('นิทานก่อนนอน', 'Bedtime stories')}
        lead={t(
          'นิทานสั้น อ่านจบใน 4–5 นาที ปิดท้ายด้วยคำถามชวนคุยก่อนนอน',
          'Short tales, 4–5 minutes, ending with a question to talk about.',
        )}
      />
      <div className="space-y-4 pb-6">
        <div className="grid gap-3.5 sm:grid-cols-2">
          {STORIES.map((s) => {
            const tn = tint(s.tone)
            const read = progress[`story:${s.id}`]
            return (
              <Link
                key={s.id}
                to={`/stories/${s.id}`}
                className="press flex items-center gap-3.5 overflow-hidden rounded-3xl bg-surface p-4 border-[1.5px] border-edge"
              >
                <span className={`grid size-16 shrink-0 place-items-center rounded-2xl ${tn.bg} text-3xl`}>
                  {s.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate font-extrabold text-ink-900">{t(s.th, s.en)}</span>
                    {read && <Icon name="check" size={14} className="shrink-0 text-brand-500" />}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-ink-500">{tx(s, 'sub')}</span>
                  <span className="mt-2 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                    {t(`อ่าน ${s.read} นาที`, `${s.read} min`)} · {tx(s, 'age')}
                  </span>
                </span>
                <Icon name="arrowRight" size={18} className="shrink-0 text-brand-300" />
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
