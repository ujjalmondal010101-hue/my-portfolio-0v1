import { useEffect } from 'react'

// Adds the "reveal-in" class to every .reveal element as it scrolls
// into view. Re-runs whenever a page mounts.
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    if (!els.length) return

    const motionOff = document.documentElement.classList.contains('motion-off')

    if (!('IntersectionObserver' in window) || motionOff) {
      els.forEach((el) => el.classList.add('reveal-in'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
