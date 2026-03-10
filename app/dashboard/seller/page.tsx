'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { createClientSupabase } from '@/lib/supabase-client';
import { Product } from '@/lib/types';

type EditingState = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  cover_image?: string;
};

export default function SellerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState(0);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState<EditingState | null>(null);

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

  useEffect(() => {
    load();
  }, []);

  const revenue = products.reduce((acc, p) => acc + (p.sales_count ?? 0) * p.price, 0);

  async function removeProduct(id: string) {
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const data = await response.json();
    setMessage(data.message || data.error || 'Done');
    if (response.ok) load();
  }

  async function updateProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;

    const response = await fetch(`/api/products/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editing.title,
        description: editing.description,
        price: editing.price,
        category: editing.category,
        cover_image: editing.cover_image || null
      })
    });

    const data = await response.json();
    setMessage(data.message || data.error || 'Done');
    if (response.ok) {
      setEditing(null);
      load();
    }
  }

  return (
    <section className="container-page space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <Link className="rounded bg-brand px-4 py-2 text-white" href="/dashboard/seller/upload">
          Upload product
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border bg-white p-4">Products: {products.length}</div>
        <div className="rounded border bg-white p-4">Sales: {sales}</div>
        <div className="rounded border bg-white p-4">Revenue: ${revenue.toFixed(2)}</div>
      </div>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded border bg-white p-3">
            <span>
              {p.title} · ${p.price.toFixed(2)}
            </span>
            <div className="space-x-2">
              <button
                onClick={() =>
                  setEditing({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    price: p.price,
                    category: p.category,
                    cover_image: p.cover_image || ''
                  })
                }
                className="rounded border px-3 py-1 text-sm"
              >
                Edit
              </button>
              <button onClick={() => removeProduct(p.id)} className="rounded border px-3 py-1 text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <form onSubmit={updateProduct} className="space-y-3 rounded-xl border bg-white p-4">
          <h2 className="text-lg font-semibold">Edit product</h2>
          <input
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            className="w-full rounded border px-3 py-2"
          />
          <textarea
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="number"
            step="0.01"
            value={editing.price}
            onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
            className="w-full rounded border px-3 py-2"
          />
          <input
            value={editing.category}
            onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            className="w-full rounded border px-3 py-2"
          />
          <input
            value={editing.cover_image || ''}
            onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
            placeholder="Cover image URL"
            className="w-full rounded border px-3 py-2"
          />
          <div className="space-x-2">
            <button className="rounded bg-brand px-4 py-2 text-white">Save</button>
            <button type="button" onClick={() => setEditing(null)} className="rounded border px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {message && <p className="text-sm text-slate-600">{message}</p>}
    </section>
  );
}
