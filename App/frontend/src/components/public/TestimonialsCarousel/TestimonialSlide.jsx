export default function TestimonialSlide({ testimonio }) {
  const { texto, autor_nombre, autor_carrera, iniciales } = testimonio
  const avatar = iniciales || (autor_nombre ? autor_nombre.trim().slice(0, 2).toUpperCase() : '?')

  return (
    <div className="relative bg-white dark:bg-white/[0.06] rounded-3xl border border-slate-200/70 dark:border-white/10 shadow-lg px-8 py-10 text-center backdrop-blur-sm overflow-hidden">
      {/* Comilla decorativa */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-4 left-6 text-[7rem] leading-none font-serif text-[var(--color-primary)]/10 dark:text-white/10 select-none"
      >
        &ldquo;
      </span>

      <p className="relative text-lg md:text-xl text-body dark:text-white/85 italic mb-8 leading-relaxed">
        {texto}
      </p>

      <div className="relative flex flex-col items-center gap-2">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full text-white font-bold text-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-md">
          {avatar}
        </span>
        <div>
          <h4 className="font-semibold text-body dark:text-white text-sm">{autor_nombre}</h4>
          <p className="text-xs text-body/60 dark:text-white/60">{autor_carrera}</p>
        </div>
      </div>
    </div>
  )
}
