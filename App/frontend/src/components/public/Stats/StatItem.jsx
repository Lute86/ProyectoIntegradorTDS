export default function StatItem({ valor, label }) {
  return (
    <div className="text-center">
      <h3 className="text-3xl md:text-4xl font-bold text-blue-600">{valor}</h3>
      <p className="text-slate-600 mt-1">{label}</p>
    </div>
  )
}
