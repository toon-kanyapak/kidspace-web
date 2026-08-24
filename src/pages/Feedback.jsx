import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card } from '../components/ui'
import { load, save } from '../lib/storage'
import { useApp } from '../store/AppContext'

const TOPICS = [
  { id: 'idea', emoji: '💡', th: 'อยากให้มีอะไรเพิ่ม', en: 'Something I’d like added' },
  { id: 'bug', emoji: '🐛', th: 'เจอปัญหาการใช้งาน', en: 'I hit a problem' },
  { id: 'content', emoji: '📝', th: 'ความเห็นเรื่องเนื้อหา', en: 'Feedback on the content' },
  { id: 'love', emoji: '💗', th: 'อยากชม / ให้กำลังใจ', en: 'Just saying thanks' },
]

export default function Feedback() {
  const { t, sfx } = useApp()
  const [topic, setTopic] = useState(null)
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    // frontend-only demo: kept locally so the flow is complete without a backend
    const all = load('feedback', [])
    save('feedback', [...all, { topic, text, rating, at: new Date().toISOString() }])
    setSent(true)
    sfx('great')
  }

  if (sent) {
    return (
      <>
        <PageHeader title={t('ส่งความเห็น', 'Feedback')} />
        <Card className="animate-pop mx-auto max-w-[520px] space-y-4 p-8 text-center">
          <span className="text-6xl">💌</span>
          <h2 className="text-xl font-extrabold text-ink-900">{t('ขอบคุณมากนะ', 'Thank you!')}</h2>
          <p className="text-sm leading-relaxed text-ink-500">
            {t(
              'ในเดโมนี้ความเห็นถูกเก็บไว้ในเครื่องคุณเองเท่านั้น ยังไม่ได้ส่งไปที่ไหน',
              'In this demo your note is stored on your device only — nothing was sent anywhere.',
            )}
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              variant="soft"
              onClick={() => {
                setSent(false)
                setText('')
                setTopic(null)
                setRating(0)
              }}
            >
              {t('เขียนอีก', 'Write another')}
            </Button>
            <Button as={Link} to="/" variant="white">
              {t('กลับหน้าแรก', 'Back home')}
            </Button>
          </div>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeader title={t('ส่งความเห็น', 'Feedback')} />
      <form onSubmit={submit} className="mx-auto w-full max-w-[620px] space-y-5 pb-8">
        <p className="text-sm leading-relaxed text-ink-500">
          {t(
            'บอกเราได้เลยว่าอยากให้ปรับอะไร ทุกความเห็นช่วยให้แอปดีขึ้น',
            'Tell us what to improve — every note helps.',
          )}
        </p>

        <fieldset className="space-y-2.5">
          <legend className="pb-1 text-sm font-bold text-ink-700">
            {t('เรื่องที่อยากบอก', 'What is it about?')}
          </legend>
          <div className="grid grid-cols-2 gap-2.5">
            {TOPICS.map((tp) => (
              <button
                key={tp.id}
                type="button"
                onClick={() => {
                  setTopic(tp.id)
                  sfx('tap')
                }}
                className={`press flex items-center gap-2 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold border-[1.5px] transition ${
                  topic === tp.id
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-surface text-ink-900 border-edge'
                }`}
              >
                <span className="text-lg">{tp.emoji}</span> {t(tp.th, tp.en)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2.5">
          <legend className="pb-1 text-sm font-bold text-ink-700">
            {t('ให้คะแนนแอปนี้', 'Rate the app')}
          </legend>
          <div className="flex justify-center gap-2 rounded-2xl bg-surface p-4 border-[1.5px] border-edge">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setRating(n)
                  sfx('pop')
                }}
                className="press"
                aria-label={`${n} ดาว`}
              >
                <Icon
                  name="star"
                  size={34}
                  className={n <= rating ? 'fill-brand-300 text-brand-500' : 'text-brand-200'}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block space-y-2">
          <span className="text-sm font-bold text-ink-700">{t('รายละเอียด', 'Details')}</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder={t('เขียนได้เลย…', 'Type here…')}
            className="w-full resize-none rounded-2xl bg-surface p-4 text-sm leading-relaxed text-ink-900 outline-none border-[1.5px] border-edge placeholder:text-ink-300 focus:border-brand-400"
          />
        </label>

        <Button as="button" type="submit" size="lg" disabled={!topic || !text.trim()}>
          <Icon name="send" size={17} /> {t('ส่งความเห็น', 'Send feedback')}
        </Button>
      </form>
    </>
  )
}
