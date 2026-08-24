import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { tint } from '../components/ui'
import { TALK_BLOCKS, TALK_SCENES } from '../data/talk'
import { useApp } from '../store/AppContext'

export default function Talk() {
  const { t, tx, progress } = useApp()
  return (
    <>
      <PageHeader
        art="chat"
        eyebrow={t('ภาษาอังกฤษ', 'English')}
        title={t('คุยอังกฤษกับลูกวันนี้', 'Daily English')}
        lead={t(
          'แตะการ์ดเพื่อฟังเสียง แล้วพูดกับลูกได้เลย ภาษาไทยปนได้ ไม่ต้องเป๊ะ วันละ 2–3 นาทีก็พอ',
          'Tap a card to hear it, then say it to your child. Mixing Thai is fine.',
        )}
      />
      <div className="space-y-6 pb-6">
        {TALK_BLOCKS.map((b) => {
          const tn = tint(b.tone)
          const scenes = TALK_SCENES.filter((s) => s.block === b.id)
          return (
            <section key={b.id} className="space-y-3">
              <h2 className="flex items-center gap-2 text-[17px] font-bold text-ink-900">
                <span className={`grid size-8 place-items-center rounded-xl ${tn.bg}`}>{b.emoji}</span>
                {t(b.th, b.en)}
                <span className="text-xs font-semibold text-ink-300">{scenes.length}</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {scenes.map((s) => (
                  <Link
                    key={s.id}
                    to={`/talk/daily/${s.id}`}
                    className={`press flex items-center gap-2.5 rounded-2xl ${tn.bg} p-3 border-[1.5px] ${tn.ring}`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink-900">{t(s.th, s.en)}</span>
                      <span className="block truncate text-[11px] text-ink-500">
                        {s.lines.length} {t('ประโยค', 'lines')}
                      </span>
                    </span>
                    {progress[`talk:${s.id}`] && (
                      <Icon name="check" size={14} className="shrink-0 text-brand-600" />
                    )}
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
