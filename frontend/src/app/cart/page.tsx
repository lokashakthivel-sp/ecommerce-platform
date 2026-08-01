'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, getCartTotal, removeFromCart } from '@/lib/api';
import { getAuth } from '@/lib/auth';
import Link from 'next/link';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  const auth = getAuth();

  useEffect(() => {
    if (!auth) {
      router.push('/login');
      return;
    }

    Promise.all([
      getCart(auth.userId),
      getCartTotal(auth.userId),
    ]).then(([cartItems, cartTotal]) => {
      setItems(cartItems);
      setTotal(cartTotal.total);
    }).finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId: number) => {
    if (!auth) return;
    setRemoving(productId);
    try {
      await removeFromCart(auth.userId, productId);
      const newItems = items.filter(i => i.productId !== productId);
      setItems(newItems);
      setTotal(newItems.reduce((sum, i) => sum + i.price * i.quantity, 0));
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div
        className="canvas-cream"
        style={{ minHeight: 'calc(100dvh - 57px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--sp-lg)' }}
      >
        <div className="spinner" />
        <p className="type-caption" style={{ color: 'var(--shade-50)' }}>Loading cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="canvas-cream"
        style={{ minHeight: 'calc(100dvh - 57px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-xl)', padding: 'var(--sp-xxl)' }}
      >
        <span style={{ fontSize: '64px' }}>🛒</span>
        <h1 className="type-display-md" style={{ fontSize: '36px', textAlign: 'center' }}>Your cart is empty</h1>
        <p className="type-body-md" style={{ color: 'var(--shade-50)', textAlign: 'center' }}>
          Add some products to get started.
        </p>
        <Link href="/" className="btn-primary-pill">Browse products</Link>
      </div>
    );
  }

  return (
    <div
      className="canvas-cream"
      style={{ minHeight: 'calc(100dvh - 57px)', padding: 'clamp(40px, 6vw, 80px) var(--sp-lg)' }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div data-aos="fade-up" style={{ marginBottom: 'var(--sp-xxl)' }}>
          <p className="type-eyebrow" style={{ color: 'var(--shade-50)', marginBottom: 'var(--sp-sm)' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
          <h1 className="type-display-md" style={{ fontSize: '40px' }}>Your cart</h1>
        </div>

        {/* Cart items */}
        <div data-aos="fade-up" data-aos-delay="80" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', marginBottom: 'var(--sp-xxl)' }}>
          {items.map(item => (
            <div
              key={item.id}
              className="card-pricing"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--sp-lg) var(--sp-xl)',
                flexWrap: 'wrap',
                gap: 'var(--sp-lg)',
              }}
            >
              {/* Item info */}
              <div style={{ flex: 1, minWidth: '160px' }}>
                <h3 className="type-heading-md" style={{ marginBottom: '4px' }}>{item.productName}</h3>
                <p className="type-caption" style={{ color: 'var(--shade-50)' }}>
                  Qty {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Price + remove */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-xl)' }}>
                <span className="type-heading-xl">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => handleRemove(item.productId)}
                  disabled={removing === item.productId}
                  style={{
                    background: 'none',
                    border: '1px solid var(--hairline-light)',
                    borderRadius: 'var(--rounded-pill)',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--shade-60)',
                    cursor: removing === item.productId ? 'not-allowed' : 'pointer',
                    opacity: removing === item.productId ? 0.5 : 1,
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#be123c';
                    (e.currentTarget as HTMLButtonElement).style.color = '#be123c';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--hairline-light)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--shade-60)';
                  }}
                >
                  {removing === item.productId ? '…' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div
          data-aos="fade-up"
          data-aos-delay="160"
          style={{
            background: 'var(--canvas-light)',
            borderRadius: 'var(--rounded-lg)',
            border: '1px solid var(--hairline-light)',
            padding: 'var(--sp-xxl)',
            boxShadow: 'var(--shadow-3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--sp-xl)' }}>
            <span className="type-heading-md">Total</span>
            <span className="type-display-md" style={{ fontSize: '32px' }}>${total.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="btn-primary-pill"
            style={{ display: 'block', textAlign: 'center', width: '100%' }}
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}