import { Navigate } from 'react-router-dom'
import { useSiteConfigStore } from '../stores/siteConfigStore'

export default function SectionGuard({ sectionId, children }) {
  const { config } = useSiteConfigStore()
  const section = config.sections.find((s) => s.id === sectionId)
  if (!section?.visible) return <Navigate to="/" replace />
  return children
}
