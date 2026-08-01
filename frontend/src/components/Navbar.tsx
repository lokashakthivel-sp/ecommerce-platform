'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, logout } from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  // Re-sync auth state on every route change (handles post-login refresh)
  useEffect(() => {
    const auth = getAuth();
    setEmail(auth?.email || null);
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setEmail(null);
    setMenuOpen(false);
    router.push('/login');
  };

  return (
    <>
      {/* ── Desktop / top nav — dark track ── */}
      <nav
        style={{
          background: 'var(--canvas-night)',
          color: 'var(--on-dark)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid var(--hairline-dark)',
        }}
      >
        <div
          className="container-shopifi"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'var(--sp-lg)',
            paddingBottom: 'var(--sp-lg)',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              color: 'var(--on-dark)',
              textDecoration: 'none',
              fontFamily: "'Inter', sans-serif",
              fontSize: '20px',
              fontWeight: 500,
              letterSpacing: '0.3px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '22px' }}>◆</span>
            <span>Shopifi</span>
          </Link>

          {/* Desktop links */}
          <div
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-xl)',
            }}
          >
            <Link
              href="/products"
              style={{
                color: 'var(--on-dark)',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 420,
                opacity: 0.75,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}
            >
              Products
            </Link>

            {email ? (
              <>
                <Link
                  href="/cart"
                  style={{
                    color: 'var(--on-dark)',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: 420,
                    opacity: 0.75,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}
                >
                  Cart
                </Link>
                <Link
                  href="/orders"
                  style={{
                    color: 'var(--on-dark)',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: 420,
                    opacity: 0.75,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}
                >
                  Orders
                </Link>
                <span
                  style={{
                    color: 'var(--link-cool-1)',
                    fontSize: '14px',
                    fontWeight: 500,
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {email}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-outline-dark"
                  style={{ fontSize: '14px', padding: '8px 18px', minHeight: '36px' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline-dark" style={{ fontSize: '14px', padding: '8px 18px', minHeight: '36px' }}>
                  Log in
                </Link>
                <Link href="/register" className="btn-primary-pill" style={{ fontSize: '14px', padding: '8px 18px', minHeight: '36px' }}>
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--on-dark)',
              cursor: 'pointer',
              padding: '8px',
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'currentColor', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'currentColor', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '16px', height: '2px', background: 'currentColor', borderRadius: '2px' }} />
          </button>
        </div>
      </nav>

      {/* ── Mobile nav drawer ── */}
      <div
        className={`nav-drawer ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-xxl)' }}>
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            style={{
              color: 'var(--on-dark)',
              textDecoration: 'none',
              fontSize: '20px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '22px' }}>◆</span>
            <span>Shopifi</span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--on-dark)',
              cursor: 'pointer',
              fontSize: '28px',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
          <Link
            href="/products"
            onClick={() => setMenuOpen(false)}
            style={{ color: 'var(--on-dark)', textDecoration: 'none', fontSize: '24px', fontWeight: 300 }}
          >
            Products
          </Link>

          {email ? (
            <>
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                style={{ color: 'var(--on-dark)', textDecoration: 'none', fontSize: '24px', fontWeight: 300 }}
              >
                Cart
              </Link>
              <Link
                href="/orders"
                onClick={() => setMenuOpen(false)}
                style={{ color: 'var(--on-dark)', textDecoration: 'none', fontSize: '24px', fontWeight: 300 }}
              >
                Orders
              </Link>
              <span style={{ color: 'var(--link-cool-1)', fontSize: '14px' }}>{email}</span>
              <button
                onClick={handleLogout}
                className="btn-outline-dark"
                style={{ width: 'fit-content' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                style={{ color: 'var(--on-dark)', textDecoration: 'none', fontSize: '24px', fontWeight: 300 }}
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="btn-primary-pill"
                style={{ width: 'fit-content' }}
              >
                Sign up free
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hamburger visibility via media query — injected inline */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}