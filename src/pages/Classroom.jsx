import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { tint } from '../components/ui'
import { CLASSROOM_TOOLS } from '../data/catalog'
import { useApp } from '../store/AppContext'

export default function Classroom() {
  const { t } = useApp()
  return (
    <>
      <PageHeader
        eyebrow={t('สร้างสรรค์', 'Make')}
        title={t('สื่อการสอน', 'Classroom')}
        lead={t(
          'สื่อสั้น ๆ สำหรับใช้ในห้องเรียนหรือที่บ้าน ฉายบนจอใหญ่ได้ ไม่ต้องเตรียมอุปกรณ์',
          'Short teaching aids for the classroom or home — projector friendly, no prep.',
        )}
      />
      <div className="space-y-4 pb-6">
        <div className="grid gap-3.5 sm:grid-cols-2">
          {CLASSROOM_TOOLS.map((c) => {
            const tn = tint(c.tone)
            return (
              <Link
                key={c.id}
                to={c.to}
                className="press flex items-center gap-3.5 rounded-3xl bg-surface p-4 border-[1.5px] border-edge"
              >
                <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${tn.bg} text-3xl`}>
                  {c.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold text-ink-900">{c.th}</span>
                  <span className="block text-xs text-ink-500">{c.subTh}</span>
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
