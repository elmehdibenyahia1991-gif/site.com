import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { paypalClient } from '@/lib/paypal';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { productId } = await req.json();
  const { data: product } = await supabaseAdmin.from('products').select('id,price,title').eq('id', productId).single();
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: product.id,
      description: product.title,
      amount: { currency_code: 'USD', value: product.price.toFixed(2) }
    }],
    application_context: {
      return_url: `${siteUrl}/checkout/${product.id}/success`,
      cancel_url: `${siteUrl}/checkout/${product.id}?cancelled=true`,
      user_action: 'PAY_NOW'
    }
  });

  const response = await paypalClient.execute(request);
  const approve = response.result.links?.find((link: { rel: string }) => link.rel === 'approve');
  return NextResponse.json({ id: response.result.id, approveUrl: approve?.href });
}
