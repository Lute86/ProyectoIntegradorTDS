export default function TestimonialSlide({ testimonio }) {
  const { texto, autor_nombre, autor_carrera, iniciales } = testimonio

  return (
    <div className="text-center px-4">
      <p className="text-lg text-slate-700 italic mb-6 leading-relaxed">
        &ldquo;{texto}&rdquo;
      </p>
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
          {iniciales}
        </div>
        <div className="text-left">
          <h4 className="font-semibold text-slate-900 text-sm">{autor_nombre}</h4>
          <p className="text-xs text-slate-500">{autor_carrera}</p>
        </div>
      </div>
    </div>
  )
}
