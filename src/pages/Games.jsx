import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { tint } from '../components/ui'
import { LOGIC_GAMES } from '../data/catalog'
import { useApp } from '../store/AppContext'

export default function Games() {
  const { t } = useApp()
  return (
    <>
      <PageHeader
        eyebrow={t('ฝึกคิด', 'Thinking')}
        title={t('เกมเรียนรู้', 'Learning games')}
        lead={t(
          'เกมฝึกคิดสำหรับเด็ก 4–9 ขวบ เล่นได้แม้ยังอ่านไม่คล่อง เล่นสั้น ๆ วันละเกมก็พอ',
          'Thinking games for ages 4–9. Playable before they can read fluently.',
        )}
      />
      <div className="space-y-4 pb-6">
        <div className="grid gap-3.5 sm:grid-cols-2">
          {LOGIC_GAMES.map((g) => {
            const tn = tint(g.tone)
            return (
              <Link
                key={g.id}
                to={g.to}
                className="press flex items-center gap-3.5 rounded-3xl bg-surface p-4 border-[1.5px] border-edge"
              >
                <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${tn.bg} text-3xl`}>
                  {g.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-extrabold text-ink-900">{g.th}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-ink-500">{g.subTh}</span>
                  <span className="mt-1.5 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                    {g.age}
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
