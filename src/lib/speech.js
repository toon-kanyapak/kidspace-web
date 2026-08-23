/**
 * Thin wrapper over the Web Speech API. Everything is best-effort: the demo must
 * never break on a device/browser without speech synthesis.
 */

let voicesCache = []

export function getVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  const v = window.speechSynthesis.getVoices()
  if (v.length) voicesCache = v
  return voicesCache
}

export function onVoicesReady(cb) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return () => {}
  const handler = () => cb(getVoices())
  window.speechSynthesis.addEventListener('voiceschanged', handler)
  // some browsers already have them
  if (getVoices().length) cb(getVoices())
  return () => window.speechSynthesis.removeEventListener('voiceschanged', handler)
}

export function englishVoices() {
  return getVoices().filter((v) => v.lang?.toLowerCase().startsWith('en'))
}

export function speak(text, { rate = 1, lang = 'en-US', voiceURI, enabled = true } = {}) {
  if (!enabled) return
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = rate
    u.pitch = 1.05
    const voice = voiceURI && getVoices().find((v) => v.voiceURI === voiceURI)
    if (voice) u.voice = voice
    else {
      const fallback = getVoices().find((v) => v.lang?.toLowerCase().startsWith(lang.slice(0, 2)))
      if (fallback) u.voice = fallback
    }
    window.speechSynthesis.speak(u)
  } catch {
    /* ignore */
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel()
  } catch {
    /* ignore */
  }
}

/* --- tiny WebAudio blips, so games have feedback even without TTS --- */
let ctx = null
function audioCtx() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

export function blip(kind = 'tap', enabled = true) {
  if (!enabled) return
  const ac = audioCtx()
  if (!ac) return
  const tones = {
    tap: [520, 0.07, 'sine'],
    good: [740, 0.16, 'sine'],
    great: [980, 0.22, 'triangle'],
    wrong: [180, 0.22, 'sawtooth'],
    pop: [640, 0.09, 'square'],
  }
  const [freq, dur, type] = tones[kind] || tones.tap
  try {
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ac.currentTime)
    if (kind === 'good' || kind === 'great') {
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ac.currentTime + dur)
    }
    gain.gain.setValueAtTime(0.0001, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.16, ac.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur)
    osc.connect(gain).connect(ac.destination)
    osc.start()
    osc.stop(ac.currentTime + dur + 0.02)
  } catch {
    /* ignore */
  }
}
