'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClientSupabase } from '@/lib/supabase-client';
import { Product } from '@/lib/types';

export default function SellerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState(0);
  const [message, setMessage] = useState('');

  async function load() {
    const supabase = createClientSupabase();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const [{ data: myProducts }, { data: myOrders }] = await Promise.all([
      supabase.from('products').select('*').eq('seller_id', auth.user.id),
      supabase.from('orders').select('id').eq('seller_id', auth.user.id)
    ]);

    setProducts(myProducts ?? []);
    setSales(myOrders?.length ?? 0);
  }

  useEffect(() => { load(); }, []);

  const revenue = products.reduce((acc, p) => acc + ((p.sales_count ?? 0) * p.price), 0);

  async function removeProduct(id: string) {
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const data = await response.json();
    setMessage(data.message || data.error || 'Done');
    if (response.ok) load();
  }

  return (
    <section className="container-page space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <Link className="rounded bg-brand px-4 py-2 text-white" href="/dashboard/seller/upload">Upload product</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border bg-white p-4">Products: {products.length}</div>
        <div className="rounded border bg-white p-4">Sales: {sales}</div>
        <div className="rounded border bg-white p-4">Revenue: ${revenue.toFixed(2)}</div>
      </div>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded border bg-white p-3">
            <span>{p.title} · ${p.price.toFixed(2)}</span>
            <div className="space-x-2">
              <button onClick={() => removeProduct(p.id)} className="rounded border px-3 py-1 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </section>
  );
}
