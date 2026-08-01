'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';
import { saveAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      saveAuth(data.token, data.userId, data.email, data.role);
      router.push('/');
      router.refresh();
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="canvas-cream"
      style={{
        minHeight: 'calc(100dvh - 57px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--sp-xxl) var(--sp-lg)',
      }}
    >
      <div
        className="card-pricing"
        data-aos="fade-up"
        style={{ width: '100%', maxWidth: '440px' }}
      >
        {/* Header */}
        <div style={{ marginBottom: 'var(--sp-xxl)' }}>
          <p className="type-eyebrow" style={{ color: 'var(--shade-50)', marginBottom: 'var(--sp-sm)' }}>
            Welcome back
          </p>
          <h1 className="type-display-md" style={{ fontSize: '40px' }}>
            Log in
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 'var(--rounded-md)',
              padding: 'var(--sp-md) var(--sp-lg)',
              marginBottom: 'var(--sp-lg)',
              fontSize: '14px',
              color: '#be123c',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
          <div>
            <label
              htmlFor="email"
              className="type-caption"
              style={{ display: 'block', marginBottom: 'var(--sp-xs)', color: 'var(--shade-60)', fontWeight: 500 }}
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="input-shopifi"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="type-caption"
              style={{ display: 'block', marginBottom: 'var(--sp-xs)', color: 'var(--shade-60)', fontWeight: 500 }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="input-shopifi"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-pill"
            style={{ width: '100%', marginTop: 'var(--sp-sm)' }}
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        {/* Footer */}
        <p
          className="type-caption"
          style={{ textAlign: 'center', marginTop: 'var(--sp-xl)', color: 'var(--shade-50)' }}
        >
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            style={{ color: 'var(--ink)', textDecoration: 'underline', fontWeight: 500 }}
          >
            Sign up free
          </Link>
        </p>

        {/* Demo credentials */}
        <div
          style={{
            marginTop: 'var(--sp-lg)',
            padding: 'var(--sp-md) var(--sp-lg)',
            background: 'var(--canvas-cream)',
            borderRadius: 'var(--rounded-md)',
            border: '1px solid var(--hairline-light)',
          }}
        >
          <p className="type-eyebrow" style={{ color: 'var(--shade-50)', marginBottom: '6px' }}>
            Demo credentials
          </p>
          <p className="type-caption" style={{ color: 'var(--shade-60)' }}>
            admin@ecommerce.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}