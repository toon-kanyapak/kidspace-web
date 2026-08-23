import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Badge, tint } from '../components/ui'
import { SPEAK_LESSONS, SPEAK_LEVELS } from '../data/speak'
import { useApp } from '../store/AppContext'

export default function Speak() {
  const { t, progress } = useApp()
  const hasMic = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

  return (
    <>
      <PageHeader
        eyebrow={t('ภาษาอังกฤษ', 'English')}
        title={t('ซ้อมพูดอังกฤษ', 'Speaking practice')}
        lead={t(
          'แต่ละบทมี 4 ระดับ ตั้งแต่พูดตามจนพูดเองได้ ภาษาไทยปนได้ ไม่ต้องเป๊ะ',
          'Four levels per lesson, from repeat-after-me to saying it yourself.',
        )}
      />
      <div className="space-y-4 pb-6">
        <div className="flex flex-wrap gap-2">
          <Badge tone="mint">
            <Icon name="volume" size={11} /> {t('มีเสียงอ่านทุกประโยค', 'Audio on every line')}
          </Badge>
          {hasMic && (
            <Badge tone="sky">
              <Icon name="mic" size={11} /> {t('มีไมค์ตรวจการพูด', 'Mic checks your speech')}
            </Badge>
          )}
        </div>

        <div className="rounded-2xl bg-surface p-4 border-[1.5px] border-edge">
          <p className="text-sm font-bold text-ink-900">{t('4 ระดับในแต่ละบท', 'Four levels per lesson')}</p>
          <ol className="mt-2.5 space-y-1.5">
            {SPEAK_LEVELS.map((lv) => (
              <li key={lv.id} className="flex items-center gap-2.5 text-sm text-ink-700">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-100 text-[11px] font-extrabold text-brand-700">
                  {lv.id}
                </span>
                {t(lv.th, lv.en)}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {SPEAK_LESSONS.map((l) => {
            const tn = tint(l.tone)
            const done = SPEAK_LEVELS.filter((lv) => progress[`speak:${l.id}:${lv.id}`]).length
            return (
              <Link
                key={l.id}
                to={`/speak/${l.id}`}
                className="press flex items-center gap-3.5 rounded-3xl bg-surface p-4 border-[1.5px] border-edge"
              >
                <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${tn.bg} text-3xl`}>
                  {l.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-extrabold text-ink-900">{l.th}</span>
                  <span className="block truncate text-xs text-ink-500">{l.en}</span>
                  <span className="mt-1.5 flex items-center gap-2">
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                      {l.lines.length} {t('ประโยค', 'lines')}
                    </span>
                    {done > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600">
                        <Icon name="check" size={11} /> {done}/4
                      </span>
                    )}
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
