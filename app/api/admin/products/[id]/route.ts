import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabaseAdmin.from('users').select('role').eq('id', auth.user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { error } = await supabaseAdmin.from('products').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: 'Product removed' });
}
