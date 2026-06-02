import { useEffect, useRef } from 'react'
import { useSiteConfigStore } from '../stores/siteConfigStore'

export default function useThemeStyles() {
  const { config } = useSiteConfigStore()
  const styleRef = useRef(null)

  useEffect(() => {
    const css = `
:root {
  --clr-primary: ${config.colors.primary};
  --clr-secondary: ${config.colors.secondary};
  --clr-accent: ${config.colors.accent};
  --clr-surface: ${config.colors.surface};
  --clr-bg: ${config.colors.background};
  --clr-text: ${config.colors.text};
  --font-heading: ${config.typography.headingFont};
  --font-body: ${config.typography.bodyFont};
  --font-base-size: ${config.typography.baseSize};
}
`
    if (styleRef.current) {
      styleRef.current.textContent = css
    } else {
      const style = document.createElement('style')
      style.id = 'theme-styles'
      style.textContent = css
      document.head.appendChild(style)
      styleRef.current = style
    }
  }, [config])
}
