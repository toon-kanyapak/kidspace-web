import { Link, Navigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Badge, Card } from '../components/ui'
import { ARTICLES, articleById, catOf } from '../data/articles'
import { useApp } from '../store/AppContext'

/** Renders **bold** spans inside a paragraph without pulling in a markdown lib. */
function Para({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <p className="text-[15px] leading-[1.85] text-ink-700">
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i} className="font-bold text-ink-900">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  )
}

export default function ArticleDetail() {
  const { id } = useParams()
  const { t, favorites, toggleFavorite, sfx } = useApp()
  const a = articleById(id)
  if (!a) return <Navigate to="/articles" replace />

  const c = catOf(a.cat)
  const isFav = favorites.includes(a.id)
  const more = ARTICLES.filter((x) => x.cat === a.cat && x.id !== a.id).slice(0, 2)

  return (
    <>
      <PageHeader
        title={t(c.th, c.en)}
        to="/articles"
        right={
          <button
            type="button"
            onClick={() => {
              toggleFavorite(a.id)
              sfx('pop')
            }}
            aria-label="บันทึกบทความ"
            className="press grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-600 border-[1.5px] border-edge"
          >
            <Icon name="heart" size={18} className={isFav ? 'fill-brand-400' : ''} />
          </button>
        }
      />

      <article className="mx-auto w-full max-w-[720px] space-y-4 pb-8">
        <div>
          <Badge tone={c.tone}>{t(c.th, c.en)}</Badge>
          <h1 className="mt-2.5 text-[23px] font-extrabold leading-snug text-ink-900">{a.th}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">{a.excerptTh}</p>
          <p className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-ink-500">
            <Icon name="clock" size={12} /> {t(`อ่าน ${a.read} นาที`, `${a.read} min read`)}
          </p>
        </div>

        <div className="space-y-3.5 border-t border-brand-100 pt-4">
          {a.body.map((para, i) => (
            <Para key={i} text={para} />
          ))}
        </div>

        <Card className="bg-brand-50 p-4 border-[1.5px] border-edge">
          <p className="text-xs leading-relaxed text-ink-500">
            {t(
              'เนื้อหานี้เขียนขึ้นเพื่อเป็นแนวทางทั่วไป ไม่ใช่คำแนะนำทางการแพทย์ หากกังวลเรื่องพัฒนาการหรือพฤติกรรมของลูก ควรปรึกษากุมารแพทย์หรือผู้เชี่ยวชาญ',
              'General guidance only, not medical advice. If you are worried about your child’s development, talk to a paediatrician.',
            )}
          </p>
        </Card>

        {more.length > 0 && (
          <section className="space-y-2.5 border-t border-brand-100 pt-5">
            <h2 className="text-[17px] font-bold text-ink-900">
              {t('อ่านต่อในหมวดนี้', 'More in this category')}
            </h2>
            {more.map((m) => (
              <Link
                key={m.id}
                to={`/articles/${m.id}`}
                className="press block rounded-2xl bg-surface p-4 border-[1.5px] border-edge"
              >
                <p className="font-bold leading-snug text-ink-900">{m.th}</p>
                <p className="mt-1 text-xs text-ink-500">{t(`อ่าน ${m.read} นาที`, `${m.read} min read`)}</p>
              </Link>
            ))}
          </section>
        )}
      </article>
    </>
  )
}
