import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card, Progress, tint } from '../components/ui'
import { storyById } from '../data/stories'
import { useApp } from '../store/AppContext'

export default function StoryReader() {
  const { id } = useParams()
  const { t, tx, sfx, addStars, markDone, progress } = useApp()
  const s = storyById(id)
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)

  if (!s) return <Navigate to="/stories" replace />

  const tn = tint(s.tone)
  const pages = tx(s, 'pages')
  const last = page === pages.length - 1
  const alreadyRead = !!progress[`story:${s.id}`]

  const next = () => {
    if (last) {
      setDone(true)
      if (!alreadyRead) addStars(2)
      markDone(`story:${s.id}`, true)
      sfx('great')
    } else {
      setPage((p) => p + 1)
      sfx('tap')
    }
  }

  if (done) {
    return (
      <>
        <PageHeader title={t(s.th, s.en)} to="/stories" />
        <div className="mx-auto w-full max-w-[620px] space-y-5 pb-8 pt-4 text-center">
          <div className="animate-pop text-7xl">{s.emoji}</div>
          <h2 className="text-2xl font-extrabold text-ink-900">
            {t('จบแล้ว ฝันดีนะ', 'The end. Sweet dreams.')}
          </h2>
          <p className="text-sm text-ink-500">{t('+2 ดาว เก็บไว้แล้ว', '+2 stars collected')}</p>

          <Card className="space-y-3 p-5 text-left">
            <p className="flex items-center gap-1.5 text-sm font-bold text-brand-700">
              <Icon name="chat" size={15} /> {t('ชวนลูกคุยต่อ', 'Talk about it')}
            </p>
            {tx(s, 'talk').map((q) => (
              <p key={q} className="rounded-2xl bg-brand-50 px-4 py-3 text-sm leading-relaxed text-ink-700">
                “{q}”
              </p>
            ))}
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="soft"
              onClick={() => {
                setPage(0)
                setDone(false)
                sfx('tap')
              }}
            >
              <Icon name="refresh" size={16} /> {t('อ่านอีกครั้ง', 'Read again')}
            </Button>
            <Button as={Link} to="/stories" variant="white">
              {t('นิทานอื่น', 'Other stories')}
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title={t(s.th, s.en)} to="/stories" />
      <div className="flex min-h-[70dvh] flex-col gap-4 pb-8">
        <div className="flex items-center gap-3">
          <Progress value={page + 1} max={pages.length} className="flex-1" />
          <span className="shrink-0 text-xs font-bold tabular-nums text-ink-500">
            {page + 1}/{pages.length}
          </span>
        </div>

        <div
          className={`flex flex-1 flex-col items-center justify-center gap-6 rounded-[1.75rem] ${tn.bg} p-7 text-center`}
        >
          <span key={page} className="animate-pop text-6xl">
            {s.emoji}
          </span>
          <p key={`p${page}`} className="animate-rise text-[17px] font-medium leading-[2] text-ink-900">
            {pages[page]}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="white"
            className="!w-auto"
            disabled={page === 0}
            onClick={() => {
              setPage((p) => p - 1)
              sfx('tap')
            }}
          >
            <Icon name="back" size={16} /> {t('ก่อนหน้า', 'Back')}
          </Button>
          <Button className="flex-1" onClick={next}>
            {last ? t('จบเรื่อง', 'Finish') : t('หน้าถัดไป', 'Next')} <Icon name="arrowRight" size={16} />
          </Button>
        </div>
      </div>
    </>
  )
}
