import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-admin';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    const supabaseAdmin = createSupabaseAdmin();
    const { data: product } = await supabaseAdmin.from('products').select('id,price,title').eq('id', productId).single();
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await createPayPalOrder({
      productId: product.id,
      title: product.title,
      price: Number(product.price),
      returnUrl: `${siteUrl}/checkout/${product.id}/success`,
      cancelUrl: `${siteUrl}/checkout/${product.id}?cancelled=true`
    });

    const approve = response.links?.find((link: { rel: string; href: string }) => link.rel === 'approve');
    return NextResponse.json({ id: response.id, approveUrl: approve?.href });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Unable to create order' }, { status: 500 });
  }
}
