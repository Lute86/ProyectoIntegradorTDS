import StatItem from './StatItem'

export default function Stats({ items }) {
  if (!items || items.length === 0) return null

  return (
    <section className="py-12">
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
