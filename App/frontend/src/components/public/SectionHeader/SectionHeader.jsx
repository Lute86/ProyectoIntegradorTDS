import CareerIcon from '../../ui/CareerIcon/CareerIcon'

/**
 * Encabezado de seccion reutilizable para la home.
 * Reemplaza el patron repetido "h2 con gradiente + parrafo de relleno"
 * por un eyebrow compacto + titulo + linea de acento.
 */
export default function SectionHeader({ eyebrow, icon, title, subtitle }) {
  return (
    <div className="text-center mb-12">
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/15 dark:bg-white/10 dark:text-blue-300 dark:ring-white/10">
          {icon && <CareerIcon name={icon} className="w-3.5 h-3.5 [&_svg]:fill-current" />}
          {eyebrow}
        </span>
      )}
      <h2 className="text-h2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent drop-shadow-sm">
        {title}
      </h2>
      {subtitle && (
        <p className="text-body/60 dark:text-white/60 mt-2 max-w-md mx-auto text-sm">{subtitle}</p>
      )}
      <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />
    </div>
  )
}
