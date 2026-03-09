'use client';

import { useState } from 'react';

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState('');

  async function buy() {
    const create = await fetch('/api/paypal/create-order', { method: 'POST', body: JSON.stringify({ productId: params.id }) });
    const { id, error } = await create.json();
    if (error) return setStatus(error);
    const capture = await fetch('/api/paypal/capture-order', { method: 'POST', body: JSON.stringify({ orderId: id, productId: params.id }) });
    const payload = await capture.json();
    setStatus(payload.message || payload.error);
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
