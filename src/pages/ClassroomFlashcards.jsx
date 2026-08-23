import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { PageHeader } from '../components/Shell'
import { Button, Card, Chip, Progress } from '../components/ui'
import { WORD_SETS } from '../data/words'
import { useApp } from '../store/AppContext'

export default function ClassroomFlashcards() {
  const { t, speak, sfx } = useApp()
  const [setId, setSetId] = useState(WORD_SETS[0].id)
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const set = useMemo(() => WORD_SETS.find((s) => s.id === setId), [setId])
  const word = set.words[i]

  const go = (d) => {
    setFlipped(false)
    setI((n) => (n + d + set.words.length) % set.words.length)
    sfx('tap')
  }

  return (
    <>
      <PageHeader title={t('แฟลชการ์ด', 'Flashcards')} to="/classroom" />
      <div className="mx-auto w-full max-w-[560px] space-y-4 pb-8">
        <div className="no-scrollbar bleed flex gap-2 overflow-x-auto">
          {WORD_SETS.map((s) => (
            <Chip
              key={s.id}
              active={setId === s.id}
              onClick={() => {
                setSetId(s.id)
                setI(0)
                setFlipped(false)
                sfx('tap')
              }}
            >
              {s.emoji} {s.th}
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Progress value={i + 1} max={set.words.length} className="flex-1" />
          <span className="shrink-0 text-xs font-bold tabular-nums text-ink-500">
            {i + 1}/{set.words.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setFlipped((f) => !f)
            speak(word.en, { lang: 'en-US' })
          }}
          className="press w-full"
        >
          <Card className="flex aspect-[4/3] flex-col items-center justify-center gap-4 bg-surface p-8">
            {!flipped ? (
              <>
                <span className="text-8xl">{word.emoji}</span>
                <span className="text-sm font-semibold text-ink-500">
                  {t('แตะเพื่อเปิดคำ', 'Tap to reveal')}
                </span>
              </>
            ) : (
              <div className="animate-pop text-center">
                <p className="text-4xl font-extrabold text-ink-900">{word.en}</p>
                <p className="mt-2 text-lg text-ink-500">{word.th}</p>
                <p className="mt-4 text-5xl">{word.emoji}</p>
              </div>
            )}
          </Card>
        </button>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="white" onClick={() => go(-1)}>
            <Icon name="back" size={16} />
          </Button>
          <Button variant="soft" onClick={() => speak(word.en, { lang: 'en-US' })}>
            <Icon name="volume" size={16} />
          </Button>
          <Button onClick={() => go(1)}>
            <Icon name="arrowRight" size={16} />
          </Button>
        </div>
      </div>
    </>
  )
}
