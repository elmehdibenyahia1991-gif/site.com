import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabaseAdmin.from('users').select('role').eq('id', auth.user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [{ data: users }, { data: products }, { data: orders }] = await Promise.all([
    supabaseAdmin.from('users').select('id,email,role').order('created_at', { ascending: false }),
    supabaseAdmin.from('products').select('id,title,price').order('created_at', { ascending: false }),
    supabaseAdmin.from('orders').select('id,payment_status').order('created_at', { ascending: false })
  ]);

  return NextResponse.json({ users: users ?? [], products: products ?? [], orders: orders ?? [] });
}
