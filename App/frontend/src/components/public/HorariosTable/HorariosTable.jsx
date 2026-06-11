export default function HorariosTable({ horarios }) {
  if (!horarios || horarios.length === 0) {
    return     <p className="text-body/70 dark:text-white/50 text-sm">No hay horarios disponibles.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface text-white">
            <th className="p-3 text-left text-sm font-semibold">Dia</th>
            <th className="p-3 text-left text-sm font-semibold">Horario</th>
            <th className="p-3 text-left text-sm font-semibold">Aula</th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((h, i) => (
            <tr key={i} className="border-b border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
              <td className="p-3 text-sm text-body dark:text-white">{h.dia}</td>
              <td className="p-3 text-sm text-body dark:text-white/70">{h.horario}</td>
              <td className="p-3 text-sm text-body dark:text-white/70">{h.aula}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
