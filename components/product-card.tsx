import Link from 'next/link';
import { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <img src={product.cover_image || 'https://placehold.co/600x400'} alt={product.title} className="h-40 w-full rounded-md object-cover" />
      <p className="mt-3 text-xs uppercase text-slate-500">{product.category}</p>
      <h3 className="text-lg font-semibold">{product.title}</h3>
      <p className="mt-1 font-bold text-brand">${product.price.toFixed(2)}</p>
      {product.bundle_price ? (
        <p className="text-xs text-emerald-700">Bundle: ${product.bundle_price.toFixed(2)} {product.bundle_label ? `· ${product.bundle_label}` : ''}</p>
      ) : null}
      <Link href={`/product/${product.id}`} className="mt-3 inline-block rounded bg-brand px-3 py-2 text-sm text-white">View</Link>
    </article>
  );
}
