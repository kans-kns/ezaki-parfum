'use client';

import { FormEvent, useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      console.error('[Supabase Auth]', {
        message: signInError.message,
        code: signInError.code,
        status: signInError.status,
      });
      setError('Email ou mot de passe incorrect.');
      setLoading(false);
      return;
    }

    window.location.assign(searchParams.get('next') || '/admin');
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-gold/20 bg-ink-soft p-6 shadow-card sm:p-8"
      >
        <p className="eyebrow text-gold">EZAKI Administration</p>
        <h1 className="mt-3 font-display text-3xl text-cream">Connexion</h1>
        <p className="mt-2 text-sm text-cream/60">Accès réservé à l’équipe EZAKI.</p>

        <div className="mt-8 flex flex-col gap-4">
          <label className="text-sm text-cream/75">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gold/20 bg-ink px-3 py-3 text-cream outline-none focus:border-gold"
              autoComplete="email"
            />
          </label>
          <label className="text-sm text-cream/75">
            Mot de passe
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gold/20 bg-ink px-3 py-3 text-cream outline-none focus:border-gold"
              autoComplete="current-password"
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        {searchParams.get('error') === 'not-authorized' ? (
          <p className="mt-4 text-sm text-red-300">Ce compte n’a pas les droits administrateur.</p>
        ) : null}

        <button type="submit" disabled={loading} className="btn-gold mt-6 w-full px-4 py-3">
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-ink" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
