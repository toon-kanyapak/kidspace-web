import { Link } from 'react-router-dom'
import Icon from './Icon'
import { PageHeader } from './Shell'
import Scene from './Scene'
import { Button, Paper, Stars } from './ui'
import { useApp } from '../store/AppContext'

/**
 * Chrome shared by every mini-game. Games are capped to a comfortable playing
 * width and centred, so a wide desktop window never stretches a game board.
 */
export default function GameShell({ title, backTo, hint, score, best, level, children, onRestart, right }) {
  const { t } = useApp()
  return (
    <>
      <PageHeader title={title} to={backTo} right={right} />
      <div className="mx-auto w-full max-w-[520px] space-y-4 pb-10">
        {(score != null || level != null || best != null || onRestart) && (
          <div className="flex items-center gap-2 text-sm font-bold">
            {level != null && (
              <span className="rounded-full border-[1.5px] border-brand-200 bg-brand-100 px-3.5 py-1.5 font-display text-brand-700">
                {t('ด่าน', 'Level')} {level}
              </span>
            )}
            {score != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-edge bg-surface px-3.5 py-1.5 text-ink-700">
                <Icon name="star" size={14} className="fill-brand-300 text-brand-600" /> {score}
              </span>
            )}
            {best != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-edge bg-surface px-3.5 py-1.5 text-ink-500">
                <Icon name="trophy" size={14} /> {best}
              </span>
            )}
            {onRestart && (
              <button
                type="button"
                onClick={onRestart}
                aria-label={t('เริ่มใหม่', 'Restart')}
                className="press ml-auto grid size-9 place-items-center rounded-full border-[1.5px] border-edge bg-surface text-brand-600"
              >
                <Icon name="refresh" size={16} />
              </button>
            )}
          </div>
        )}

        {hint && (
          <p className="rounded-2xl border-[1.5px] border-dashed border-brand-200 bg-brand-50 px-4 py-3 text-center text-sm font-semibold leading-relaxed text-brand-700">
            {hint}
          </p>
        )}

        {children}
      </div>
    </>
  )
}

export function WinScreen({ emoji = '🎉', scene, title, subtitle, stars = 3, onAgain, backTo, backLabel }) {
  const { t } = useApp()
  return (
    <Paper lift className="tape animate-pop relative mx-auto max-w-[420px] space-y-4 p-8 text-center">
      {scene ? <Scene name={scene} className="mx-auto w-40" /> : <div className="text-6xl">{emoji}</div>}
      <h2 className="font-display text-2xl font-bold text-ink-900">{title}</h2>
      {subtitle && <p className="text-sm text-ink-500">{subtitle}</p>}
      <div className="flex justify-center">
        <Stars count={stars} />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <Button variant="soft" onClick={onAgain}>
          <Icon name="refresh" size={16} /> {t('เล่นอีก', 'Play again')}
        </Button>
        <Button as={Link} to={backTo} variant="white">
          {backLabel || t('กลับ', 'Back')}
        </Button>
      </div>
    </Paper>
  )
}
