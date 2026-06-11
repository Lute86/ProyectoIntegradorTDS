import StatItem from './StatItem'

export default function Stats({ items }) {
  if (!items || items.length === 0) return null

  return (
    <section className="py-12 bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 from-slate-100 via-white to-slate-100">
      <div className="max-w-content mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <StatItem key={item.id} valor={item.valor} label={item.label} delay={`${i * 100}ms`} />
          ))}
        </div>
      </div>
    </section>
  )
}
