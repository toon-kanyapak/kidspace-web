/**
 * Original SVG scene illustrations, drawn to match the cut-paper look and the
 * pink pastel palette. They are authored for this project (MIT with the repo),
 * so there is no third-party image licensing to track and nothing to fetch at
 * runtime — each scene is a handful of vector shapes with a couple of animated
 * parts. `prefers-reduced-motion` stops all of the motion.
 */

const C = {
  ink: 'var(--color-ink-900)',
  brand: 'var(--color-brand-400)',
  brandDeep: 'var(--color-brand-600)',
  brandSoft: 'var(--color-brand-200)',
  clay: 'var(--color-clay)',
  sage: 'var(--color-sage)',
  sky: 'var(--color-sky)',
  butter: 'var(--color-butter)',
  lilac: 'var(--color-lilac)',
  paper: 'var(--color-surface)',
}

/* `edge` outlines a filled shape; `line` is for stroke-only paths. Keeping
   fill out of `edge` means an explicit fill= on the element survives the spread. */
const edge = { stroke: C.ink, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }
const line = { ...edge, fill: 'none' }

/* A soft pastel blob sits behind every scene to anchor it on the page. */
function Blob({ fill }) {
  return (
    <path
      d="M28 62c-8-26 12-46 42-50s62 4 78 22 14 46-2 62-52 22-76 14S36 88 28 62Z"
      fill={fill}
      opacity="0.85"
    />
  )
}

