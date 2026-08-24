import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import Scene from '../components/Scene'
import { Badge, Button, Paper, SectionTitle, Shelf, Sticker, Stars, tint } from '../components/ui'
import { ACTIVITIES } from '../data/activities'
import { ARTICLES, catOf } from '../data/articles'
import { STORIES } from '../data/stories'
import { LOGIC_GAMES } from '../data/catalog'
import { TALK_SCENES } from '../data/talk'
import { useApp } from '../store/AppContext'

/* The day is split into four moods; the home screen leads with the current one. */
function moodOf(hour) {
  if (hour < 11)
    return {
      id: 'morning',
      emoji: '🌤️',
      th: 'เช้านี้',
      en: 'This morning',
      tone: 'butter',
      lineTh: 'เริ่มวันด้วยอะไรเบา ๆ ก่อนออกจากบ้าน',
      lineEn: 'Something gentle before you head out',
    }
  if (hour < 16)
    return {
      id: 'midday',
      emoji: '🌞',
      th: 'บ่ายนี้',
      en: 'This afternoon',
      tone: 'sage',
      lineTh: 'มีแรงเหลือ พาลูกขยับตัวสักหน่อย',
      lineEn: 'Energy to spare — get them moving',
    }
  if (hour < 20)
    return {
      id: 'evening',
      emoji: '🌇',
      th: 'เย็นนี้',
      en: 'This evening',
      tone: 'clay',
      lineTh: 'ช่วงที่ทุกคนกลับมาเจอกัน',
      lineEn: 'The part of the day everyone comes back together',
    }
  return {
    id: 'night',
    emoji: '🌙',
    th: 'คืนนี้',
    en: 'Tonight',
    tone: 'lilac',
    lineTh: 'ค่อย ๆ ลดความเร็วลงก่อนเข้านอน',
    lineEn: 'Time to slow everything down before bed',
  }
}

/* the pinned suggestion borrows the scene that matches its category */
const PICK_SCENE = { play: 'blocks', meal: 'blocks', learn: 'abc', sleep: 'moon' }

const MOOD_CAT = { morning: 'learn', midday: 'play', evening: 'meal', night: 'sleep' }

