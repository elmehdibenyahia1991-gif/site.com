import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { paypalClient } from '@/lib/paypal';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  const { productId } = await req.json();
  const { data: product } = await supabaseAdmin.from('products').select('id,price,title').eq('id', productId).single();
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: product.id,
      description: product.title,
      amount: { currency_code: 'USD', value: product.price.toFixed(2) }
    }]
  });

  const response = await paypalClient.execute(request);
  return NextResponse.json({ id: response.result.id });
}
