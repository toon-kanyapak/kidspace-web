import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card, Chip } from '../components/ui'
import { useApp } from '../store/AppContext'

const COLORS = [
  '#f97faf',
  '#ff9dc3',
  '#c94a7f',
  '#f0a04b',
  '#f6d365',
  '#7bc47f',
  '#5aa9e6',
  '#9b7ede',
  '#8b5e3c',
  '#45253a',
]

const BRUSHES = [
  { id: 'crayon', emoji: '🖍️', th: 'สีเทียน', en: 'Crayon' },
  { id: 'neon', emoji: '💡', th: 'นีออน', en: 'Neon' },
  { id: 'rainbow', emoji: '🌈', th: 'สายรุ้ง', en: 'Rainbow' },
  { id: 'glitter', emoji: '✨', th: 'กากเพชร', en: 'Glitter' },
  { id: 'hearts', emoji: '💗', th: 'ลายน่ารัก', en: 'Stickers' },
  { id: 'eraser', emoji: '🧽', th: 'ยางลบ', en: 'Eraser' },
]

const SIZES = [6, 12, 22, 36]

const TRACE_SETS = {
  shapes: ['○', '△', '□', '☆', '♡'],
  numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  thai: ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ด', 'ต', 'ม'],
  latin: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
}

const PROMPTS = [
  'วาดบ้านของหนู 🏠',
  'วาดสัตว์ที่หนูชอบ 🐾',
  'วาดครอบครัวของเรา 👨‍👩‍👧',
  'วาดอาหารที่อร่อยที่สุด 🍜',
  'วาดสิ่งที่อยู่ในฝันเมื่อคืน 💭',
  'วาดต้นไม้กับดอกไม้ 🌷',
  'วาดรถที่บินได้ 🚗',
  'วาดใต้ทะเล 🐠',
  'วาดอวกาศกับดาว 🚀',
  'วาดวันที่มีความสุขที่สุด ☀️',
]

