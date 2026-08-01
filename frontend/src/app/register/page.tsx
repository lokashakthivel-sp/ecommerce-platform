'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';
import { saveAuth } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await register(form);
      saveAuth(data.token, data.userId, data.email, data.role);
      router.push('/');
      router.refresh();
    } catch {
      setError('Registration failed. Email may already be in use.');
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
        style={{ width: '100%', maxWidth: '480px' }}
      >
        {/* Header */}
        <div style={{ marginBottom: 'var(--sp-xxl)' }}>
          <p className="type-eyebrow" style={{ color: 'var(--shade-50)', marginBottom: 'var(--sp-sm)' }}>
            Get started
          </p>
          <h1 className="type-display-md" style={{ fontSize: '40px' }}>
            Create account
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
          {/* Name row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--sp-lg)',
            }}
          >
            <div>
              <label
                htmlFor="firstName"
                className="type-caption"
                style={{ display: 'block', marginBottom: 'var(--sp-xs)', color: 'var(--shade-60)', fontWeight: 500 }}
              >
                First name
              </label>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                required
                className="input-shopifi"
                placeholder="Jane"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="type-caption"
                style={{ display: 'block', marginBottom: 'var(--sp-xs)', color: 'var(--shade-60)', fontWeight: 500 }}
              >
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                required
                className="input-shopifi"
                placeholder="Doe"
              />
            </div>
          </div>

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
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="input-shopifi"
              placeholder="you@example.com"
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
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="input-shopifi"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-aloe-pill"
            style={{ width: '100%', marginTop: 'var(--sp-sm)' }}
          >
            {loading ? 'Creating account…' : 'Start for free'}
          </button>
        </form>

        <p
          className="type-caption"
          style={{ textAlign: 'center', marginTop: 'var(--sp-xl)', color: 'var(--shade-50)' }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            style={{ color: 'var(--ink)', textDecoration: 'underline', fontWeight: 500 }}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}