export default function Home() {
  const { t, tx, stars, progress } = useApp()
  const navigate = useNavigate()
  const [mins, setMins] = useState(null)

  const mood = moodOf(new Date().getHours())
  const moodTint = tint(mood.tone)

  const pick = useMemo(() => {
    const pool = ACTIVITIES.filter((a) => a.cat === MOOD_CAT[mood.id])
    return pool[new Date().getDate() % pool.length] ?? ACTIVITIES[0]
  }, [mood.id])

  const quick = useMemo(() => ACTIVITIES.filter((a) => a.mins === 5).slice(0, 6), [])
  const doneCount = Object.keys(progress).length
  const talkToday = TALK_SCENES[new Date().getDate() % TALK_SCENES.length]

  return (
    <div className="space-y-11 pt-6">
      {/* ---------- Greeting + the day's one suggestion ---------- */}
      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr] lg:items-stretch">
        <Paper lift className={`relative overflow-hidden p-6 sm:p-7 ${moodTint.bg} ${moodTint.edge}`}>
          <span className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-surface/40" />
          <span className="pointer-events-none absolute -bottom-16 -right-4 size-28 rounded-full bg-surface/30" />

          <div className="relative">
            <p className={`flex items-center gap-2 text-sm font-bold ${moodTint.fg}`}>
              <span className="text-lg">{mood.emoji}</span> {t(mood.th, mood.en)}
            </p>
            <h1 className="mt-2 font-display text-[30px] font-bold leading-[1.2] text-ink-900 sm:text-[34px]">
              {t('สิบนาทีของวันนี้', 'Ten minutes today')}
              <br />
              {t('ก็เป็นวันที่ดีของลูกได้', 'can be your child’s best bit')}
            </h1>
            <p className="mt-2.5 max-w-[42ch] text-[15px] leading-relaxed text-ink-700">
              {t(mood.lineTh, mood.lineEn)}
            </p>

            <div className="mt-6">
              <p className="mb-2 text-xs font-bold text-ink-500">
                {t('ว่างกี่นาที?', 'How long have you got?')}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {[5, 15, 30].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMins(m)}
                    className={`press rounded-2xl border-[1.5px] px-5 py-2.5 font-display font-bold transition ${
                      mins === m
                        ? 'border-brand-600 bg-brand-500 text-white shadow-[3px_4px_0_var(--color-brand-700)]'
                        : 'border-edge bg-surface text-ink-900 shadow-[3px_4px_0_rgba(107,39,64,.07)]'
                    }`}
                  >
                    {m} <span className="text-xs font-semibold opacity-70">{t('นาที', 'min')}</span>
                  </button>
                ))}
                <Button
                  className="!rounded-2xl"
                  disabled={!mins}
                  onClick={() => navigate(`/play?mins=${mins}`)}
                >
                  {t('ไปดูเลย', 'Show me')} <Icon name="arrowRight" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </Paper>

        {/* The one pinned suggestion — taped to the board */}
        <Paper lift className="tape relative flex flex-col justify-between p-6">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone="blush">{t('เลือกให้แล้ววันนี้', 'Today’s pick')}</Badge>
              <span className="text-[11px] font-bold text-ink-300">
                ~{pick.mins} {t('นาที', 'min')}
              </span>
            </div>
            <h2 className="mt-3 font-display text-xl font-bold leading-snug text-ink-900">
              {t(pick.th, pick.en)}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{tx(pick, 'need')}</p>
            <p className="mt-3 border-l-[3px] border-brand-200 pl-3 text-[13px] leading-relaxed text-ink-500">
              {tx(pick, 'why')}
            </p>
          </div>
          <div className="mt-5 flex items-end justify-between gap-3">
            <Scene name={PICK_SCENE[pick.cat] ?? 'blocks'} className="-mb-2 w-32 shrink-0" />
            <Button as={Link} to={`/activities/${pick.id}`} variant="soft" size="sm">
              {t('ลองดู', 'Try it')} <Icon name="arrowRight" size={14} />
            </Button>
          </div>
        </Paper>
      </section>

      {/* ---------- Quick 5-minute shelf ---------- */}
      <Shelf
        title={t('ห้านาทีก็ทำได้', 'Five minutes is enough')}
        to="/activities"
        action={t('ทั้งหมด', 'All')}
      >
        {quick.map((a) => (
          <Paper
            as={Link}
            to={`/activities/${a.id}`}
            key={a.id}
            className="press flex w-[210px] shrink-0 snap-start flex-col gap-2.5 p-4"
          >
            <Sticker tone={a.tone} icon={a.icon} />
            <span className="font-display font-bold leading-snug text-ink-900">{t(a.th, a.en)}</span>
            <span className="line-clamp-2 text-xs leading-snug text-ink-500">{tx(a, 'need')}</span>
            <span className="mt-auto pt-2 text-[11px] font-bold text-brand-600">
              ~{a.mins} {t('นาที', 'min')}
            </span>
          </Paper>
        ))}
      </Shelf>

      {/* ---------- Two editorial columns ---------- */}
      <div className="grid gap-9 lg:grid-cols-2">
        <section className="space-y-3.5">
          <SectionTitle to="/articles" action={t('ทั้งหมด', 'All')}>
            {t('อ่านสักหน่อย', 'A short read')}
          </SectionTitle>
          <div className="space-y-2.5">
            {ARTICLES.slice(0, 3).map((a) => {
              const c = catOf(a.cat)
              return (
                <Paper as={Link} to={`/articles/${a.id}`} key={a.id} className="press flex gap-3.5 p-4">
                  <span className={`w-1.5 shrink-0 rounded-full ${tint(c.tone).bg}`} />
                  <span className="min-w-0 flex-1">
                    <Badge tone={c.tone}>{t(c.th, c.en)}</Badge>
                    <span className="mt-1.5 block font-display font-bold leading-snug text-ink-900">
                      {t(a.th, a.en)}
                    </span>
                    <span className="mt-1 block text-xs text-ink-500">
                      {t(`อ่าน ${a.read} นาที`, `${a.read} min read`)}
                    </span>
                  </span>
                </Paper>
              )
            })}
          </div>
        </section>

        <section className="space-y-3.5">
          <SectionTitle to="/stories" action={t('ทั้งหมด', 'All')}>
            {t('ก่อนปิดไฟ', 'Before lights out')}
          </SectionTitle>
          <div className="space-y-2.5">
            {STORIES.slice(0, 3).map((s) => (
              <Paper
                as={Link}
                to={`/stories/${s.id}`}
                key={s.id}
                className="press flex items-center gap-3.5 p-4"
              >
                <Sticker tone={s.tone} emoji={s.emoji} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display font-bold text-ink-900">{t(s.th, s.en)}</span>
                  <span className="block truncate text-xs text-ink-500">{tx(s, 'sub')}</span>
                </span>
                <span className="shrink-0 text-[11px] font-bold text-ink-300">
                  {s.read} {t('นาที', 'min')}
                </span>
              </Paper>
            ))}
          </div>
        </section>
      </div>

      {/* ---------- Games shelf ---------- */}
      <Shelf title={t('เกมฝึกคิด', 'Thinking games')} to="/games" action={t('ทั้งหมด', 'All')}>
        {LOGIC_GAMES.slice(0, 6).map((g) => (
          <Paper
            as={Link}
            to={g.to}
            key={g.id}
            className="press flex w-[168px] shrink-0 snap-start flex-col items-start gap-2 p-4"
          >
            <Sticker tone={g.tone} emoji={g.emoji} size="lg" className="tilt-r" />
            <span className="font-display text-sm font-bold leading-snug text-ink-900">{t(g.th, g.en)}</span>
            <span className="text-[11px] text-ink-500">{tx(g, 'age')}</span>
          </Paper>
        ))}
      </Shelf>

      {/* ---------- Phrase of the day + progress ---------- */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Paper
          as={Link}
          to={`/talk/daily/${talkToday.id}`}
          tone="sky"
          className="press flex items-center gap-4 p-5"
        >
          <span className="text-4xl">{talkToday.emoji}</span>
          <span className="min-w-0">
            <span className="block text-xs font-bold text-sky-ink">
              {t('ประโยควันนี้', 'Phrase of the day')}
            </span>
            <span className="mt-1 block font-display text-lg font-bold leading-snug text-ink-900">
              {talkToday.lines[0][0]}
            </span>
            <span className="block text-sm text-ink-500">{talkToday.lines[0][1]}</span>
          </span>
        </Paper>

        <Paper className="flex items-center gap-4 p-5">
          <Sticker tone="butter" emoji="⭐" size="lg" className="tilt-l" />
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-ink-900">{t('สะสมไว้แล้ว', 'Collected so far')}</p>
            <p className="mt-0.5 text-sm text-ink-500">
              {t(`${stars} ดาว · ทำสำเร็จ ${doneCount} อย่าง`, `${stars} stars · ${doneCount} things done`)}
            </p>
            <div className="mt-2">
              <Stars count={Math.min(3, Math.floor(stars / 10))} size={19} />
            </div>
          </div>
        </Paper>
      </div>

      <p className="pb-2 text-center text-xs leading-relaxed text-ink-300">
        {t(
          'เดโมหน้าบ้านอย่างเดียว · ไม่มีเซิร์ฟเวอร์ · ข้อมูลเก็บในเครื่องคุณเอง',
          'Frontend-only demo · no server · data stays on your device',
        )}
      </p>
    </div>
  )
}
