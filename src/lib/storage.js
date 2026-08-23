const NS = 'kidspace:'

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value))
  } catch {
    /* private mode / quota — demo degrades gracefully */
  }
}

export function clearAll() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(NS))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}
