import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function AdminPage() {
  const [{ data: users }, { data: products }, { data: orders }] = await Promise.all([
    supabaseAdmin.from('users').select('id,email,role'),
    supabaseAdmin.from('products').select('id,title,price'),
    supabaseAdmin.from('orders').select('id,payment_status')
  ]);

  return (
    <section className="container-page space-y-5">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border bg-white p-4">Users: {users?.length ?? 0}</div>
        <div className="rounded border bg-white p-4">Products: {products?.length ?? 0}</div>
        <div className="rounded border bg-white p-4">Orders: {orders?.length ?? 0}</div>
      </div>
    </section>
  );
}
