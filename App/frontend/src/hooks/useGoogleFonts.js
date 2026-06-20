import { useEffect, useRef } from 'react'
import { useSiteConfigStore } from '../stores/siteConfigStore'

export default function useGoogleFonts() {
  const { config } = useSiteConfigStore()
  const linkRef = useRef(null)

  useEffect(() => {
    const fonts = [
      config.typography.headingFont,
      config.typography.bodyFont,
    ].filter(Boolean)

    const unique = [...new Set(fonts)]
    if (unique.length === 0) return

    const family = unique
      .map((f) => `family=${f.replace(/\s+/g, '+')}:wght@400;500;600;700`)
      .join('&')

    const href = `https://fonts.googleapis.com/css2?${family}&display=swap`

    if (linkRef.current) {
      linkRef.current.href = href
    } else {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
      linkRef.current = link
    }
  }, [config.typography.headingFont, config.typography.bodyFont])
}
