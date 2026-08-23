import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { tint } from '../components/ui'
import { READING_LEVELS, readingsByLevel } from '../data/reading'
import { useApp } from '../store/AppContext'

export default function Reading() {
  const { t, progress } = useApp()
  return (
    <>
      <PageHeader
        eyebrow={t('ฝึกคิด', 'Thinking')}
        title={t('อ่านจับใจความ', 'Reading')}
        lead={t(
          'อ่านสั้น ๆ ตอบสนุก ๆ — เลือกระดับให้พอดีกับลูก',
          'Short reads, fun questions — pick a level that fits.',
        )}
      />
      <div className="space-y-6 pb-6">
        {READING_LEVELS.map((lv) => {
          const tn = tint(lv.tone)
          const items = readingsByLevel(lv.id)
          return (
            <section key={lv.id} className="space-y-3">
              <div className={`rounded-2xl ${tn.bg} p-4 border-[1.5px] ${tn.ring}`}>
                <p className="font-extrabold text-ink-900">
                  {lv.th} · {lv.age}
                </p>
                <p className="mt-0.5 text-sm text-ink-500">{lv.descTh}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((r) => (
                  <Link
                    key={r.id}
                    to={`/reading/${r.id}`}
                    className="press flex items-center gap-3.5 rounded-2xl bg-surface p-4 border-[1.5px] border-edge"
                  >
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-2xl ${tn.bg} text-2xl`}
                    >
                      {r.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-ink-900">{r.th}</span>
                      <span className="block text-xs text-ink-500">
                        {r.qs.length} {t('คำถาม', 'questions')}
                      </span>
                    </span>
                    {progress[`reading:${r.id}`] && (
                      <Icon name="check" size={16} className="shrink-0 text-brand-500" />
                    )}
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
