/**
 * Bolt the robot — 3 worlds × 12 levels.
 * Levels are generated deterministically from the level index: a monotone
 * path from start to goal is drawn first, then walls are scattered on cells
 * that are not on that path, so every generated level is guaranteed solvable.
 */

export const WORLDS = [
  {
    id: 'yard',
    th: 'สวนหลังบ้าน',
    en: 'Back garden',
    emoji: '🌳',
    tone: 'mint',
    wall: '🌳',
    goal: '🏠',
    floor: '#eaf6ee',
  },
  {
    id: 'beach',
    th: 'ชายหาด',
    en: 'The beach',
    emoji: '🏖️',
    tone: 'butter',
    wall: '🌴',
    goal: '⛵',
    floor: '#fff6e0',
  },
  {
    id: 'space',
    th: 'อวกาศ',
    en: 'Outer space',
    emoji: '🌌',
    tone: 'lilac',
    wall: '☄️',
    goal: '🛸',
    floor: '#f3ecfd',
  },
]

/* Small deterministic PRNG so a level always looks the same. */
function rng(seed) {
  let s = seed * 9301 + 49297
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function buildLevel(worldIndex, levelIndex) {
  const n = worldIndex * 12 + levelIndex
  const size = levelIndex < 4 ? 4 : levelIndex < 8 ? 5 : 6
  const rand = rng(n + 7)

  const start = { x: 0, y: size - 1 }
  const goal = { x: size - 1, y: 0 }

  // monotone path: only right and up
  const path = [{ ...start }]
  let cur = { ...start }
  while (cur.x !== goal.x || cur.y !== goal.y) {
    const canRight = cur.x < goal.x
    const canUp = cur.y > goal.y
    const goRight = canRight && (!canUp || rand() < 0.5)
    cur = goRight ? { x: cur.x + 1, y: cur.y } : { x: cur.x, y: cur.y - 1 }
    path.push({ ...cur })
  }
  const onPath = new Set(path.map((p) => `${p.x},${p.y}`))

  const wallBudget = Math.min(size + levelIndex, size * size - path.length - 2)
  const walls = []
  let guard = 0
  while (walls.length < wallBudget && guard < 200) {
    guard += 1
    const x = Math.floor(rand() * size)
    const y = Math.floor(rand() * size)
    const key = `${x},${y}`
    if (onPath.has(key) || walls.some((w) => w.x === x && w.y === y)) continue
    walls.push({ x, y })
  }

  // a collectible star sitting on the intended path (never the endpoints)
  const mid = path[Math.floor(path.length / 2)]
  const star = path.length > 3 ? { x: mid.x, y: mid.y } : null

  return { size, start, goal, walls, star, par: path.length - 1, loopAllowed: levelIndex >= 4 }
}
