import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  const { data: paidOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('product_id', body.productId)
    .eq('buyer_id', auth.user.id)
    .eq('payment_status', 'paid')
    .maybeSingle();

  if (!paidOrder) {
    return NextResponse.json({ error: 'Only verified buyers can leave reviews' }, { status: 403 });
  }

  const { error } = await supabase.from('reviews').insert({
    product_id: body.productId,
    user_id: auth.user.id,
    rating: body.rating,
    comment: body.comment
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: 'Review submitted' });
}
