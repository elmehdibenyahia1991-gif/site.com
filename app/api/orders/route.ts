import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET() {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase.from('orders').select('*').eq('buyer_id', auth.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
