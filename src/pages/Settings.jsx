import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card } from '../components/ui'
import { englishVoices, onVoicesReady } from '../lib/speech'
import { useApp } from '../store/AppContext'

const RATES = [
  { id: 'verySlow', emoji: '🐌', th: 'ช้ามาก', en: 'Very slow' },
  { id: 'slow', emoji: '🐢', th: 'ช้า', en: 'Slow' },
  { id: 'normal', emoji: '🐇', th: 'ปกติ', en: 'Normal' },
  { id: 'fast', emoji: '🐆', th: 'เร็ว', en: 'Fast' },
]

function Row({ title, hint, children }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-surface p-4 border-[1.5px] border-edge">
      <div className="min-w-0 flex-1">
        <p className="font-bold text-ink-900">{title}</p>
        {hint && <p className="mt-0.5 text-xs leading-snug text-ink-500">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const {
    t,
    sound,
    setSound,
    rateKey,
    setRateKey,
    voiceURI,
    setVoiceURI,
    lang,
    setLang,
    stars,
    speak,
    sfx,
    resetAll,
  } = useApp()
  const [voices, setVoices] = useState(() => englishVoices())
  const [showVoices, setShowVoices] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => onVoicesReady(() => setVoices(englishVoices())), [])

  return (
    <>
      <PageHeader
        eyebrow={t('บัญชีของคุณ', 'Your setup')}
        title={t('ตั้งค่า', 'Settings')}
        lead={t('ค่าที่ตั้งไว้มีผลกับทุกเกมและทุกหน้าในระบบ', 'These settings apply to every game and page.')}
      />
      <div className="mx-auto w-full max-w-[640px] space-y-5 pb-8">
        <section className="space-y-3">
          <h2 className="text-[17px] font-bold text-ink-900">{t('เสียง', 'Sound')}</h2>

          <Row
            title={t('เปิด/ปิดเสียงทั้งระบบ', 'Master sound')}
            hint={t('ปิดแล้วจะไม่มีทั้งเสียงพูดและเสียงเอฟเฟกต์', 'Turns off speech and effects')}
          >
            <button
              type="button"
              role="switch"
              aria-checked={sound}
              onClick={() => setSound(!sound)}
              className={`press relative h-8 w-14 shrink-0 rounded-full transition ${sound ? 'bg-brand-500' : 'bg-brand-100'}`}
            >
              <span
                className={`absolute top-1 size-6 rounded-full bg-surface shadow transition-all ${sound ? 'left-7' : 'left-1'}`}
              />
            </button>
          </Row>

          <div className="rounded-2xl bg-surface p-4 border-[1.5px] border-edge">
            <p className="font-bold text-ink-900">{t('ความเร็วเสียงพูด', 'Speech speed')}</p>
            <p className="mt-0.5 text-xs text-ink-500">
              {t('ใช้กับเสียงอ่านภาษาอังกฤษทุกหน้า', 'Applies to English audio everywhere')}
            </p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {RATES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRateKey(r.id)
                    sfx('tap')
                    setTimeout(() => speak('Hello, good morning', { lang: 'en-US' }), 60)
                  }}
                  className={`press rounded-2xl py-3 text-center border-[1.5px] transition ${
                    rateKey === r.id
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-brand-50 text-ink-700 border-edge'
                  }`}
                >
                  <span className="block text-xl">{r.emoji}</span>
                  <span className="mt-0.5 block text-[11px] font-bold">{t(r.th, r.en)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-surface p-4 border-[1.5px] border-edge">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-ink-900">{t('เสียงพูดอังกฤษ', 'English voice')}</p>
                <p className="mt-0.5 text-xs text-ink-500">
                  {voices.length <= 1
                    ? t('เครื่องนี้มีเสียงให้เลือกเสียงเดียว', 'This device offers only one voice')
                    : t(`มี ${voices.length} เสียงในเครื่องนี้`, `${voices.length} voices on this device`)}
                </p>
              </div>
              <Button size="sm" variant="soft" onClick={() => setShowVoices((s) => !s)}>
                {showVoices ? t('ย่อ', 'Hide') : t('สำรวจทั้งหมด', 'Explore all')}
              </Button>
            </div>
            {showVoices && (
              <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">
                {voices.length === 0 && (
                  <p className="text-sm text-ink-500">
                    {t('เบราว์เซอร์นี้ยังไม่มีเสียงอังกฤษให้ใช้', 'No English voices available here.')}
                  </p>
                )}
                {voices.map((v) => (
                  <div
                    key={v.voiceURI}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border-[1.5px] ${voiceURI === v.voiceURI ? 'bg-brand-50 border-brand-300' : 'bg-brand-50/50 border-edge'}`}
                  >
                    <button
                      type="button"
                      onClick={() => setVoiceURI(v.voiceURI)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate text-sm font-semibold text-ink-900">{v.name}</span>
                      <span className="block text-[11px] text-ink-500">{v.lang}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        speak('Hello! Nice to meet you.', { lang: v.lang, voiceURI: v.voiceURI })
                      }
                      className="press grid size-9 shrink-0 place-items-center rounded-xl bg-brand-500 text-white"
                      aria-label={t('ลองฟัง', 'Preview')}
                    >
                      <Icon name="play" size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-[17px] font-bold text-ink-900">{t('ภาษา', 'Language')}</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              ['th', 'ไทย'],
              ['en', 'English'],
            ].map(([code, label]) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLang(code)
                  sfx('tap')
                }}
                className={`press rounded-2xl py-4 font-bold border-[1.5px] transition ${lang === code ? 'bg-brand-500 text-white border-brand-500' : 'bg-surface text-ink-900 border-edge'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="px-1 text-xs text-ink-500">
            {t(
              'สลับได้ทุกเมื่อ — เนื้อหาทั้งหมด รวมบทความและนิทาน มีทั้งสองภาษา',
              'Switch any time — every screen, including articles and stories, exists in both languages.',
            )}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[17px] font-bold text-ink-900">{t('ข้อมูลของฉัน', 'My data')}</h2>
          <Row
            title={t('ดาวที่สะสมไว้', 'Stars collected')}
            hint={t('เก็บไว้ในเครื่องนี้เท่านั้น', 'Stored on this device only')}
          >
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-100 px-3.5 py-2 font-extrabold text-brand-700">
              <Icon name="star" size={16} className="fill-brand-300" /> {stars}
            </span>
          </Row>
          {!confirmReset ? (
            <Button variant="white" size="lg" onClick={() => setConfirmReset(true)}>
              <Icon name="refresh" size={16} /> {t('ล้างข้อมูลทั้งหมด', 'Reset all data')}
            </Button>
          ) : (
            <Card className="space-y-3 p-4">
              <p className="text-sm font-semibold text-ink-900">
                {t(
                  'ล้างดาว ความคืบหน้า และรายการที่บันทึกไว้ทั้งหมด?',
                  'Erase stars, progress, and saved items?',
                )}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <Button variant="white" onClick={() => setConfirmReset(false)}>
                  {t('ยกเลิก', 'Cancel')}
                </Button>
                <Button
                  onClick={() => {
                    resetAll()
                    setConfirmReset(false)
                    sfx('pop')
                  }}
                >
                  {t('ล้างเลย', 'Erase')}
                </Button>
              </div>
            </Card>
          )}
        </section>

        <p className="px-2 text-center text-xs leading-relaxed text-ink-500">
          {t(
            'เดโมหน้าบ้านอย่างเดียว — ไม่มีการส่งข้อมูลออกจากเครื่อง',
            'Frontend-only demo — nothing leaves your device.',
          )}
        </p>
      </div>
    </>
  )
}
