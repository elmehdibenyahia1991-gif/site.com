import { ProductCard } from '@/components/product-card';
import { createServerSupabase } from '@/lib/supabase-server';

export default async function MarketplacePage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const supabase = createServerSupabase();
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });

  if (searchParams?.q) query = query.ilike('title', `%${searchParams.q}%`);
  if (searchParams?.category) query = query.eq('category', searchParams.category);

  const { data: products } = await query;
  const best = [...(products ?? [])].sort((a, b) => (b.sales_count ?? 0) - (a.sales_count ?? 0)).slice(0, 4);

  return (
    <section className="container-page space-y-6">
      <h1 className="text-3xl font-bold">Marketplace</h1>
      <form className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
        <input name="q" placeholder="Search products" className="rounded border px-3 py-2" />
        <select name="category" className="rounded border px-3 py-2">
          <option value="">All categories</option><option>Prompts</option><option>Templates</option><option>eBooks</option><option>Tools</option>
        </select>
        <button className="rounded bg-brand px-4 py-2 text-white">Filter</button>
      </form>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">Affordable pricing suggestions</p>
        <p>Prompts $3 · Templates $5 · eBooks $7 · Tools $10 · Offer bundles for extra savings.</p>
      </div>

      <div>
        <h2 className="mb-3 text-xl font-semibold">Best Selling</h2>
        <div className="grid gap-4 md:grid-cols-4">{best.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">{(products ?? []).map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </section>
  );
}
