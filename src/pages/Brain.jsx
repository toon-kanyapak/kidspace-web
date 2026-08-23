import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { tint } from '../components/ui'
import { BRAIN_GROUPS } from '../data/catalog'
import { useApp } from '../store/AppContext'

export default function Brain() {
  const { t } = useApp()
  return (
    <>
      <PageHeader
        eyebrow={t('ฝึกคิด', 'Thinking')}
        title={t('ยิมสมอง', 'Brain gym')}
        lead={t(
          'เกมสั้น ๆ ฝึกสมาธิและความจำ เล่นได้แม้ลูกยังอ่านไม่ออก ใช้เวลาเกมละ 1–2 นาที',
          'Short attention and memory drills — 1–2 minutes each, no reading needed.',
        )}
      />
      <div className="space-y-6 pb-6">
        {BRAIN_GROUPS.map((grp) => {
          const tn = tint(grp.tone)
          return (
            <section key={grp.id} className="space-y-3">
              <h2 className="flex items-center gap-2 text-[17px] font-bold text-ink-900">
                <span className={`grid size-8 place-items-center rounded-xl ${tn.bg}`}>{grp.emoji}</span>
                {grp.th}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {grp.games.map((g) => (
                  <Link
                    key={g.id}
                    to={g.to}
                    className="press flex items-center gap-3.5 rounded-2xl bg-surface p-4 border-[1.5px] border-edge"
                  >
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-2xl ${tn.bg} text-2xl`}
                    >
                      {g.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-ink-900">{g.th}</span>
                      <span className="block text-xs text-ink-500">{g.subTh}</span>
                    </span>
                    <Icon name="arrowRight" size={17} className="shrink-0 text-brand-300" />
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