const SCENES = {
  /* Home hero: a grown-up and a child sitting together */
  together: (
    <>
      <Blob fill={C.brandSoft} />
      <circle cx="115" cy="34" r="7" fill={C.butter} className="ks-twinkle" />
      <circle cx="46" cy="46" r="4.5" fill={C.brand} className="ks-twinkle ks-d2" />
      <g className="ks-drift">
        <path d="M62 128V96a20 20 0 0 1 40 0v32" fill={C.brand} />
        <circle cx="82" cy="66" r="17" fill={C.paper} {...edge} />
        <path d="M75 64h.01M89 64h.01" {...line} className="ks-blink" />
        <path d="M76 72c4 3 8 3 12 0" {...line} />
      </g>
      <g className="ks-drift ks-d2">
        <path d="M106 128v-22a14 14 0 0 1 28 0v22" fill={C.sky} />
        <circle cx="120" cy="90" r="12" fill={C.paper} {...edge} />
        <path d="M115 89h.01M125 89h.01" {...line} className="ks-blink ks-d1" />
        <path d="M116 95c3 2 5 2 8 0" {...line} />
      </g>
      <path d="M100 108c4-4 8-4 12 0" {...line} />
      <path
        d="M150 58c0-6 5-10 10-6 5-4 10 0 10 6 0 7-10 13-10 13s-10-6-10-13Z"
        fill={C.brand}
        className="ks-beat"
      />
    </>
  ),

  /* Time / the minute picker */
  clock: (
    <>
      <Blob fill={C.butter} />
      <circle cx="100" cy="82" r="42" fill={C.paper} {...edge} />
      <circle cx="100" cy="82" r="4" fill={C.ink} />
      <g className="ks-roll" style={{ transformOrigin: '100px 82px' }}>
        <path d="M100 82V54" {...line} />
      </g>
      <path d="M100 82l20 12" {...line} />
      <path d="M100 34v-8M100 138v-8M148 82h8M44 82h-8" {...line} />
      <circle cx="152" cy="44" r="6" fill={C.brand} className="ks-twinkle" />
      <circle cx="46" cy="120" r="5" fill={C.brandDeep} className="ks-twinkle ks-d3" />
    </>
  ),

  /* Activities: stacked blocks */
  blocks: (
    <>
      <Blob fill={C.clay} />
      <rect x="58" y="96" width="38" height="34" rx="7" fill={C.brand} {...edge} />
      <rect x="100" y="96" width="38" height="34" rx="7" fill={C.sky} {...edge} />
      <g className="ks-drift">
        <rect x="79" y="58" width="38" height="34" rx="7" fill={C.butter} {...edge} />
        <path d="M92 75h12" {...line} />
      </g>
      <circle cx="150" cy="52" r="7" fill={C.brandDeep} className="ks-beat" />
      <path d="M44 62l6-6 6 6-6 6z" fill={C.brand} className="ks-twinkle ks-d2" />
    </>
  ),

  /* Bedtime stories: moon, stars, an open book */
  moon: (
    <>
      <Blob fill={C.lilac} />
      <g className="ks-drift">
        <path d="M126 34a30 30 0 1 0 26 44 24 24 0 0 1-26-44Z" fill={C.butter} {...edge} />
      </g>
      <path d="M52 46l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill={C.brand} className="ks-twinkle" />
      <path d="M158 96l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill={C.brandDeep} className="ks-twinkle ks-d2" />
      <path d="M46 132h108" {...line} />
      <path
        d="M100 120c-10-10-30-10-38-4v14c8-6 28-6 38 4Zm0 0c10-10 30-10 38-4v14c-8-6-28-6-38 4Z"
        fill={C.paper}
        {...edge}
      />
    </>
  ),

  /* Learning games: dice and shapes */
  dice: (
    <>
      <Blob fill={C.sage} />
      <g className="ks-swing" style={{ transformOrigin: '86px 60px' }}>
        <rect x="54" y="60" width="56" height="56" rx="12" fill={C.paper} {...edge} />
        <circle cx="72" cy="78" r="5" fill={C.brandDeep} />
        <circle cx="92" cy="98" r="5" fill={C.brandDeep} />
      </g>
      <g className="ks-drift ks-d2">
        <circle cx="136" cy="94" r="24" fill={C.brand} {...edge} />
        <path d="M136 82v24M124 94h24" {...line} />
      </g>
      <path d="M40 118l10-18 10 18z" fill={C.butter} {...edge} className="ks-twinkle ks-d3" />
    </>
  ),

  /* Brain gym */
  brain: (
    <>
      <Blob fill={C.sky} />
      <path
        d="M76 50a20 20 0 0 0-18 28 18 18 0 0 0 10 28h56a18 18 0 0 0 10-28 20 20 0 0 0-18-28 20 20 0 0 0-40 0Z"
        fill={C.brand}
        {...edge}
      />
      <path d="M100 50v56M84 66c8 4 8 12 0 16M116 66c-8 4-8 12 0 16" {...line} />
      <circle cx="52" cy="52" r="6" fill={C.butter} className="ks-twinkle" />
      <circle cx="150" cy="60" r="5" fill={C.brandDeep} className="ks-twinkle ks-d2" />
      <circle cx="158" cy="106" r="4" fill={C.brand} className="ks-twinkle ks-d4" />
      <path d="M86 122h28" {...line} />
    </>
  ),

  /* Coding: the robot */
  robot: (
    <>
      <Blob fill={C.sage} />
      <path d="M100 44v-12" {...line} />
      <circle cx="100" cy="28" r="6" fill={C.brandDeep} className="ks-beat" />
      <rect x="62" y="46" width="76" height="62" rx="16" fill={C.paper} {...edge} />
      <g className="ks-blink">
        <circle cx="84" cy="72" r="7" fill={C.brand} />
        <circle cx="116" cy="72" r="7" fill={C.brand} />
      </g>
      <path d="M86 92h28" {...line} />
      <path d="M62 74H48M138 74h14" {...line} className="ks-wave" />
      <rect x="76" y="112" width="48" height="18" rx="8" fill={C.sky} {...edge} />
    </>
  ),

  /* Drawing room */
  brush: (
    <>
      <Blob fill={C.lilac} />
      <path d="M56 116c22-6 30-22 56-52" {...line} />
      <g className="ks-swing" style={{ transformOrigin: '132px 44px' }}>
        <path d="M116 62l24-24 16 16-24 24z" fill={C.butter} {...edge} />
        <path d="M112 66l-14 6 6-14z" fill={C.brandDeep} {...edge} />
      </g>
      <circle cx="60" cy="118" r="18" fill={C.paper} {...edge} />
      <circle cx="54" cy="112" r="4" fill={C.brand} />
      <circle cx="66" cy="112" r="4" fill={C.sky} />
      <circle cx="60" cy="124" r="4" fill={C.butter} />
      <path d="M148 100c8 6 8 14 0 18" {...line} className="ks-wave" />
    </>
  ),

  /* Speaking practice */
  mic: (
    <>
      <Blob fill={C.brandSoft} />
      <rect x="84" y="38" width="32" height="52" rx="16" fill={C.brand} {...edge} />
      <path d="M70 78a30 30 0 0 0 60 0M100 108v18M84 126h32" {...line} />
      <g className="ks-wave">
        <path d="M142 58c8 8 8 24 0 32" {...line} />
        <path d="M156 48c14 14 14 42 0 56" {...line} />
      </g>
      <g className="ks-wave ks-d2">
        <path d="M58 58c-8 8-8 24 0 32" {...line} />
      </g>
    </>
  ),

  /* Vocabulary */
  abc: (
    <>
      <Blob fill={C.butter} />
      <g className="ks-drift">
        <rect x="46" y="56" width="46" height="58" rx="10" fill={C.paper} {...edge} />
        <path d="M60 96l9-24 9 24M63 88h12" {...line} />
      </g>
      <g className="ks-drift ks-d2">
        <rect x="100" y="48" width="46" height="58" rx="10" fill={C.brand} {...edge} />
        <path d="M114 88V60h12a8 8 0 0 1 0 14h-12" {...line} />
      </g>
      <circle cx="154" cy="120" r="6" fill={C.brandDeep} className="ks-twinkle" />
      <circle cx="38" cy="42" r="5" fill={C.sky} className="ks-twinkle ks-d3" />
    </>
  ),

  /* Daily English chat */
  chat: (
    <>
      <Blob fill={C.sky} />
      <g className="ks-drift">
        <path
          d="M46 46h68a12 12 0 0 1 12 12v24a12 12 0 0 1-12 12H74l-16 14V94H46a12 12 0 0 1-12-12V58a12 12 0 0 1 12-12Z"
          fill={C.paper}
          {...edge}
        />
        <path d="M56 66h48M56 80h32" {...line} />
      </g>
      <g className="ks-drift ks-d2">
        <path
          d="M112 86h44a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10h-8v12l-14-12h-22a10 10 0 0 1-10-10V96a10 10 0 0 1 10-10Z"
          fill={C.brand}
          {...edge}
        />
        <path d="M124 102h24M124 114h16" {...line} />
      </g>
    </>
  ),

  /* Reading comprehension */
  book: (
    <>
      <Blob fill={C.sage} />
      <path d="M40 52h44a16 16 0 0 1 16 16v58a16 16 0 0 0-16-14H40Z" fill={C.paper} {...edge} />
      <path d="M160 52h-44a16 16 0 0 0-16 16v58a16 16 0 0 1 16-14h44Z" fill={C.brandSoft} {...edge} />
      <path d="M52 72h26M52 86h20M122 72h26M122 86h20" {...line} />
      <g className="ks-drift">
        <circle cx="146" cy="42" r="14" fill="none" stroke={C.brandDeep} strokeWidth="4" />
        <path d="M156 52l12 12" stroke={C.brandDeep} strokeWidth="4" strokeLinecap="round" />
      </g>
    </>
  ),

  /* Versus */
  versus: (
    <>
      <Blob fill={C.clay} />
      <g className="ks-drift">
        <circle cx="60" cy="80" r="26" fill={C.brand} {...edge} />
        <circle cx="60" cy="80" r="12" fill={C.paper} {...edge} />
      </g>
      <g className="ks-drift ks-d2">
        <circle cx="140" cy="80" r="26" fill={C.sky} {...edge} />
        <path d="M132 72l16 16M148 72l-16 16" {...line} />
      </g>
      <path d="M92 62l8 18-8 18M108 62l-8 18 8 18" {...line} className="ks-beat" />
      <path d="M56 122h88" {...line} />
    </>
  ),

  /* Classroom board */
  board: (
    <>
      <Blob fill={C.sky} />
      <rect x="44" y="38" width="112" height="70" rx="10" fill={C.paper} {...edge} />
      <path d="M58 60h50M58 76h34" {...line} className="ks-trace" />
      <path d="M100 108v18M78 126h44" {...line} />
      <circle cx="132" cy="82" r="9" fill={C.butter} className="ks-beat" />
      <circle cx="164" cy="46" r="5" fill={C.brandDeep} className="ks-twinkle ks-d2" />
    </>
  ),

  /* Parent quiz */
  quiz: (
    <>
      <Blob fill={C.brandSoft} />
      <rect x="58" y="34" width="84" height="98" rx="12" fill={C.paper} {...edge} />
      <rect x="82" y="24" width="36" height="18" rx="8" fill={C.brand} {...edge} />
      <path d="M74 66h34M74 84h44M74 102h26" {...line} />
      <g className="ks-beat">
        <path d="M126 92c0-6 5-9 9-5 4-4 9-1 9 5 0 6-9 12-9 12s-9-6-9-12Z" fill={C.brandDeep} />
      </g>
      <circle cx="46" cy="52" r="5" fill={C.butter} className="ks-twinkle ks-d3" />
    </>
  ),

  /* Empty / not found */
  empty: (
    <>
      <Blob fill={C.brandSoft} />
      <g className="ks-drift">
        <circle cx="100" cy="80" r="30" fill={C.paper} {...edge} />
        <path d="M90 74h.01M110 74h.01" {...line} />
        <path d="M90 96c6-5 14-5 20 0" {...line} />
      </g>
      <circle cx="52" cy="60" r="5" fill={C.brand} className="ks-twinkle" />
      <circle cx="150" cy="102" r="4" fill={C.brandDeep} className="ks-twinkle ks-d2" />
    </>
  ),
}

export const sceneNames = Object.keys(SCENES)

export default function Scene({ name, className = '', size, ...rest }) {
  const art = SCENES[name] || SCENES.empty
  return (
    <svg
      viewBox="0 0 200 160"
      width={size}
      className={className}
      role="presentation"
      aria-hidden="true"
      {...rest}
    >
      {art}
    </svg>
  )
}
