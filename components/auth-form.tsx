'use client';

import { FormEvent, useState } from 'react';
import { createClientSupabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const supabase = createClientSupabase();
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(result.error.message);
      return;
    }
    router.push('/dashboard/seller');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-white p-6">
      <input name="email" type="email" required placeholder="Email" className="w-full rounded border px-3 py-2" />
      <input name="password" type="password" required placeholder="Password" className="w-full rounded border px-3 py-2" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="w-full rounded bg-brand py-2 text-white">{mode === 'signup' ? 'Create account' : 'Login'}</button>
    </form>
  );
}
