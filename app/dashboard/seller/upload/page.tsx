'use client';

import { FormEvent, useState } from 'react';

export default function UploadProductPage() {
  const [msg, setMsg] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/products', { method: 'POST', body: formData });
    const json = await res.json();
    setMsg(json.message || json.error || 'Done');
  }

  return (
    <section className="container-page max-w-xl">
      <h1 className="mb-4 text-2xl font-bold">Upload Product</h1>
      <form onSubmit={submit} className="space-y-3 rounded border bg-white p-5">
        <input name="title" required placeholder="Title" className="w-full rounded border px-3 py-2" />
        <textarea name="description" required placeholder="Description" className="w-full rounded border px-3 py-2" />
        <input name="price" type="number" step="0.01" required placeholder="Price" className="w-full rounded border px-3 py-2" />
        <select name="category" className="w-full rounded border px-3 py-2"><option>Prompts</option><option>Templates</option><option>eBooks</option><option>Tools</option></select>
        <input name="coverImage" type="url" placeholder="Cover image URL" className="w-full rounded border px-3 py-2" />
        <input name="file" type="file" required className="w-full" />
        <button className="rounded bg-brand px-4 py-2 text-white">Create</button>
      </form>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </section>
  );
}
