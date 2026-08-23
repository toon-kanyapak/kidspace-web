import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { tint } from '../components/ui'
import { VERSUS_GAMES } from '../data/catalog'
import { useApp } from '../store/AppContext'

export default function Versus() {
  const { t } = useApp()
  return (
    <>
      <PageHeader
        eyebrow={t('ทำด้วยกัน', 'Together')}
        title={t('เล่นด้วยกัน', 'Play together')}
        lead={t(
          'เกมแข่งกันสองคนบนเครื่องเดียว — ผลัดกันแตะหน้าจอ หรือแบ่งฝั่งกันคนละครึ่งจอ',
          'Two-player games on one device — take turns, or split the screen.',
        )}
      />
      <div className="space-y-4 pb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VERSUS_GAMES.map((g) => {
            const tn = tint(g.tone)
            return (
              <Link
                key={g.id}
                to={g.to}
                className={`press flex flex-col gap-2 rounded-3xl ${tn.bg} p-4 border-[1.5px] ${tn.ring}`}
              >
                <span className="text-3xl">{g.emoji}</span>
                <span className="font-extrabold leading-snug text-ink-900">{g.th}</span>
                <span className="text-xs leading-snug text-ink-500">{g.subTh}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-1.5 text-[11px] font-bold text-ink-700">
                  <Icon name="user" size={11} /> {g.players}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
