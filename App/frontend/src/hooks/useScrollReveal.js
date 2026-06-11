import { useRef, useState, useEffect } from 'react'

export default function useScrollReveal() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setIsVisible(false)

    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