export default function Draw() {
  const { t, sfx, addStars } = useApp()
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const lastPt = useRef(null)
  const hueRef = useRef(0)
  const historyRef = useRef([])

  const [color, setColor] = useState(COLORS[0])
  const [brush, setBrush] = useState('crayon')
  const [size, setSize] = useState(12)
  const [mode, setMode] = useState('free') // free | trace
  const [traceSet, setTraceSet] = useState('shapes')
  const [traceChar, setTraceChar] = useState('○')
  const [prompt, setPrompt] = useState(null)
  const [saved, setSaved] = useState(false)

  const fitCanvas = useCallback(() => {
    const cv = canvasRef.current
    if (!cv) return
    const rect = cv.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const prev = cv.width ? cv.toDataURL() : null
    cv.width = Math.round(rect.width * dpr)
    cv.height = Math.round(rect.height * dpr)
    const ctx = cv.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (prev) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height)
      img.src = prev
    }
  }, [])

  useEffect(() => {
    fitCanvas()
    window.addEventListener('resize', fitCanvas)
    return () => window.removeEventListener('resize', fitCanvas)
  }, [fitCanvas])

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const pushHistory = () => {
    const cv = canvasRef.current
    if (!cv) return
    historyRef.current.push(cv.toDataURL())
    if (historyRef.current.length > 12) historyRef.current.shift()
  }

  const stamp = (ctx, p, glyph) => {
    ctx.save()
    ctx.font = `${size * 1.8}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(glyph, p.x, p.y)
    ctx.restore()
  }

  const strokeTo = (p) => {
    const ctx = canvasRef.current.getContext('2d')
    const from = lastPt.current || p
    ctx.globalCompositeOperation = brush === 'eraser' ? 'destination-out' : 'source-over'
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
    ctx.lineWidth = size

    if (brush === 'rainbow') {
      hueRef.current = (hueRef.current + 7) % 360
      ctx.strokeStyle = `hsl(${hueRef.current} 85% 68%)`
    } else if (brush === 'neon') {
      ctx.strokeStyle = color
      ctx.shadowBlur = size * 1.6
      ctx.shadowColor = color
    } else if (brush === 'crayon') {
      ctx.strokeStyle = color
      ctx.globalAlpha = 0.9
    } else {
      ctx.strokeStyle = color
    }

    if (brush === 'glitter') {
      ctx.globalAlpha = 0.9
      for (let i = 0; i < 5; i += 1) {
        const r = size * 0.55
        ctx.beginPath()
        ctx.fillStyle = i % 2 ? '#fff' : color
        ctx.arc(
          p.x + (Math.random() - 0.5) * size * 2,
          p.y + (Math.random() - 0.5) * size * 2,
          Math.random() * r * 0.4 + 1,
          0,
          Math.PI * 2,
        )
        ctx.fill()
      }
      lastPt.current = p
      return
    }

    if (brush === 'hearts') {
      stamp(ctx, p, ['💗', '⭐', '🌸', '🦋'][Math.floor(Math.random() * 4)])
      lastPt.current = p
      return
    }

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()

    if (brush === 'crayon') {
      // speckle for a waxy texture
      ctx.globalAlpha = 0.25
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath()
        ctx.arc(
          p.x + (Math.random() - 0.5) * size,
          p.y + (Math.random() - 0.5) * size,
          size * 0.18,
          0,
          Math.PI * 2,
        )
        ctx.fillStyle = color
        ctx.fill()
      }
    }
    lastPt.current = p
  }

  const start = (e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    pushHistory()
    drawing.current = true
    lastPt.current = null
    setSaved(false)
    strokeTo(pos(e))
  }
  const move = (e) => {
    if (drawing.current) {
      e.preventDefault()
      strokeTo(pos(e))
    }
  }
  const end = () => {
    drawing.current = false
    lastPt.current = null
  }

  const clear = () => {
    pushHistory()
    const cv = canvasRef.current
    cv.getContext('2d').clearRect(0, 0, cv.width, cv.height)
    setSaved(false)
    sfx('pop')
  }

  const undo = () => {
    const prev = historyRef.current.pop()
    if (!prev) return
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    const rect = cv.getBoundingClientRect()
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, cv.width, cv.height)
      ctx.drawImage(img, 0, 0, rect.width, rect.height)
    }
    img.src = prev
    sfx('tap')
  }

  const showParent = () => {
    if (saved) return
    setSaved(true)
    addStars(2)
    sfx('great')
  }

  return (
    <>
      <PageHeader
        title={t('ห้องวาดรูป', 'Drawing room')}
        right={
          <button
            type="button"
            onClick={undo}
            aria-label={t('ย้อนกลับ', 'Undo')}
            className="press grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-600 border-[1.5px] border-edge"
          >
            <Icon name="refresh" size={17} />
          </button>
        }
      />

      <div className="mx-auto w-full max-w-[620px] space-y-3 pb-8">
        <div className="flex gap-2">
          <Chip
            active={mode === 'free'}
            onClick={() => {
              setMode('free')
              sfx('tap')
            }}
          >
            {t('วาดอิสระ', 'Free draw')}
          </Chip>
          <Chip
            active={mode === 'trace'}
            onClick={() => {
              setMode('trace')
              sfx('tap')
            }}
          >
            {t('ลากตามเส้นประ', 'Trace')}
          </Chip>
          <button
            type="button"
            onClick={() => {
              setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
              sfx('pop')
            }}
            className="press ml-auto shrink-0 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-bold text-brand-700"
          >
            <span className="mr-1">🎲</span>
            {t('ขอโจทย์', 'Prompt')}
          </button>
        </div>

        {prompt && mode === 'free' && (
          <p className="animate-pop rounded-2xl bg-butter px-4 py-3 text-center text-sm font-bold text-butter-ink">
            {prompt}
          </p>
        )}

        {mode === 'trace' && (
          <div className="space-y-2.5">
            <div className="no-scrollbar bleed flex gap-2 overflow-x-auto">
              {[
                ['shapes', 'รูปทรง'],
                ['numbers', 'ตัวเลข'],
                ['thai', 'ก.ไก่'],
                ['latin', 'A–Z'],
              ].map(([k, label]) => (
                <Chip
                  key={k}
                  active={traceSet === k}
                  onClick={() => {
                    setTraceSet(k)
                    setTraceChar(TRACE_SETS[k][0])
                    sfx('tap')
                  }}
                >
                  {label}
                </Chip>
              ))}
            </div>
            <div className="no-scrollbar bleed flex gap-2 overflow-x-auto">
              {TRACE_SETS[traceSet].map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => {
                    setTraceChar(ch)
                    clear()
                    sfx('tap')
                  }}
                  className={`press grid size-12 shrink-0 place-items-center rounded-2xl text-2xl font-bold border-[1.5px] transition ${
                    traceChar === ch
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-surface text-ink-900 border-edge'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-surface border-[1.5px] border-edge">
          {mode === 'trace' && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grid select-none place-items-center text-[min(56vw,17rem)] font-bold leading-none text-brand-100"
              style={{ WebkitTextStroke: '3px #ffd6e6', color: 'transparent' }}
            >
              {traceChar}
            </span>
          )}
          <canvas
            ref={canvasRef}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
            onPointerCancel={end}
            className="absolute inset-0 size-full touch-none"
          />
        </div>

        {/* Brushes */}
        <div className="no-scrollbar bleed flex gap-2 overflow-x-auto">
          {BRUSHES.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setBrush(b.id)
                sfx('tap')
              }}
              className={`press flex shrink-0 flex-col items-center gap-0.5 rounded-2xl px-3.5 py-2.5 border-[1.5px] transition ${
                brush === b.id
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-surface text-ink-700 border-edge'
              }`}
            >
              <span className="text-xl">{b.emoji}</span>
              <span className="text-[11px] font-bold">{t(b.th, b.en)}</span>
            </button>
          ))}
        </div>

        {/* Colors + sizes */}
        <div className="flex items-center gap-3 rounded-2xl bg-surface p-3 border-[1.5px] border-edge">
          <div className="flex flex-1 flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c)
                  if (brush === 'eraser') setBrush('crayon')
                  sfx('tap')
                }}
                aria-label={c}
                className={`press size-8 rounded-full border-2 transition ${color === c ? 'border-ink-900 ' : 'border-white'}`}
                style={{ background: c }}
              />
            ))}
          </div>
          <div className="flex shrink-0 flex-col gap-1.5">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s)
                  sfx('tap')
                }}
                className={`press grid h-6 w-10 place-items-center rounded-lg ${size === s ? 'bg-brand-100' : ''}`}
                aria-label={`ขนาด ${s}`}
              >
                <span className="rounded-full bg-ink-700" style={{ width: s / 2.4, height: s / 2.4 }} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="white" onClick={clear}>
            <Icon name="x" size={16} /> {t('ล้างกระดาน', 'Clear')}
          </Button>
          <Button onClick={showParent}>
            <Icon name="star" size={16} className={saved ? 'fill-white' : ''} />
            {saved ? t('ได้ดาวแล้ว!', 'Stars earned!') : t('อวดพ่อแม่', 'Show a grown-up')}
          </Button>
        </div>

        <Card className="p-4 text-xs leading-relaxed text-ink-500">
          {t(
            'เล่นเต็มจอได้ดีที่สุดบนแท็บเล็ต ใช้นิ้วหรือปากกาสไตลัสก็ได้ · ในเดโมนี้ภาพยังไม่ถูกบันทึกลงเครื่อง',
            'Best on a tablet with a finger or stylus. In this demo drawings are not saved to disk.',
          )}
        </Card>
      </div>
    </>
  )
}
