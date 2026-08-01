'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrders } from '@/lib/api';
import { getAuth } from '@/lib/auth';

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { bg: string; color: string }> = {
    CONFIRMED:  { bg: 'var(--aloe-10)',     color: '#166534' },
    PENDING:    { bg: '#fef9c3',            color: '#854d0e' },
    CANCELLED:  { bg: '#fff1f2',            color: '#be123c' },
  };
  const v = variants[status] ?? { bg: 'var(--shade-30)', color: 'var(--shade-60)' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: v.bg,
        color: v.color,
        borderRadius: 'var(--rounded-pill)',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      }}
    >
      {status}
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    if (!auth) {
      router.push('/login');
      return;
    }
    getOrders(auth.userId)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="canvas-cream"
        style={{ minHeight: 'calc(100dvh - 57px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--sp-lg)' }}
      >
        <div className="spinner" />
        <p className="type-caption" style={{ color: 'var(--shade-50)' }}>Loading orders…</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        className="canvas-cream"
        style={{ minHeight: 'calc(100dvh - 57px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-xl)', padding: 'var(--sp-xxl)' }}
      >
        <span style={{ fontSize: '64px' }}>📦</span>
        <h1 className="type-display-md" style={{ fontSize: '36px', textAlign: 'center' }}>No orders yet</h1>
        <p className="type-body-md" style={{ color: 'var(--shade-50)', textAlign: 'center' }}>
          Place your first order to see it here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="canvas-cream"
      style={{ minHeight: 'calc(100dvh - 57px)', padding: 'clamp(40px, 6vw, 80px) var(--sp-lg)' }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* Header */}
        <div data-aos="fade-up" style={{ marginBottom: 'var(--sp-xxl)' }}>
          <p className="type-eyebrow" style={{ color: 'var(--shade-50)', marginBottom: 'var(--sp-sm)' }}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </p>
          <h1 className="type-display-md" style={{ fontSize: '40px' }}>Your orders</h1>
        </div>

        {/* Order cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-xl)' }}>
          {orders.map((order, i) => (
            <div
              key={order.id}
              className="card-pricing"
              data-aos="fade-up"
              data-aos-delay={Math.min(i * 60, 240)}
            >
              {/* Order header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 'var(--sp-lg)',
                  marginBottom: 'var(--sp-lg)',
                }}
              >
                <div>
                  <p className="type-heading-md" style={{ marginBottom: '4px' }}>Order #{order.id}</p>
                  <p className="type-caption" style={{ color: 'var(--shade-50)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-lg)' }}>
                  <StatusBadge status={order.status} />
                  <span className="type-heading-xl">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div
                style={{
                  borderTop: '1px solid var(--hairline-light)',
                  paddingTop: 'var(--sp-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sp-sm)',
                }}
              >
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 'var(--sp-sm)',
                    }}
                  >
                    <span className="type-caption" style={{ color: 'var(--shade-60)' }}>
                      {item.productName} <span style={{ color: 'var(--shade-40)' }}>× {item.quantity}</span>
                    </span>
                    <span className="type-caption" style={{ fontWeight: 550 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}