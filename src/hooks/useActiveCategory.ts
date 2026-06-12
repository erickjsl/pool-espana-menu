import { useEffect, useState } from 'react'

type QuickLink = {
  label: string
  href: string
}

export function useActiveCategory(links: QuickLink[]) {
  const [activeCategory, setActiveCategory] = useState(links[0]?.href ?? '')

  useEffect(() => {
    const sections = links
      .map((link) => {
        const id = link.href.slice(1)
        const element = document.getElementById(id)

        return element ? { href: link.href, element } : null
      })
      .filter((section): section is { href: string; element: HTMLElement } => section !== null)

    if (!sections.length) {
      return
    }

    const navElement = document.querySelector('.category-nav')

    const syncActiveCategory = () => {
      const navHeight = navElement instanceof HTMLElement ? navElement.offsetHeight : 0
      const activationLine = navHeight + 24
      const firstSectionTop = sections[0].element.getBoundingClientRect().top

      if (firstSectionTop > activationLine) {
        setActiveCategory(sections[0].href)
        return
      }

      let nextActiveCategory = sections[0].href

      for (const section of sections) {
        if (section.element.getBoundingClientRect().top <= activationLine) {
          nextActiveCategory = section.href
        }
      }

      setActiveCategory(nextActiveCategory)
    }

    syncActiveCategory()

    window.addEventListener('scroll', syncActiveCategory, { passive: true })
    window.addEventListener('resize', syncActiveCategory)

    return () => {
      window.removeEventListener('scroll', syncActiveCategory)
      window.removeEventListener('resize', syncActiveCategory)
    }
  }, [links])

  return { activeCategory, setActiveCategory }
}
