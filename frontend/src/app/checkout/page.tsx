'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, placeOrder } from '@/lib/api';
import { getAuth } from '@/lib/auth';

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const auth = getAuth();

  useEffect(() => {
    if (!auth) {
      router.push('/login');
      return;
    }
    getCart(auth.userId)
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!auth) return;
    setPlacing(true);
    setError('');

    try {
      await placeOrder(auth.userId, items);
      router.push('/orders');
    } catch {
      setError('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div
        className="canvas-cream"
        style={{ minHeight: 'calc(100dvh - 57px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--sp-lg)' }}
      >
        <div className="spinner" />
        <p className="type-caption" style={{ color: 'var(--shade-50)' }}>Loading…</p>
      </div>
    );
  }

  return (
    <div
      className="canvas-cream"
      style={{ minHeight: 'calc(100dvh - 57px)', padding: 'clamp(40px, 6vw, 80px) var(--sp-lg)' }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Header */}
        <div data-aos="fade-up" style={{ marginBottom: 'var(--sp-xxl)' }}>
          <p className="type-eyebrow" style={{ color: 'var(--shade-50)', marginBottom: 'var(--sp-sm)' }}>
            Final step
          </p>
          <h1 className="type-display-md" style={{ fontSize: '40px' }}>Checkout</h1>
        </div>

        {/* Error */}
        {error && (
          <div
            data-aos="fade-in"
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

        {/* Order summary card */}
        <div
          data-aos="fade-up"
          data-aos-delay="80"
          className="card-pricing"
          style={{ marginBottom: 'var(--sp-xl)' }}
        >
          <h2 className="type-heading-md" style={{ marginBottom: 'var(--sp-lg)' }}>Order summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
            {items.map(item => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--sp-sm)',
                }}
              >
                <span className="type-body-md" style={{ color: 'var(--shade-60)' }}>
                  {item.productName} <span style={{ color: 'var(--shade-40)' }}>× {item.quantity}</span>
                </span>
                <span className="type-body-md" style={{ fontWeight: 550 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--hairline-light)', marginTop: 'var(--sp-lg)', paddingTop: 'var(--sp-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="type-heading-md">Total</span>
              <span className="type-display-md" style={{ fontSize: '32px' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Place order CTA */}
        <div data-aos="fade-up" data-aos-delay="160">
          <button
            onClick={handlePlaceOrder}
            disabled={placing || items.length === 0}
            className="btn-aloe-pill"
            style={{ width: '100%', fontSize: '18px', padding: '16px 24px', minHeight: '56px' }}
          >
            {placing ? 'Placing order…' : 'Place order'}
          </button>
          {items.length === 0 && (
            <p className="type-caption" style={{ textAlign: 'center', color: 'var(--shade-50)', marginTop: 'var(--sp-sm)' }}>
              Your cart is empty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}