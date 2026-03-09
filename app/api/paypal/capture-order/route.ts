import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { createServerSupabase } from '@/lib/supabase-server';
import { paypalClient } from '@/lib/paypal';

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { orderId, productId } = await req.json();
  const capture = new paypal.orders.OrdersCaptureRequest(orderId);
  capture.requestBody({});

  const response = await paypalClient.execute(capture);
  if (response.result.status !== 'COMPLETED') return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });

  const { data: product } = await supabase.from('products').select('seller_id').eq('id', productId).single();
  await supabase.from('orders').insert({
    product_id: productId,
    buyer_id: auth.user.id,
    seller_id: product?.seller_id,
    payment_status: 'paid',
    payment_method: 'paypal',
    paypal_order_id: orderId
  });

  return NextResponse.json({ message: 'Payment successful. You can now download your file.' });
}
