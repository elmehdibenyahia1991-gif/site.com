'use client';

import { useState } from 'react';

export default function CheckoutPage({ params, searchParams }: { params: { id: string }; searchParams?: { cancelled?: string } }) {
  const [status, setStatus] = useState(searchParams?.cancelled ? 'Payment cancelled.' : '');

  async function buy() {
    setStatus('Creating PayPal order...');
    const create = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: params.id })
    });

    const payload = await create.json();
    if (!create.ok || payload.error) return setStatus(payload.error || 'Unable to start checkout');
    window.location.href = payload.approveUrl;
  }

  return (
    <section className="container-page max-w-xl">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-2 text-slate-600">Secure PayPal checkout for digital delivery.</p>
      <button onClick={buy} className="mt-4 rounded bg-brand px-4 py-2 text-white">Pay with PayPal</button>
      {status && <p className="mt-3 text-sm">{status}</p>}
    </section>
  );
}
