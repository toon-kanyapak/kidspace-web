import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card, Chip, Stars, tint } from '../components/ui'
import { WORLDS, buildLevel } from '../data/coding'
import { useApp } from '../store/AppContext'

const DIRS = {
  up: { dx: 0, dy: -1, glyph: '⬆️' },
  down: { dx: 0, dy: 1, glyph: '⬇️' },
  left: { dx: -1, dy: 0, glyph: '⬅️' },
  right: { dx: 1, dy: 0, glyph: '➡️' },
}

export default function Coding() {
  const { t, sfx, addStars, markDone, progress } = useApp()
  const [world, setWorld] = useState(0)
  const [level, setLevel] = useState(0)
  const [program, setProgram] = useState([])
  const [bot, setBot] = useState(null)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null) // 'win' | 'crash' | 'lost'
  const [gotStar, setGotStar] = useState(false)
  const timers = useRef([])

  const lv = useMemo(() => buildLevel(world, level), [world, level])
  const w = WORLDS[world]
  const tn = tint(w.tone)

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setBot({ ...lv.start })
    setRunning(false)
    setResult(null)
    setGotStar(false)
  }, [lv])

  useEffect(() => {
    reset()
    setProgram([])
  }, [reset])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const push = (cmd) => {
    if (running || program.length >= 14) return
    setProgram((p) => [...p, cmd])
    sfx('tap')
  }

  const expand = (prog) => {
    const out = []
    prog.forEach((c) => {
      if (c === 'loop') {
        const prev = out.slice(-2)
        out.push(...prev) // ×2 repeats the two previous steps
      } else out.push(c)
    })
    return out
  }

  const run = () => {
    if (running || !program.length) return
    reset()
    setRunning(true)
    const steps = expand(program)
    let pos = { ...lv.start }
    let star = false
    let crashed = false

    steps.forEach((cmd, i) => {
      const tm = setTimeout(
        () => {
          if (crashed) return
          const d = DIRS[cmd]
          const nx = pos.x + d.dx
          const ny = pos.y + d.dy
          const off = nx < 0 || ny < 0 || nx >= lv.size || ny >= lv.size
          const wall = lv.walls.some((wl) => wl.x === nx && wl.y === ny)
          if (off || wall) {
            crashed = true
            setResult('crash')
            setRunning(false)
            sfx('wrong')
            return
          }
          pos = { x: nx, y: ny }
          setBot({ ...pos })
          if (lv.star && pos.x === lv.star.x && pos.y === lv.star.y && !star) {
            star = true
            setGotStar(true)
            sfx('good')
          } else {
            sfx('tap')
          }
          if (i === steps.length - 1) {
            setRunning(false)
            if (pos.x === lv.goal.x && pos.y === lv.goal.y) {
              setResult('win')
              sfx('great')
              const key = `coding:${world}:${level}`
              if (!progress[key]) addStars(star ? 3 : 2)
              markDone(key, { star })
            } else {
              setResult('lost')
              sfx('wrong')
            }
          }
        },
        380 * (i + 1),
      )
      timers.current.push(tm)
    })
  }

  const cell = (x, y) => {
    const isBot = bot && bot.x === x && bot.y === y
    const isGoal = lv.goal.x === x && lv.goal.y === y
    const isWall = lv.walls.some((wl) => wl.x === x && wl.y === y)
    const isStar = lv.star && lv.star.x === x && lv.star.y === y && !gotStar
    return (
      <div
        key={`${x},${y}`}
        className="grid aspect-square place-items-center rounded-xl text-[min(7vw,1.75rem)] border-[1.5px] border-white/70"
        style={{ background: isWall ? 'rgba(255,255,255,.35)' : w.floor }}
      >
        {isBot ? (
          <span className="animate-pop">🤖</span>
        ) : isWall ? (
          <span>{w.wall}</span>
        ) : isGoal ? (
          <span>{w.goal}</span>
        ) : isStar ? (
          <span className="animate-float">⭐</span>
        ) : null}
      </div>
    )
  }

  const solvedCount = Array.from({ length: 12 }, (_, i) => progress[`coding:${world}:${i}`]).filter(
    Boolean,
  ).length

  return (
    <>
      <PageHeader title={t('โค้ดดิ้งหนูน้อย', 'Kids coding')} />
      <div className="mx-auto w-full max-w-[560px] space-y-3.5 pb-8">
        <div className="flex gap-2">
          {WORLDS.map((wd, i) => (
            <Chip
              key={wd.id}
              active={world === i}
              onClick={() => {
                setWorld(i)
                setLevel(0)
                sfx('tap')
              }}
            >
              <span className="mr-1">{wd.emoji}</span>
              {t(wd.th, wd.en)}
            </Chip>
          ))}
        </div>

        <div className="no-scrollbar bleed flex gap-1.5 overflow-x-auto">
          {Array.from({ length: 12 }, (_, i) => {
            const done = progress[`coding:${world}:${i}`]
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setLevel(i)
                  sfx('tap')
                }}
                className={`press grid size-9 shrink-0 place-items-center rounded-xl text-sm font-extrabold border-[1.5px] transition ${
                  level === i
                    ? 'bg-brand-500 text-white border-brand-500'
                    : done
                      ? 'bg-brand-100 text-brand-700 border-brand-200'
                      : 'bg-surface text-ink-500 border-edge'
                }`}
              >
                {done?.star ? '⭐' : i + 1}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-ink-500">
          <span>
            {t(
              `ด่านที่ ${level + 1} · ทางสั้นที่สุด ${lv.par} ก้าว`,
              `Level ${level + 1} · shortest ${lv.par} steps`,
            )}
          </span>
          <span>{t(`ผ่านแล้ว ${solvedCount}/12`, `${solvedCount}/12 solved`)}</span>
        </div>

        {/* Board */}
        <div className={`rounded-3xl ${tn.bg} p-2.5`}>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${lv.size}, minmax(0,1fr))` }}>
            {Array.from({ length: lv.size }, (_, y) => Array.from({ length: lv.size }, (_, x) => cell(x, y)))}
          </div>
        </div>

        {/* Program strip */}
        <Card className="min-h-20 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-ink-500">
              {t('โปรแกรมของหนู', 'Your program')} ({program.length}/14)
            </span>
            {program.length > 0 && !running && (
              <button
                type="button"
                onClick={() => {
                  setProgram([])
                  reset()
                  sfx('pop')
                }}
                className="press text-xs font-bold text-brand-600"
              >
                {t('ลบทั้งหมด', 'Clear')}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {program.length === 0 && (
              <span className="py-2 text-sm text-ink-300">
                {t('แตะปุ่มลูกศรด้านล่างเพื่อสั่งหุ่นยนต์', 'Tap the arrows below to program Bolt')}
              </span>
            )}
            {program.map((c, i) => (
              <button
                key={i}
                type="button"
                disabled={running}
                onClick={() => {
                  setProgram((p) => p.filter((_, j) => j !== i))
                  sfx('tap')
                }}
                className="press grid size-10 place-items-center rounded-xl bg-brand-50 text-lg border-[1.5px] border-brand-200"
              >
                {c === 'loop' ? '🔁' : DIRS[c].glyph}
              </button>
            ))}
          </div>
        </Card>

        {/* Command pad */}
        <div className="grid grid-cols-4 gap-2">
          {['left', 'up', 'down', 'right'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => push(k)}
              disabled={running}
              className="press grid aspect-square place-items-center rounded-2xl bg-surface text-2xl border-[1.5px] border-edge disabled:opacity-40"
            >
              {DIRS[k].glyph}
            </button>
          ))}
        </div>

        {lv.loopAllowed && (
          <button
            type="button"
            onClick={() => push('loop')}
            disabled={running || program.length < 2}
            className="press flex w-full items-center justify-center gap-2 rounded-2xl bg-lilac py-3 font-bold text-lilac-ink border-[1.5px] border-lilac disabled:opacity-40"
          >
            🔁 {t('ทำซ้ำ 2 คำสั่งล่าสุด อีกครั้ง', 'Repeat the last 2 commands')}
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="white"
            onClick={() => {
              reset()
              sfx('tap')
            }}
            disabled={running}
          >
            <Icon name="refresh" size={16} /> {t('เริ่มใหม่', 'Reset')}
          </Button>
          <Button onClick={run} disabled={running || !program.length}>
            <Icon name="play" size={16} /> {t('เล่นโปรแกรม', 'Run')}
          </Button>
        </div>

        {result === 'win' && (
          <Card className="animate-pop space-y-3 p-6 text-center">
            <span className="text-5xl">🎉</span>
            <p className="text-lg font-extrabold text-ink-900">
              {t('โบลท์ถึงบ้านแล้ว!', 'Bolt made it home!')}
            </p>
            <div className="flex justify-center">
              <Stars count={gotStar ? 3 : 2} />
            </div>
            {level < 11 && (
              <Button
                onClick={() => {
                  setLevel(level + 1)
                  setProgram([])
                }}
              >
                {t('ด่านถัดไป', 'Next level')} <Icon name="arrowRight" size={16} />
              </Button>
            )}
          </Card>
        )}
        {result === 'crash' && (
          <p className="animate-shake rounded-2xl bg-clay px-4 py-3 text-center text-sm font-bold text-clay-ink">
            💥{' '}
            {t(
              'ชนแล้ว! ลองแก้คำสั่งดูใหม่ — แตะคำสั่งเพื่อลบทีละอัน',
              'Crashed! Fix a step — tap a command to delete it.',
            )}
          </p>
        )}
        {result === 'lost' && (
          <p className="rounded-2xl bg-butter px-4 py-3 text-center text-sm font-bold text-butter-ink">
            🧭 {t('ยังไม่ถึงบ้าน ลองเพิ่มคำสั่งอีกนิด', 'Not home yet — add a few more steps.')}
          </p>
        )}

        <Card className="p-4 text-xs leading-relaxed text-ink-500">
          {t(
            'ไม่ต้องอ่านหนังสือออกก็เล่นได้ · ฝึกการเรียงลำดับ (sequencing) การแก้บั๊ก (debugging) และการวนซ้ำ (loops)',
            'No reading needed. Teaches sequencing, debugging, and loops.',
          )}
        </Card>
      </div>
    </>
  )
}
