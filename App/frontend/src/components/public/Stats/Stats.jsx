import StatItem from './StatItem'

export default function Stats({ items }) {
  if (!items || items.length === 0) return null

  return (
    <section className="py-12 bg-white">
      <div className="max-w-content mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-8">
          {items.map((item) => (
            <StatItem key={item.id} valor={item.valor} label={item.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
