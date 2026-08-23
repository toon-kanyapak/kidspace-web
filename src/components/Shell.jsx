import { Suspense, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { useApp } from '../store/AppContext'

/* --------------------------------------------------------------------------
   Information architecture: a real app nav — a grouped sidebar on desktop,
 a five-slot tab bar on phones. No back-arrow-only navigation.
 -------------------------------------------------------------------------- */

const NAV_GROUPS = [
  {
    id: 'start',
    th: 'เริ่มต้น',
    en: 'Start',
    items: [
      { to: '/', icon: 'home', th: 'หน้าแรก', en: 'Home', end: true },
      { to: '/play', icon: 'clock', th: 'ว่างกี่นาที', en: 'Got a minute' },
    ],
  },
  {
    id: 'together',
    th: 'ทำด้วยกัน',
    en: 'Together',
    items: [
      { to: '/activities', icon: 'sparkle', th: 'กิจกรรม', en: 'Activities' },
      { to: '/stories', icon: 'moon', th: 'นิทานก่อนนอน', en: 'Bedtime stories' },
      { to: '/talk/daily', icon: 'chat', th: 'คุยอังกฤษวันนี้', en: 'Daily English' },
      { to: '/versus', icon: 'swords', th: 'เล่นแข่งกัน', en: 'Versus' },
    ],
  },
  {
    id: 'think',
    th: 'ฝึกคิด',
    en: 'Thinking',
    items: [
      { to: '/games', icon: 'game', th: 'เกมเรียนรู้', en: 'Learning games' },
      { to: '/brain', icon: 'brain', th: 'ยิมสมอง', en: 'Brain gym' },
      { to: '/coding', icon: 'robot', th: 'โค้ดดิ้ง', en: 'Coding' },
      { to: '/reading', icon: 'book', th: 'อ่านจับใจความ', en: 'Reading' },
    ],
  },
  {
    id: 'english',
    th: 'ภาษาอังกฤษ',
    en: 'English',
    items: [
      { to: '/speak', icon: 'mic', th: 'ซ้อมพูด', en: 'Speaking' },
      { to: '/words', icon: 'abc', th: 'คำศัพท์', en: 'Vocabulary' },
    ],
  },
  {
    id: 'make',
    th: 'สร้างสรรค์',
    en: 'Make',
    items: [
      { to: '/draw', icon: 'brush', th: 'ห้องวาดรูป', en: 'Drawing' },
      { to: '/classroom', icon: 'board', th: 'สื่อการสอน', en: 'Classroom' },
    ],
  },
  {
    id: 'parents',
    th: 'สำหรับพ่อแม่',
    en: 'For parents',
    items: [
      { to: '/articles', icon: 'book', th: 'บทความ', en: 'Articles' },
      { to: '/quiz/parent-type', icon: 'quiz', th: 'แบบทดสอบพ่อแม่', en: 'Parent quiz' },
    ],
  },
]

const TABS = [
  { to: '/', icon: 'home', th: 'หน้าแรก', en: 'Home', end: true },
  { to: '/activities', icon: 'sparkle', th: 'กิจกรรม', en: 'Do' },
  { to: '/games', icon: 'game', th: 'เกม', en: 'Play' },
  { to: '/articles', icon: 'book', th: 'อ่าน', en: 'Read' },
  { to: '/settings', icon: 'gear', th: 'ตั้งค่า', en: 'You' },
]

export function Wordmark({ size = 'md' }) {
  const big = size === 'lg'
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`petal grid place-items-center border-[1.5px] border-brand-600 bg-brand-400 text-white ${big ? 'size-11' : 'size-9'}`}
      >
        <Icon name="heart" size={big ? 21 : 17} className="fill-white/40" />
      </span>
      <span
        className={`font-display font-bold leading-none tracking-tight text-ink-900 ${big ? 'text-2xl' : 'text-xl'}`}
      >
        Kid<span className="text-brand-600">Space</span>
      </span>
    </span>
  )
}

