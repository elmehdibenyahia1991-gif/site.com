'use client';

import { FormEvent, useState } from 'react';

export function ReviewForm({ productId }: { productId: string }) {
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        rating: Number(formData.get('rating')),
        comment: String(formData.get('comment') || '')
      })
    });

    const data = await response.json();
    setMessage(data.message || data.error || 'Done');
    if (response.ok) form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-xl border bg-white p-4">
      <h3 className="text-lg font-semibold">Leave a review</h3>
      <select name="rating" required className="w-full rounded border px-3 py-2">
        <option value="">Select rating</option>
        <option value="5">5 - Excellent</option>
        <option value="4">4 - Great</option>
        <option value="3">3 - Good</option>
        <option value="2">2 - Fair</option>
        <option value="1">1 - Poor</option>
      </select>
      <textarea name="comment" required placeholder="Share your experience" className="w-full rounded border px-3 py-2" />
      <button className="rounded bg-brand px-4 py-2 text-white">Submit review</button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
  );
}
