import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Badge, Chip, Empty } from '../components/ui'
import { ARTICLES, ARTICLE_CATS, catOf } from '../data/articles'
import { useApp } from '../store/AppContext'

export default function Articles() {
  const { t, sfx } = useApp()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const byCat = cat === 'all' ? ARTICLES : ARTICLES.filter((a) => a.cat === cat)
    if (!q.trim()) return byCat
    const needle = q.trim().toLowerCase()
    return byCat.filter((a) => `${a.th} ${a.en} ${a.excerptTh}`.toLowerCase().includes(needle))
  }, [cat, q])

  return (
    <>
      <PageHeader
        eyebrow={t('สำหรับพ่อแม่', 'For parents')}
        title={t('บทความเลี้ยงลูก', 'Parenting articles')}
        lead={t(
          'บทความสั้น อ่านจบใน 4–6 นาที เขียนจากคำถามที่พ่อแม่เจอจริงในชีวิตประจำวัน',
          'Short reads, 4–6 minutes, written around the questions parents actually ask.',
        )}
      />

      <div className="space-y-4 pb-6">
        <label className="flex items-center gap-2.5 rounded-2xl bg-surface px-4 py-3 border-[1.5px] border-edge focus-within:border-brand-400">
          <Icon name="eye" size={17} className="shrink-0 text-brand-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('ค้นหาบทความ…', 'Search articles…')}
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-300"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} aria-label="ล้าง" className="press text-ink-300">
              <Icon name="x" size={16} />
            </button>
          )}
        </label>

        <div className="no-scrollbar bleed flex gap-2 overflow-x-auto">
          {ARTICLE_CATS.map((c) => (
            <Chip
              key={c.id}
              active={cat === c.id}
              onClick={() => {
                setCat(c.id)
                sfx('tap')
              }}
            >
              {t(c.th, c.en)}
            </Chip>
          ))}
        </div>

        {list.length === 0 ? (
          <Empty
            icon="book"
            title={t('ไม่พบบทความ', 'No articles found')}
            hint={t('ลองเปลี่ยนคำค้นหรือหมวดหมู่', 'Try another search or category.')}
          />
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2">
            {list.map((a) => {
              const c = catOf(a.cat)
              return (
                <Link
                  key={a.id}
                  to={`/articles/${a.id}`}
                  className="press block rounded-2xl border-l-4 border-brand-300 bg-surface p-4"
                >
                  <Badge tone={c.tone}>{t(c.th, c.en)}</Badge>
                  <p className="mt-2 font-bold leading-snug text-ink-900">{a.th}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-500">{a.excerptTh}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-ink-500">
                    <Icon name="clock" size={12} /> {t(`อ่าน ${a.read} นาที`, `${a.read} min read`)}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
