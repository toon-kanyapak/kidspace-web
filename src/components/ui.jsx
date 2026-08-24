import { Link } from 'react-router-dom'
import Icon from './Icon'
import Scene from './Scene'

/* ---------------- craft accent palette ---------------- */
export const TINTS = {
  blush: { bg: 'bg-blush', fg: 'text-blush-ink', edge: 'border-brand-200' },
  clay: { bg: 'bg-clay', fg: 'text-clay-ink', edge: 'border-[#f6cdb2]' },
  lilac: { bg: 'bg-lilac', fg: 'text-lilac-ink', edge: 'border-[#d9c6f0]' },
  sage: { bg: 'bg-sage', fg: 'text-sage-ink', edge: 'border-[#c6dcb6]' },
  butter: { bg: 'bg-butter', fg: 'text-butter-ink', edge: 'border-[#f5d996]' },
  sky: { bg: 'bg-sky', fg: 'text-sky-ink', edge: 'border-[#c1d6f0]' },
  /* legacy aliases so older screens keep working */
  peach: { bg: 'bg-clay', fg: 'text-clay-ink', edge: 'border-[#f6cdb2]' },
  mint: { bg: 'bg-sage', fg: 'text-sage-ink', edge: 'border-[#c6dcb6]' },
}
// `ring` is kept as an alias of `edge` for screens written against the older key
export const tint = (name) => {
  const t = TINTS[name] || TINTS.blush
  return { ...t, ring: t.edge }
}

/* ---------------- Paper: the one card surface ---------------- */
export function Paper({ as: As = 'div', tone, lift, flat, className = '', children, ...rest }) {
  const tn = tone ? tint(tone) : null
  return (
    <As
      className={`paper rounded-3xl ${lift ? 'paper-lift' : ''} ${flat ? 'paper-flat' : ''} ${
        tn ? `${tn.bg} ${tn.edge}` : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </As>
  )
}
export { Paper as Card }

/* ---------------- Buttons ---------------- */
export function Button({
  as: As = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const base =
    'press inline-flex items-center justify-center gap-2 rounded-2xl font-display font-bold select-none border-[1.5px] disabled:opacity-45 disabled:pointer-events-none'
  const sizes = {
    sm: 'px-3.5 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-[15px]',
    lg: 'px-6 py-3.5 text-base w-full',
  }
  const variants = {
    primary:
      'bg-brand-500 text-white border-brand-600 shadow-[3px_4px_0_var(--color-brand-700)] hover:bg-brand-400',
    soft: 'bg-brand-100 text-brand-700 border-brand-200 shadow-[3px_4px_0_rgba(179,65,100,.14)] hover:bg-brand-200',
    white:
      'bg-surface text-ink-900 border-edge shadow-[3px_4px_0_rgba(107,39,64,.08)] hover:border-edge-strong',
    ghost: 'border-transparent text-brand-700 hover:bg-brand-50 shadow-none',
    dark: 'bg-ink-900 text-white border-ink-900 shadow-[3px_4px_0_rgba(61,42,51,.3)]',
  }
  return (
    <As className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </As>
  )
}

/* ---------------- Chip / filter pill ---------------- */
export function Chip({ active, className = '', children, ...rest }) {
  return (
    <button
      type="button"
      className={`press shrink-0 rounded-full border-[1.5px] px-4 py-1.5 text-sm font-semibold transition ${
        active
          ? 'border-brand-600 bg-brand-500 text-white shadow-[2px_3px_0_var(--color-brand-700)]'
          : 'border-edge bg-surface text-ink-700 shadow-[2px_3px_0_rgba(107,39,64,.06)] hover:border-edge-strong'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

/* ---------------- Sticker: the asymmetric icon chip ---------------- */
export function Sticker({ tone = 'blush', size = 'md', emoji, icon, className = '' }) {
  const tn = tint(tone)
  const boxes = { sm: 'size-9 text-lg', md: 'size-12 text-2xl', lg: 'size-16 text-3xl' }
  const icons = { sm: 16, md: 21, lg: 28 }
  return (
    <span
      className={`petal grid shrink-0 place-items-center border-[1.5px] ${tn.bg} ${tn.edge} ${tn.fg} ${boxes[size]} ${className}`}
    >
      {emoji ?? <Icon name={icon} size={icons[size]} />}
    </span>
  )
}

/* ---------------- Section title with a hand-drawn swash ---------------- */
export function SectionTitle({ children, to, action, className = '', size = 'md' }) {
  return (
    <div className={`flex items-end justify-between gap-3 ${className}`}>
      <h2 className="relative inline-block">
        <span className={`font-display font-bold text-ink-900 ${size === 'lg' ? 'text-2xl' : 'text-[19px]'}`}>
          {children}
        </span>
        <svg
          className="swash absolute -bottom-1.5 left-0 w-full"
          height="7"
          viewBox="0 0 120 7"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M1 4.5C22 1.6 44 1.2 64 3.4c19 2 35 2.4 55-.6"
            fill="none"
            stroke="var(--color-brand-300)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </h2>
      {to && (
        <Link to={to} className="press shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700">
          {action || 'ดูทั้งหมด'} →
        </Link>
      )}
    </div>
  )
}
export { SectionTitle as SectionHead }

/* ---------------- Shelf: horizontally scrolling row ---------------- */
export function Shelf({ title, to, action, children, className = '' }) {
  return (
    <section className={`space-y-3.5 ${className}`}>
      {title && (
        <SectionTitle to={to} action={action}>
          {title}
        </SectionTitle>
      )}
      <div className="no-scrollbar bleed flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
        {children}
      </div>
    </section>
  )
}

/* ---------------- Tile: a labelled entry card ---------------- */
export function Tile({ to, icon, emoji, title, subtitle, tone = 'blush', className = '' }) {
  return (
    <Paper as={Link} to={to} className={`press flex items-start gap-3 p-3.5 ${className}`}>
      <Sticker tone={tone} icon={icon} emoji={emoji} />
      <span className="min-w-0 flex-1 pt-0.5">
        <span className="block font-display text-[15px] font-bold leading-snug text-ink-900">{title}</span>
        {subtitle && <span className="mt-0.5 block text-xs leading-snug text-ink-500">{subtitle}</span>}
      </span>
    </Paper>
  )
}

/* ---------------- Badge ---------------- */
export function Badge({ tone = 'blush', className = '', children }) {
  const tn = tint(tone)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border-[1.5px] ${tn.bg} ${tn.edge} ${tn.fg} px-2.5 py-0.5 text-[11px] font-bold ${className}`}
    >
      {children}
    </span>
  )
}

/* ---------------- Empty state ---------------- */
export function Empty({ icon = 'sparkle', scene = 'empty', title, hint }) {
  return (
    <Paper className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <Scene name={scene} className="w-44" />
      <p className="mt-1 font-display font-bold text-ink-900">{title}</p>
      {hint && <p className="max-w-[30ch] text-sm text-ink-500">{hint}</p>}
    </Paper>
  )
}

/* ---------------- Progress ---------------- */
export function Progress({ value, max = 100, className = '' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      className={`h-2.5 w-full overflow-hidden rounded-full border-[1.5px] border-edge bg-brand-50 ${className}`}
    >
      <div
        className="h-full rounded-full bg-brand-400 transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* ---------------- Stars ---------------- */
export function Stars({ count = 0, total = 3, size = 24 }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <Icon
          key={i}
          name="star"
          size={size}
          className={i < count ? 'fill-brand-300 text-brand-600' : 'text-brand-200'}
        />
      ))}
    </div>
  )
}