function StarWallet({ compact }) {
  const { stars } = useApp()
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-butter bg-butter px-3 py-1.5 font-display font-bold text-butter-ink ${compact ? 'text-sm' : ''}`}
    >
      <Icon name="star" size={15} className="fill-current" /> {stars}
    </span>
  )
}

function Toggles() {
  const { sound, setSound, lang, setLang } = useApp()
  return (
    <>
      <button
        type="button"
        onClick={() => setSound(!sound)}
        aria-pressed={sound}
        aria-label={sound ? 'ปิดเสียง' : 'เปิดเสียง'}
        className="press grid size-9 place-items-center rounded-full border-[1.5px] border-edge bg-surface text-brand-600"
      >
        <Icon name={sound ? 'volume' : 'volumeX'} size={16} />
      </button>
      <button
        type="button"
        onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
        className="press rounded-full border-[1.5px] border-edge bg-surface px-3 py-2 text-xs font-bold text-ink-700"
      >
        {lang === 'th' ? 'EN' : 'TH'}
      </button>
    </>
  )
}

function SideNav() {
  const { t } = useApp()
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r-[1.5px] border-edge bg-cream/70 lg:flex">
      <div className="px-6 py-6">
        <Link to="/" className="press inline-block">
          <Wordmark size="lg" />
        </Link>
      </div>

      <nav className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-4 pb-4">
        {NAV_GROUPS.map((g) => (
          <div key={g.id}>
            <p className="px-3 pb-1.5 text-[11px] font-bold text-ink-300">{t(g.th, g.en)}</p>
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <li key={it.to}>
                  <NavLink
                    to={it.to}
                    end={it.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'border-[1.5px] border-brand-200 bg-surface text-brand-700 shadow-[2px_3px_0_rgba(179,65,100,.1)]'
                          : 'border-[1.5px] border-transparent text-ink-700 hover:bg-surface/70'
                      }`
                    }
                  >
                    <Icon name={it.icon} size={17} />
                    {t(it.th, it.en)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t-[1.5px] border-edge px-4 py-3">
        <Link
          to="/settings"
          className="press grid size-9 place-items-center rounded-full border-[1.5px] border-edge bg-surface text-ink-700"
          aria-label="ตั้งค่า"
        >
          <Icon name="gear" size={17} />
        </Link>
        <Link
          to="/feedback"
          className="press grid size-9 place-items-center rounded-full border-[1.5px] border-edge bg-surface text-ink-700"
          aria-label="ส่งความเห็น"
        >
          <Icon name="send" size={17} />
        </Link>
        <StarWallet compact />
      </div>
    </aside>
  )
}

function TabBar() {
  const { t } = useApp()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t-[1.5px] border-edge bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-lg">
        {TABS.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] font-bold transition ${
                  isActive ? 'text-brand-600' : 'text-ink-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid size-9 place-items-center rounded-full border-[1.5px] transition ${
                      isActive ? 'border-brand-200 bg-brand-100' : 'border-transparent'
                    }`}
                  >
                    <Icon name={tab.icon} size={18} />
                  </span>
                  {t(tab.th, tab.en)}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b-[1.5px] border-edge bg-paper/95 px-5 py-2.5 backdrop-blur lg:justify-end lg:px-10">
      <Link to="/" className="press lg:hidden">
        <Wordmark />
      </Link>
      <div className="flex items-center gap-2">
        <span className="hidden lg:inline-flex">
          <StarWallet compact />
        </span>
        <Toggles />
      </div>
    </header>
  )
}

/**
 * In-content page heading. The sidebar/tab bar already says where you are, so
 * this is a title block rather than a floating back bar; "back" only appears
 * on detail screens that have a parent list.
 */
export function PageHeader({ title, eyebrow, lead, right, to }) {
  const navigate = useNavigate()
  return (
    <div className="mb-6 flex items-start gap-4 pt-6">
      {to && (
        <button
          type="button"
          onClick={() => navigate(to)}
          aria-label="ย้อนกลับ"
          className="press mt-1 grid size-10 shrink-0 place-items-center rounded-full border-[1.5px] border-edge bg-surface text-ink-700 shadow-[2px_3px_0_rgba(107,39,64,.07)]"
        >
          <Icon name="back" size={18} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        {eyebrow && <p className="mb-1.5 text-xs font-bold text-brand-500">{eyebrow}</p>}
        <h1 className="font-display text-[26px] font-bold leading-tight text-ink-900 sm:text-3xl">{title}</h1>
        {lead && <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-ink-500">{lead}</p>}
      </div>
      {right && <div className="shrink-0 pt-1">{right}</div>}
    </div>
  )
}

function ScreenLoading() {
  return (
    <div className="grid min-h-[60dvh] place-items-center">
      <span className="animate-bob text-4xl">🌸</span>
    </div>
  )
}

export default function Shell() {
  const { pathname } = useLocation()

  // the page itself scrolls now, so a route change resets the window
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="min-h-dvh lg:pl-[252px]">
      <SideNav />
      <TopBar />

      <main id="app-scroll" className="mx-auto w-full max-w-[1060px] px-5 pb-28 lg:px-10 lg:pb-16">
        <Suspense fallback={<ScreenLoading />}>
          <Outlet />
        </Suspense>
      </main>

      <TabBar />
    </div>
  )
}
