import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { productId } = await req.json();
  const { data: order } = await supabase
    .from('orders')
    .select('id')
    .eq('product_id', productId)
    .eq('buyer_id', auth.user.id)
    .eq('payment_status', 'paid')
    .maybeSingle();

  if (!order) return NextResponse.json({ error: 'Purchase required' }, { status: 403 });

  const { data: product } = await supabase.from('products').select('file_url').eq('id', productId).single();
  if (!product?.file_url) return NextResponse.json({ error: 'File not found' }, { status: 404 });

  const { data, error } = await supabase.storage.from('products').createSignedUrl(product.file_url, 60);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ url: data?.signedUrl });
}
