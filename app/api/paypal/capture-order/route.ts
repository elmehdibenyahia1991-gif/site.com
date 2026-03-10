import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { capturePayPalOrder } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { orderId, productId } = await req.json();
    const response = await capturePayPalOrder(orderId);

    if (response.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const { data: product } = await supabase.from('products').select('seller_id,sales_count').eq('id', productId).single();
    const insert = await supabase.from('orders').insert({
      product_id: productId,
      buyer_id: auth.user.id,
      seller_id: product?.seller_id,
      payment_status: 'paid',
      payment_method: 'paypal',
      paypal_order_id: orderId
    });

    if (insert.error && !insert.error.message.includes('duplicate')) {
      return NextResponse.json({ error: insert.error.message }, { status: 400 });
    }

    await supabase.from('products').update({ sales_count: (product?.sales_count ?? 0) + 1 }).eq('id', productId);

    return NextResponse.json({ message: 'Payment successful. You can now download your file.' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Unable to capture order' }, { status: 500 });
  }
}
