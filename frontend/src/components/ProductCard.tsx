'use client';

import Link from 'next/link';
import { addToCart } from '@/lib/api';
import { getAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    const auth = getAuth();
    if (!auth) {
      router.push('/login');
      return;
    }

    setAdding(true);
    try {
      await addToCart(auth.userId, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="card-pricing"
      style={{
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-4)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-3)';
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          background: 'var(--canvas-cream)',
          borderRadius: 'var(--rounded-md)',
          height: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--sp-lg)',
          fontSize: '48px',
        }}
      >
        📦
      </div>

      {/* Product info */}
      <div style={{ flex: 1 }}>
        <Link
          href={`/products/${product.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <h2
            className="type-heading-md"
            style={{
              marginBottom: 'var(--sp-sm)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--shade-60)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink)')}
          >
            {product.name}
          </h2>
        </Link>

        <p
          className="type-caption"
          style={{
            color: 'var(--shade-50)',
            marginBottom: 'var(--sp-lg)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>
      </div>

      {/* Price row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 'var(--sp-lg)',
        }}
      >
        <span
          className="type-display-md"
          style={{ fontSize: '28px', fontWeight: 400 }}
        >
          ${product.price}
        </span>
        <span
          className="type-caption"
          style={{ color: 'var(--shade-40)' }}
        >
          {product.stockQuantity} in stock
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={handleAddToCart}
        disabled={adding || product.stockQuantity === 0}
        className={added ? 'btn-aloe-pill' : 'btn-primary-pill'}
        style={{ width: '100%' }}
      >
        {adding ? 'Adding…' : added ? '✓ Added to cart' : product.stockQuantity === 0 ? 'Out of stock' : 'Add to cart'}
      </button>
    </div>
  );
}