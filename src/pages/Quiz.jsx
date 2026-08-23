import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card, Progress, tint } from '../components/ui'
import { QUIZ_CHOICES, QUIZ_QUESTIONS, scoreQuiz } from '../data/quiz'
import { useApp } from '../store/AppContext'
import { scrollScreenTop } from '../lib/scroll'

function AxisBar({ label, value, hint }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-bold text-ink-900">{label}</span>
        <span className="font-extrabold tabular-nums text-brand-600">{value}%</span>
      </div>
      <Progress value={value} />
      <p className="text-xs text-ink-500">{hint}</p>
    </div>
  )
}

export default function Quiz() {
  const { t, sfx, addStars, markDone, progress } = useApp()
  const [stage, setStage] = useState('intro') // intro | run | result
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState({})

  const outcome = useMemo(() => (stage === 'result' ? scoreQuiz(answers) : null), [stage, answers])

  const start = () => {
    setStage('run')
    setI(0)
    setAnswers({})
    sfx('tap')
    scrollScreenTop(false)
  }

  const pick = (score) => {
    const next = { ...answers, [i]: score }
    setAnswers(next)
    sfx('tap')
    if (i + 1 >= QUIZ_QUESTIONS.length) {
      setStage('result')
      scrollScreenTop(false)
      if (!progress['quiz:parent-type']) addStars(5)
      markDone('quiz:parent-type', true)
      sfx('great')
    } else {
      setI(i + 1)
    }
  }

  if (stage === 'intro') {
    return (
      <>
        <PageHeader title={t('แบบทดสอบพ่อแม่', 'Parent quiz')} />
        <div className="mx-auto w-full max-w-[640px] space-y-5 pb-8">
          <div className="rounded-3xl bg-gradient-to-br from-brand-300 to-brand-500 p-7 text-center text-white">
            <span className="text-5xl">🌷</span>
            <h2 className="mt-3 text-2xl font-extrabold leading-snug">
              {t('คุณเป็นพ่อแม่แบบไหน?', 'What kind of parent are you?')}
            </h2>
            <p className="mt-2 text-sm text-white/90">
              {t('32 คำถามสั้น ๆ ใช้เวลา 2–3 นาที', '32 short questions, 2–3 minutes')}
            </p>
          </div>

          <Card className="space-y-3 p-5 text-sm leading-relaxed text-ink-700">
            <p>
              {t(
                'แบบทดสอบนี้อ้างอิงแนวคิดทางจิตวิทยาพัฒนาการของ Baumrind และ Maccoby & Martin ซึ่งมองสไตล์การเลี้ยงลูกผ่านสองแกน คือความอบอุ่น และการกำกับ',
                'Based on Baumrind and Maccoby & Martin, which map parenting onto two axes: warmth and control.',
              )}
            </p>
            <p className="rounded-2xl bg-brand-50 p-4 text-ink-700">
              {t(
                'ไม่มีพ่อแม่ที่ถูกหรือผิด มีแต่สไตล์ที่ต่างกัน — ผลลัพธ์นี้ไว้เพื่อความเข้าใจตัวเองและความสนุก ไม่ใช่การวินิจฉัย',
                'There are no right or wrong parents, only different styles. For understanding and fun — not a diagnosis.',
              )}
            </p>
          </Card>

          <Button size="lg" onClick={start}>
            <Icon name="sparkle" size={17} /> {t('เริ่มทำแบบทดสอบ', 'Start the quiz')}
          </Button>
        </div>
      </>
    )
  }

  if (stage === 'run') {
    const q = QUIZ_QUESTIONS[i]
    return (
      <>
        <PageHeader title={t('แบบทดสอบพ่อแม่', 'Parent quiz')} to="/quiz/parent-type" />
        <div className="space-y-5 pb-8">
          <div className="flex items-center gap-3">
            <Progress value={i + 1} max={QUIZ_QUESTIONS.length} className="flex-1" />
            <span className="shrink-0 text-xs font-bold tabular-nums text-ink-500">
              {i + 1}/{QUIZ_QUESTIONS.length}
            </span>
          </div>

          <Card key={i} className="animate-rise p-6">
            <p className="text-[19px] font-extrabold leading-relaxed text-ink-900">{q.th}</p>
          </Card>

          <div className="space-y-2.5">
            {QUIZ_CHOICES.map((c) => (
              <button
                key={c.score}
                type="button"
                onClick={() => pick(c.score)}
                className="press flex w-full items-center justify-between rounded-2xl bg-surface px-5 py-4 text-left font-semibold text-ink-900 border-[1.5px] border-edge hover:border-brand-300"
              >
                {t(c.th, c.en)}
                <span className="flex gap-1">
                  {[0, 1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className={`size-2 rounded-full ${n <= c.score ? 'bg-brand-400' : 'bg-brand-100'}`}
                    />
                  ))}
                </span>
              </button>
            ))}
          </div>

          {i > 0 && (
            <button
              type="button"
              onClick={() => setI(i - 1)}
              className="press mx-auto flex items-center gap-1.5 text-sm font-bold text-ink-500"
            >
              <Icon name="back" size={15} /> {t('ข้อก่อนหน้า', 'Previous')}
            </button>
          )}
        </div>
      </>
    )
  }

  const { result, warmth, demand } = outcome
  const tn = tint(result.tone)
  return (
    <>
      <PageHeader title={t('ผลลัพธ์', 'Your result')} to="/quiz/parent-type" />
      <div className="space-y-4 pb-8">
        <Card className={`animate-pop ${tn.bg} p-7 text-center`}>
          <span className="text-6xl">{result.emoji}</span>
          <h2 className="mt-3 text-2xl font-extrabold text-ink-900">{result.th}</h2>
          <p className="mt-1 text-sm font-semibold text-ink-500">
            {result.en} · {result.tagTh}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">{result.summaryTh}</p>
        </Card>

        <Card className="space-y-4 p-5">
          <AxisBar
            label={t('ความอบอุ่น / การตอบสนอง', 'Warmth')}
            value={warmth}
            hint={t('การรับฟัง ปลอบโยน และอยู่ข้าง ๆ ลูก', 'Listening, comforting, being present')}
          />
          <AxisBar
            label={t('การกำกับ / ความคาดหวัง', 'Structure')}
            value={demand}
            hint={t('กติกา ขอบเขต และความสม่ำเสมอ', 'Rules, limits, consistency')}
          />
        </Card>

        <Card className="space-y-2.5 p-5">
          <p className="flex items-center gap-1.5 font-bold text-ink-900">
            <Icon name="trophy" size={16} className="text-brand-500" /> {t('จุดแข็งของคุณ', 'Your strengths')}
          </p>
          {result.strengthsTh.map((s) => (
            <p key={s} className="flex items-start gap-2 text-sm leading-relaxed text-ink-700">
              <Icon name="check" size={15} className="mt-0.5 shrink-0 text-brand-500" /> {s}
            </p>
          ))}
        </Card>

        <Card className="space-y-2.5 border-l-4 border-brand-300 p-5">
          <p className="flex items-center gap-1.5 font-bold text-ink-900">
            <Icon name="bulb" size={16} className="text-brand-500" /> {t('ลองเติมสิ่งนี้ดู', 'Things to try')}
          </p>
          {result.tipsTh.map((s) => (
            <p key={s} className="flex items-start gap-2 text-sm leading-relaxed text-ink-700">
              <Icon name="sparkle" size={15} className="mt-0.5 shrink-0 text-brand-400" /> {s}
            </p>
          ))}
        </Card>

        <p className="px-2 text-center text-xs leading-relaxed text-ink-500">
          {t(
            'ผลนี้สะท้อนช่วงเวลาหนึ่งเท่านั้น และเปลี่ยนได้เสมอ ไม่ใช่การวินิจฉัยทางคลินิก',
            'A snapshot of one moment, not a clinical diagnosis.',
          )}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="soft" onClick={start}>
            <Icon name="refresh" size={16} /> {t('ทำใหม่', 'Retake')}
          </Button>
          <Button as={Link} to="/articles" variant="white">
            {t('อ่านบทความ', 'Read articles')}
          </Button>
        </div>
      </div>
    </>
  )
}
