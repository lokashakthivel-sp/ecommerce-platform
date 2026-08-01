'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    setError('');
    getProducts()
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div
      className="canvas-cream"
      style={{ minHeight: 'calc(100dvh - 57px)' }}
    >
      {/* ── Page header ── */}
      <div
        className="canvas-night"
        style={{
          paddingTop: 'clamp(48px, 6vw, 80px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
        }}
      >
        <div className="container-shopifi">
          <p
            className="type-eyebrow pill-tag-mint"
            data-aos="fade-up"
            style={{ marginBottom: 'var(--sp-lg)', display: 'inline-flex' }}
          >
            Catalogue
          </p>
          <h1
            className="type-display-xl"
            data-aos="fade-up"
            data-aos-delay="80"
            style={{ color: 'var(--on-dark)' }}
          >
            All products
          </h1>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div
        style={{
          paddingTop: 'clamp(40px, 5vw, 64px)',
          paddingBottom: 'clamp(40px, 5vw, 64px)',
        }}
      >
        <div className="container-shopifi">
          {/* Loading */}
          {loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '320px',
                flexDirection: 'column',
                gap: 'var(--sp-lg)',
              }}
            >
              <div className="spinner" />
              <p className="type-caption" style={{ color: 'var(--shade-50)' }}>
                Loading products…
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div
              style={{
                background: 'var(--canvas-light)',
                border: '1px solid var(--hairline-light)',
                borderRadius: 'var(--rounded-lg)',
                padding: 'var(--sp-xxl)',
                textAlign: 'center',
              }}
            >
              <p className="type-body-md" style={{ color: 'var(--shade-60)' }}>
                {error}
              </p>
              <button
                onClick={fetchProducts}
                className="btn-primary-pill"
                style={{ marginTop: 'var(--sp-lg)' }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--sp-huge) 0' }}>
              <p className="type-body-lg" style={{ color: 'var(--shade-50)' }}>
                No products available right now.
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="product-grid">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(i * 60, 300)}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
