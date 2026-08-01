'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProduct, addToCart } from '@/lib/api';
import { getAuth } from '@/lib/auth';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    setError('');
    getProduct(params.id as string)
      .then(setProduct)
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const handleAddToCart = async () => {
    const auth = getAuth();
    if (!auth) {
      router.push('/login');
      return;
    }
    if (!product) return;

    setAdding(true);
    try {
      await addToCart(auth.userId, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: quantity,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch {
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div
        className="canvas-cream"
        style={{
          minHeight: 'calc(100dvh - 57px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 'var(--sp-lg)',
        }}
      >
        <div className="spinner" />
        <p className="type-caption" style={{ color: 'var(--shade-50)' }}>
          Loading product details…
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className="canvas-cream"
        style={{
          minHeight: 'calc(100dvh - 57px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--sp-xl)',
          padding: 'var(--sp-xxl)',
        }}
      >
        <div
          className="card-pricing"
          style={{ textAlign: 'center', maxWidth: '440px', width: '100%' }}
        >
          <span style={{ fontSize: '48px', display: 'block', marginBottom: 'var(--sp-md)' }}>
            🔍
          </span>
          <h1 className="type-heading-xl" style={{ marginBottom: 'var(--sp-sm)' }}>
            Product Not Found
          </h1>
          <p className="type-body-md" style={{ color: 'var(--shade-50)', marginBottom: 'var(--sp-xl)' }}>
            The item you are looking for does not exist or has been removed.
          </p>
          <Link href="/products" className="btn-primary-pill" style={{ width: '100%' }}>
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="canvas-cream"
      style={{ minHeight: 'calc(100dvh - 57px)' }}
    >
      {/* ── Dark Header / Navigation Band ── */}
      <div
        className="canvas-night"
        style={{
          paddingTop: 'clamp(32px, 4vw, 48px)',
          paddingBottom: 'clamp(32px, 4vw, 48px)',
        }}
      >
        <div className="container-shopifi">
          <Link
            href="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--link-mint)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: 'var(--sp-lg)',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            ← Back to products
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
            <span className="type-eyebrow pill-tag-mint">
              Product Details
            </span>
            <span
              className="type-eyebrow pill-tag-shade"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: 'var(--on-dark)',
              }}
            >
              #{product.id}
            </span>
          </div>

          <h1
            className="type-display-xl"
            data-aos="fade-up"
            style={{
              color: 'var(--on-dark)',
              marginTop: 'var(--sp-md)',
            }}
          >
            {product.name}
          </h1>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div
        style={{
          paddingTop: 'clamp(40px, 5vw, 64px)',
          paddingBottom: 'clamp(40px, 5vw, 64px)',
        }}
      >
        <div className="container-shopifi">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(24px, 4vw, 40px)',
              alignItems: 'start',
            }}
          >
            {/* Left: Product Showcase Media */}
            <div
              className="card-pricing"
              data-aos="fade-up"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '380px',
                background: 'linear-gradient(180deg, var(--canvas-cream) 0%, var(--canvas-light) 100%)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontSize: '96px',
                  lineHeight: 1,
                  userSelect: 'none',
                  filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
                  transition: 'transform 0.3s ease',
                }}
              >
                📦
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: 'var(--sp-lg)',
                  right: 'var(--sp-lg)',
                }}
              >
                <span
                  className={product.stockQuantity > 0 ? 'pill-tag-mint' : 'pill-tag-shade'}
                >
                  {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Right: Product Details & Purchase Card */}
            <div
              className="card-pricing"
              data-aos="fade-up"
              data-aos-delay="80"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-xl)',
              }}
            >
              <div>
                <h2
                  className="type-heading-xl"
                  style={{ marginBottom: 'var(--sp-sm)' }}
                >
                  {product.name}
                </h2>
                <p
                  className="type-body-md"
                  style={{ color: 'var(--shade-60)', lineHeight: '1.6' }}
                >
                  {product.description}
                </p>
              </div>

              {/* Price & Stock info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  paddingTop: 'var(--sp-md)',
                  paddingBottom: 'var(--sp-md)',
                  borderTop: '1px solid var(--hairline-light)',
                  borderBottom: '1px solid var(--hairline-light)',
                }}
              >
                <div>
                  <span
                    className="type-caption"
                    style={{ color: 'var(--shade-50)', display: 'block', marginBottom: '2px' }}
                  >
                    Price
                  </span>
                  <span className="type-display-md" style={{ fontSize: '36px', fontWeight: 400 }}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    className="type-caption"
                    style={{ color: 'var(--shade-50)', display: 'block', marginBottom: '2px' }}
                  >
                    Status
                  </span>
                  <span
                    className="type-body-md"
                    style={{
                      fontWeight: 500,
                      color: product.stockQuantity > 0 ? '#166534' : 'var(--shade-50)',
                    }}
                  >
                    {product.stockQuantity > 0 ? 'In Stock' : 'Unavailable'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                {product.stockQuantity > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
                    <span className="type-caption" style={{ color: 'var(--shade-60)', minWidth: '70px' }}>
                      Quantity
                    </span>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid var(--hairline-light)',
                        borderRadius: 'var(--rounded-pill)',
                        padding: '4px 8px',
                        background: 'var(--canvas-cream)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1 || adding}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          background: 'none',
                          fontSize: '18px',
                          cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                          color: quantity <= 1 ? 'var(--shade-40)' : 'var(--ink)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        −
                      </button>
                      <span
                        className="type-body-md"
                        style={{
                          width: '36px',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      >
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                        disabled={quantity >= product.stockQuantity || adding}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          background: 'none',
                          fontSize: '18px',
                          cursor: quantity >= product.stockQuantity ? 'not-allowed' : 'pointer',
                          color: quantity >= product.stockQuantity ? 'var(--shade-40)' : 'var(--ink)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={adding || product.stockQuantity === 0}
                  className={added ? 'btn-aloe-pill' : 'btn-primary-pill'}
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    fontSize: '16px',
                    fontWeight: 500,
                    marginTop: 'var(--sp-sm)',
                  }}
                >
                  {adding
                    ? 'Adding to cart…'
                    : added
                    ? '✓ Added to cart'
                    : product.stockQuantity === 0
                    ? 'Out of stock'
                    : `Add ${quantity > 1 ? `${quantity} items` : 'to cart'}`}
                </button>
              </div>

              {/* Trust Badges */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'var(--sp-sm)',
                  paddingTop: 'var(--sp-lg)',
                  borderTop: '1px solid var(--hairline-light)',
                  textAlign: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>⚡</span>
                  <span className="type-caption" style={{ fontSize: '12px', color: 'var(--shade-50)' }}>
                    Fast Shipping
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>🔒</span>
                  <span className="type-caption" style={{ fontSize: '12px', color: 'var(--shade-50)' }}>
                    Secure Payment
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>🔄</span>
                  <span className="type-caption" style={{ fontSize: '12px', color: 'var(--shade-50)' }}>
                    Easy Returns
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}