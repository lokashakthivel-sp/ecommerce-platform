import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* ── Cinematic dark hero ── */}
      <section
        className="canvas-night"
        style={{
          paddingTop: 'clamp(100px, 14vw, 200px)',
          paddingBottom: 'clamp(100px, 14vw, 200px)',
          minHeight: 'clamp(540px, 70vh, 800px)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative grid */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            pointerEvents: 'none',
          }}
        />

        <div className="container-shopifi" style={{ position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
          <p
            className="type-eyebrow pill-tag-mint"
            data-aos="fade-up"
            style={{ marginBottom: 'var(--sp-xl)', display: 'inline-flex' }}
          >
            New collection
          </p>

          {/* Hero headline */}
          <h1
            className="type-display-xxl"
            data-aos="fade-up"
            data-aos-delay="80"
            style={{
              color: 'var(--on-dark)',
              maxWidth: '900px',
              marginBottom: 'var(--sp-xl)',
            }}
          >
            Commerce,
            <br />
            reimagined.
          </h1>

          {/* Sub-copy */}
          <p
            className="type-body-lg"
            data-aos="fade-up"
            data-aos-delay="160"
            style={{
              color: 'var(--shade-40)',
              maxWidth: '480px',
              marginBottom: 'var(--sp-xxl)',
            }}
          >
            Discover a curated catalogue of products, delivered fast and priced right.
          </p>

          {/* CTA row */}
          <div
            data-aos="fade-up"
            data-aos-delay="240"
            style={{ display: 'flex', gap: 'var(--sp-lg)', flexWrap: 'wrap' }}
          >
            <Link href="/products" className="btn-outline-dark">
              Browse products
            </Link>
            <Link href="/register" className="btn-primary-pill">
              Start shopping
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature bands ── */}
      <section
        className="canvas-cream"
        style={{
          paddingTop: 'clamp(64px, 8vw, 120px)',
          paddingBottom: 'clamp(64px, 8vw, 120px)',
        }}
      >
        <div className="container-shopifi">
          <p
            className="type-eyebrow"
            data-aos="fade-up"
            style={{ color: 'var(--shade-50)', marginBottom: 'var(--sp-lg)' }}
          >
            Why Shopifi
          </p>
          <h2
            className="type-display-md"
            data-aos="fade-up"
            data-aos-delay="80"
            style={{ marginBottom: 'clamp(40px, 5vw, 64px)', maxWidth: '600px' }}
          >
            Everything you need to shop smarter.
          </h2>

          {/* Feature cards grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--sp-xl)',
            }}
          >
            {[
              { icon: '⚡', title: 'Fast checkout', body: 'Go from cart to confirmed in seconds. No friction, no friction.' },
              { icon: '🔒', title: 'Secure payments', body: 'Industry-standard auth keeps your data and transactions safe.' },
              { icon: '📦', title: 'Live inventory', body: 'Real-time stock counts so you only see what\'s actually available.' },
              { icon: '🚀', title: 'Instant orders', body: 'Place and track orders in one place, all in real time.' },
            ].map((f, i) => (
              <div
                key={f.title}
                className="card-pricing"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <span style={{ fontSize: '32px', display: 'block', marginBottom: 'var(--sp-lg)' }}>{f.icon}</span>
                <h3 className="type-heading-md" style={{ marginBottom: 'var(--sp-sm)' }}>{f.title}</h3>
                <p className="type-caption" style={{ color: 'var(--shade-50)' }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark CTA band ── */}
      <section
        className="canvas-night"
        style={{
          paddingTop: 'clamp(64px, 8vw, 128px)',
          paddingBottom: 'clamp(64px, 8vw, 128px)',
        }}
      >
        <div className="container-shopifi" style={{ textAlign: 'center' }}>
          <p
            className="type-eyebrow"
            data-aos="fade-up"
            style={{ color: 'var(--link-mint)', marginBottom: 'var(--sp-lg)' }}
          >
            Ready to explore?
          </p>
          <h2
            className="type-display-xl"
            data-aos="fade-up"
            data-aos-delay="80"
            style={{
              color: 'var(--on-dark)',
              maxWidth: '600px',
              margin: '0 auto var(--sp-xxl)',
            }}
          >
            Browse the full catalogue.
          </h2>
          <div
            data-aos="fade-up"
            data-aos-delay="160"
            style={{ display: 'flex', gap: 'var(--sp-lg)', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/products" className="btn-outline-dark">
              View products
            </Link>
            <Link href="/register" className="btn-primary-pill">
              Create account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}