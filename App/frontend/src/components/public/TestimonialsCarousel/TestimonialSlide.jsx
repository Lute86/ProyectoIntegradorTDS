export default function TestimonialSlide({ testimonio }) {
  const { texto, autor_nombre, autor_carrera } = testimonio

  return (
    <div className="text-center px-4">
      <p className="text-lg text-body dark:text-white/80 italic mb-6 leading-relaxed">
        &ldquo;{texto}&rdquo;
      </p>
      <div className="text-center">
        <h4 className="font-semibold text-body dark:text-white text-sm">{autor_nombre}</h4>
        <p className="text-xs text-body/70 dark:text-white/70">{autor_carrera}</p>
      </div>
    </div>
  )
}
