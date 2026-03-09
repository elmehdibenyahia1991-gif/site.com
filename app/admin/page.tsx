'use client';

import { useEffect, useState } from 'react';
import { createClientSupabase } from '@/lib/supabase-client';

type UserRow = { id: string; email: string; role: string };
type ProductRow = { id: string; title: string; price: number };
type OrderRow = { id: string; payment_status: string };

export default function AdminPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [message, setMessage] = useState('');

  async function load() {
    const supabase = createClientSupabase();
    const [{ data: usersData }, { data: productsData }, { data: ordersData }] = await Promise.all([
      supabase.from('users').select('id,email,role'),
      supabase.from('products').select('id,title,price').order('created_at', { ascending: false }),
      supabase.from('orders').select('id,payment_status')
    ]);

    setUsers(usersData ?? []);
    setProducts(productsData ?? []);
    setOrders(ordersData ?? []);
  }

  useEffect(() => { load(); }, []);

  async function removeProduct(id: string) {
    const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    const data = await response.json();
    setMessage(data.message || data.error || 'Done');
    if (response.ok) load();
  }

  return (
    <section className="container-page space-y-5">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border bg-white p-4">Users: {users.length}</div>
        <div className="rounded border bg-white p-4">Products: {products.length}</div>
        <div className="rounded border bg-white p-4">Orders: {orders.length}</div>
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-3 text-xl font-semibold">Users</h2>
        <div className="space-y-1 text-sm">
          {users.map((u) => <p key={u.id}>{u.email} · {u.role}</p>)}
        </div>
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-3 text-xl font-semibold">Products</h2>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded border p-2">
              <span>{p.title} (${p.price.toFixed(2)})</span>
              <button onClick={() => removeProduct(p.id)} className="rounded border px-2 py-1 text-sm">Remove</button>
            </div>
          ))}
        </div>
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </section>
  );
}
