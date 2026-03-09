import Link from 'next/link';

const tiers = [
  { label: 'Prompts', price: '$3' },
  { label: 'Templates', price: '$5' },
  { label: 'eBooks', price: '$7' },
  { label: 'Tools', price: '$10' }
];

export default function HomePage() {
  return (
    <section className="container-page space-y-8">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-10 text-white">
        <h1 className="text-4xl font-bold">Affordable Digital Products Marketplace</h1>
        <p className="mt-3 max-w-2xl text-indigo-100">Buy trusted resources. Sell globally. TrustMarket combines low pricing, secure checkout, and transparent policies.</p>
        <div className="mt-6 flex gap-3">
          <Link className="rounded bg-white px-4 py-2 font-semibold text-indigo-700" href="/marketplace">Explore Marketplace</Link>
          <Link className="rounded border border-white px-4 py-2" href="/signup">Become a Creator</Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold">Affordable Pricing Strategy</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {tiers.map((tier) => (
            <div key={tier.label} className="rounded-xl border bg-white p-4 text-center shadow-sm">
              <p className="text-slate-600">{tier.label}</p>
              <p className="text-2xl font-bold text-brand">{tier.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
