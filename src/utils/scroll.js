// Smooth-scroll to an in-page section. If we are on a game page,
// go back to the home page first, then scroll to the section.
export function goToSection(navigate, href) {
  const hash = window.location.hash
  if (hash === '#/' || hash === '' || hash === '#') {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  navigate('/')
  setTimeout(() => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }, 180)
}
