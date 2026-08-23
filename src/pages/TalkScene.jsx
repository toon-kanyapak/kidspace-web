import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card, tint } from '../components/ui'
import { TALK_BLOCKS, talkSceneById } from '../data/talk'
import { useApp } from '../store/AppContext'

export default function TalkScene() {
  const { id } = useParams()
  const { t, speak, sfx, rate, addStars, markDone, progress } = useApp()
  const scene = talkSceneById(id)
  const [saidIdx, setSaidIdx] = useState([])

  if (!scene) return <Navigate to="/talk/daily" replace />
  const block = TALK_BLOCKS.find((b) => b.id === scene.block)
  const tn = tint(block?.tone)
  const allSaid = saidIdx.length >= scene.lines.length

  const toggle = (i, en) => {
    speak(en, { lang: 'en-US' })
    setSaidIdx((s) => (s.includes(i) ? s : [...s, i]))
  }

  const finish = () => {
    const key = `talk:${scene.id}`
    if (!progress[key]) addStars(2)
    markDone(key, true)
    sfx('great')
  }

  return (
    <>
      <PageHeader title={scene.th} to="/talk/daily" />
      <div className="mx-auto w-full max-w-[680px] space-y-4 pb-8">
        <Card className={`flex items-center gap-3.5 ${tn.bg} p-5`}>
          <span className="text-4xl">{scene.emoji}</span>
          <span>
            <span className="block text-lg font-extrabold text-ink-900">{scene.th}</span>
            <span className="block text-sm text-ink-500">
              {scene.en} · {t(block?.th, block?.en)}
            </span>
          </span>
        </Card>

        <p className="text-center text-sm font-semibold text-ink-500">
          {t('แตะการ์ดเพื่อฟัง แล้วพูดกับลูกตาม', 'Tap a card to hear it, then say it')}
        </p>

        <div className="space-y-2.5">
          {scene.lines.map(([en, th], i) => {
            const said = saidIdx.includes(i)
            return (
              <div
                key={en}
                className={`flex items-center gap-3 rounded-2xl p-4 border-[1.5px] transition ${
                  said ? 'bg-brand-50 border-brand-200' : 'bg-surface border-edge'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i, en)}
                  className="press grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-500 text-white"
                  aria-label={t('ฟัง', 'Listen')}
                >
                  <Icon name="volume" size={19} />
                </button>
                <button type="button" onClick={() => toggle(i, en)} className="min-w-0 flex-1 text-left">
                  <span className="block font-bold leading-snug text-ink-900">{en}</span>
                  <span className="block text-sm text-ink-500">{th}</span>
                </button>
                <button
                  type="button"
                  onClick={() => speak(en, { lang: 'en-US', rate: Math.max(0.5, rate * 0.6) })}
                  className="press grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 border-[1.5px] border-edge"
                  aria-label={t('ช้า ๆ', 'Slow')}
                >
                  🐢
                </button>
              </div>
            )
          })}
        </div>

        <Button size="lg" onClick={finish} disabled={!allSaid}>
          <Icon name="star" size={17} />
          {allSaid
            ? t('คุยครบแล้ว รับดาว 2 ดวง', 'All done — collect 2 stars')
            : t(
                `ฟังให้ครบก่อนนะ (${saidIdx.length}/${scene.lines.length})`,
                `Listen to all (${saidIdx.length}/${scene.lines.length})`,
              )}
        </Button>
      </div>
    </>
  )
}
