import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { load, save, clearAll } from '../lib/storage'
import { blip, speak as speakRaw, stopSpeaking } from '../lib/speech'

const AppCtx = createContext(null)

const RATE_MAP = { verySlow: 0.55, slow: 0.75, normal: 1, fast: 1.3 }

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => load('lang', 'th'))
  const [sound, setSound] = useState(() => load('sound', true))
  const [rateKey, setRateKey] = useState(() => load('rateKey', 'normal'))
  const [voiceURI, setVoiceURI] = useState(() => load('voiceURI', ''))
  const [stars, setStars] = useState(() => load('stars', 0))
  const [progress, setProgress] = useState(() => load('progress', {}))
  const [favorites, setFavorites] = useState(() => load('favorites', []))

  useEffect(() => save('lang', lang), [lang])
  useEffect(() => save('sound', sound), [sound])
  useEffect(() => save('rateKey', rateKey), [rateKey])
  useEffect(() => save('voiceURI', voiceURI), [voiceURI])
  useEffect(() => save('stars', stars), [stars])
  useEffect(() => save('progress', progress), [progress])
  useEffect(() => save('favorites', favorites), [favorites])

  useEffect(() => {
    if (!sound) stopSpeaking()
  }, [sound])

  const speak = useCallback(
    (text, opts = {}) =>
      speakRaw(text, {
        rate: RATE_MAP[rateKey] ?? 1,
        voiceURI,
        enabled: sound,
        ...opts,
      }),
    [rateKey, voiceURI, sound],
  )

  const sfx = useCallback((kind) => blip(kind, sound), [sound])

  const addStars = useCallback((n = 1) => setStars((s) => s + n), [])

  const markDone = useCallback((key, value = true) => {
    setProgress((p) => ({ ...p, [key]: value }))
  }, [])

  const toggleFavorite = useCallback((id) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  }, [])

  const resetAll = useCallback(() => {
    clearAll()
    setLang('th')
    setSound(true)
    setRateKey('normal')
    setVoiceURI('')
    setStars(0)
    setProgress({})
    setFavorites([])
  }, [])

  const t = useCallback((th, en) => (lang === 'en' ? (en ?? th) : th), [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      sound,
      setSound,
      rateKey,
      setRateKey,
      rate: RATE_MAP[rateKey] ?? 1,
      voiceURI,
      setVoiceURI,
      stars,
      addStars,
      progress,
      markDone,
      favorites,
      toggleFavorite,
      speak,
      sfx,
      resetAll,
    }),
    [
      lang,
      t,
      sound,
      rateKey,
      voiceURI,
      stars,
      progress,
      favorites,
      speak,
      sfx,
      addStars,
      markDone,
      toggleFavorite,
      resetAll,
    ],
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
