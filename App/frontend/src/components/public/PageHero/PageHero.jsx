/**
 * Banner de cabecera para las paginas publicas internas.
 * Unifica el patron que cada pagina repetia inline y aplica el mismo
 * lenguaje visual que el Hero de la home: overlay con gradiente + tinte
 * de marca, acentos difuminados y un eyebrow opcional.
 */
export default function PageHero({ eyebrow, title, subtitle, image }) {
  return (
    <div
      className="relative bg-gradient-to-br from-slate-900 to-blue-700 bg-cover bg-center text-white min-h-[260px] md:min-h-[340px] flex items-center overflow-hidden"
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      {/* Overlay con gradiente + tinte de marca (reemplaza el negro plano) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/55 to-slate-950/75" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/30 via-transparent to-[var(--color-secondary)]/20 mix-blend-multiply" />

      {/* Acentos decorativos difuminados */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[var(--color-primary)]/25 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 w-96 h-96 rounded-full bg-[var(--color-secondary)]/20 blur-3xl animate-float delay-300" />

      <div className="relative z-10 max-w-content mx-auto px-4 py-16 md:py-20 text-center">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] bg-white/10 ring-1 ring-white/25 backdrop-blur-sm animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse-glow" />
            {eyebrow}
          </span>
        )}
        <h1 className="text-h1 text-white animate-fade-in-up delay-75 text-shadow-hero text-balance">{title}</h1>
        {subtitle && (
          <p className="text-white/90 text-lg md:text-xl mt-3 animate-fade-in-up delay-150 text-balance">{subtitle}</p>
        )}
        <div className="mx-auto mt-6 h-1 w-14 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] animate-fade-in-up delay-300" />
      </div>
    </div>
  )
}
