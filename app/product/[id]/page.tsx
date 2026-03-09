import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { ReviewForm } from '@/components/review-form';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase();
  const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single();
  const { data: reviews } = await supabase.from('reviews').select('*').eq('product_id', params.id).order('created_at', { ascending: false });

  if (!product) return <section className="container-page">Product not found</section>;

  const avg = reviews?.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

  return (
    <section className="container-page grid gap-8 md:grid-cols-2">
      <img src={product.cover_image || 'https://placehold.co/800x500'} alt={product.title} className="w-full rounded-xl object-cover" />
      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="mt-2 text-slate-600">{product.description}</p>
        <p className="mt-4 text-2xl font-bold text-brand">${product.price.toFixed(2)}</p>
        {product.bundle_price ? <p className="mt-1 text-sm text-emerald-700">Bundle offer: ${product.bundle_price.toFixed(2)} {product.bundle_label ? `(${product.bundle_label})` : ''}</p> : null}
        <p className="mt-2 text-sm">Average rating: {avg.toFixed(1)} ⭐ ({reviews?.length ?? 0} reviews)</p>
        <Link href={`/checkout/${product.id}`} className="mt-5 inline-block rounded bg-brand px-4 py-2 text-white">Buy now</Link>

        <ReviewForm productId={product.id} />

        <div className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Reviews</h2>
          {reviews?.map((r) => (
            <article key={r.id} className="rounded border bg-white p-3">
              <p>{'⭐'.repeat(r.rating)}</p>
              <p className="text-sm text-slate-700">{r.comment}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
