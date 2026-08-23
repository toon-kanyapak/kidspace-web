import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { tint } from '../components/ui'
import { WORD_LEVELS, WORD_SETS } from '../data/words'
import { useApp } from '../store/AppContext'

export default function Words() {
  const { t, progress } = useApp()
  return (
    <>
      <PageHeader
        eyebrow={t('ภาษาอังกฤษ', 'English')}
        title={t('คำศัพท์อังกฤษ', 'English vocabulary')}
        lead={t(
          'แต่ละชุดมี 8 คำ เล่นสามระดับ ฟัง → ลาก → อ่าน เหมาะกับเด็ก 4–7 ขวบ',
          'Eight words per set across three levels: listen → drag → read. Ages 4–7.',
        )}
      />
      <div className="space-y-4 pb-6">
        <div className="flex flex-wrap gap-2">
          {WORD_LEVELS.map((lv) => (
            <span
              key={lv.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-ink-700 border-[1.5px] border-edge"
            >
              <Icon name={lv.icon} size={13} className="text-brand-500" /> {t(lv.th, lv.en)}
            </span>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORD_SETS.map((s) => {
            const tn = tint(s.tone)
            const done = WORD_LEVELS.filter((lv) => progress[`words:${s.id}:${lv.id}`]).length
            return (
              <Link
                key={s.id}
                to={`/words/${s.id}`}
                className={`press flex flex-col gap-1.5 rounded-3xl ${tn.bg} p-4 border-[1.5px] ${tn.ring}`}
              >
                <span className="text-3xl">{s.emoji}</span>
                <span className="font-extrabold text-ink-900">{s.th}</span>
                <span className="text-xs text-ink-500">
                  {s.en} · {s.words.length} {t('คำ', 'words')}
                </span>
                <span className="mt-1 flex gap-1">
                  {WORD_LEVELS.map((lv, i) => (
                    <span
                      key={lv.id}
                      className={`h-1.5 flex-1 rounded-full ${i < done ? 'bg-brand-500' : 'bg-surface/70'}`}
                    />
                  ))}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
