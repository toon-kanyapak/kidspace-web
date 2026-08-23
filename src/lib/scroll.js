/** Scrolls back to the top of the current screen. */
export function scrollScreenTop(smooth = true) {
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
}
