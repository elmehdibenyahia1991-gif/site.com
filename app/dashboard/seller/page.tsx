import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';

export default async function SellerDashboardPage() {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) return <section className="container-page">Please login.</section>;

  const { data: products } = await supabase.from('products').select('*').eq('seller_id', auth.user.id);
  const { data: orders } = await supabase.from('orders').select('id,product_id').eq('seller_id', auth.user.id);

  const revenue = (products ?? []).reduce((acc, p) => acc + ((p.sales_count ?? 0) * p.price), 0);

  return (
    <section className="container-page space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <Link className="rounded bg-brand px-4 py-2 text-white" href="/dashboard/seller/upload">Upload product</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border bg-white p-4">Products: {(products ?? []).length}</div>
        <div className="rounded border bg-white p-4">Sales: {(orders ?? []).length}</div>
        <div className="rounded border bg-white p-4">Revenue: ${revenue.toFixed(2)}</div>
      </div>
      <div className="space-y-2">
        {(products ?? []).map((p) => <div key={p.id} className="rounded border bg-white p-3 flex justify-between"><span>{p.title}</span><span>${p.price}</span></div>)}
      </div>
    </section>
  );
}
