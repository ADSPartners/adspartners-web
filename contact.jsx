/* global React, useT */
const { useState, useEffect, useRef: useRef2 } = React;

// ============= ICONS =============
function ProductIcon({ kind }) {
  if (kind === 'beer') return (
    <svg className="product__icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="14" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M32 20h6a3 3 0 0 1 0 6h-6" stroke="currentColor" strokeWidth="2"/>
      <line x1="8" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  if (kind === 'coffee') return (
    <svg className="product__icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18h24l-3 18H13L10 18Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M34 22h4a3 3 0 0 1 0 6h-4" stroke="currentColor" strokeWidth="2"/>
      <line x1="18" y1="36" x2="18" y2="40" stroke="currentColor" strokeWidth="2"/>
      <line x1="26" y1="36" x2="26" y2="40" stroke="currentColor" strokeWidth="2"/>
      <line x1="14" y1="40" x2="30" y2="40" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  // custom (drink choice)
  return (
    <svg className="product__icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8h16c0 10-4 16-8 18S16 18 16 8Z" stroke="currentColor" strokeWidth="2"/>
      <line x1="24" y1="26" x2="24" y2="38" stroke="currentColor" strokeWidth="2"/>
      <line x1="17" y1="38" x2="31" y2="38" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

// ============= PRODUCTS DATA =============
function getProducts(t) {
  return [
    {
      id: 'birra',
      icon: 'beer',
      sku: t('shop.p1.sku'),
      name: t('shop.p1.n'),
      desc: t('shop.p1.d'),
      meta: [t('shop.p1.m1'), t('shop.p1.m2'), t('shop.p1.m3')],
      title: t('shop.p1.title'),
      customDrink: false,
    },
    {
      id: 'cafe',
      icon: 'coffee',
      sku: t('shop.p2.sku'),
      name: t('shop.p2.n'),
      desc: t('shop.p2.d'),
      meta: [t('shop.p2.m1'), t('shop.p2.m2'), t('shop.p2.m3')],
      title: t('shop.p2.title'),
      customDrink: false,
    },
    {
      id: 'tu-eliges',
      icon: 'custom',
      sku: t('shop.p3.sku'),
      name: t('shop.p3.n'),
      desc: t('shop.p3.d'),
      meta: [t('shop.p3.m1'), t('shop.p3.m2'), t('shop.p3.m3')],
      title: t('shop.p3.title'),
      customDrink: true,
    },
  ];
}

// ============= PRODUCT CARD =============
function ProductCard({ product, onAdd }) {
  return (
    <article className="product" onClick={() => onAdd(product)} data-cursor="cta">
      <div className="product__img">
        <ProductIcon kind={product.icon} />
        <div className="product__sku">{product.sku}</div>
        <div className="product__price">0,00€</div>
      </div>
      <div className="product__body">
        <h3 className="product__name">{product.name}</h3>
        <p className="product__desc">{product.desc}</p>
        <div className="product__meta">
          {product.meta.map((m, i) => <span key={i}>{m}</span>)}
        </div>
        <button type="button" className="product__btn" onClick={(e) => { e.stopPropagation(); onAdd(product); }}>
          <span><Trans k="shop.add" /></span>
          <span>→</span>
        </button>
      </div>
    </article>
  );
}

// Tiny helper to translate inline (kept local to avoid extra imports)
function Trans({ k }) {
  const { t } = useT();
  return <>{t(k)}</>;
}

// ============= SHOP SECTION =============
function Shop({ cartCount, onOpenProduct }) {
  const { t } = useT();
  const products = getProducts(t);

  return (
    <section className="shop" id="contacto" data-screen-label="09 Quedamos">
      <div className="shop__topbar">
        <span>{t('shop.k')}</span>
        <div className="shop__cart">
          <span>{t('shop.cart')}</span>
          <span style={{ opacity: .5 }}>·</span>
          <span>{cartCount}</span>
        </div>
      </div>

      <div className="shop__head reveal">
        <h2 className="shop__title">
          <span>{t('shop.t1')}</span><br />
          <span>{t('shop.t2')}</span>
        </h2>
        <div className="shop__right">
          <p className="shop__sub">{t('shop.sub')}</p>
          <p className="shop__note">{t('shop.note')}</p>
        </div>
      </div>

      <div className="shop__grid reveal">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onOpenProduct} />
        ))}
      </div>
    </section>
  );
}

// ============= CHECKOUT MODAL =============
function CheckoutModal({ product, onClose }) {
  const { t } = useT();
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef2(null);

  // Lock body + ESC
  useEffect(() => {
    if (!product) return;
    setSubmitted(false);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (formRef.current) formRef.current.reset();
  };

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="modal open"
      role="dialog"
      aria-modal="true"
      aria-hidden="false"
      onClick={handleBackdrop}
    >
      <div className="modal__box">
        <button className="modal__close" onClick={onClose} aria-label="Cerrar" data-cursor="cta">✕</button>

        {!submitted && (
          <div id="modalView">
            <div className="modal__kicker">{t('mod.kicker')}</div>
            <h3 className="modal__title">{product.title}</h3>
            <p className="modal__sub">{t('mod.sub')}</p>
            <div className="modal__sep"></div>
            <form className="mform" ref={formRef} onSubmit={handleSubmit} noValidate>
              {product.customDrink && (
                <div className="mfield">
                  <label dangerouslySetInnerHTML={{ __html: t('mod.f.drink') }}></label>
                  <input type="text" name="drink" placeholder={t('mod.f.drink.ph')} autoComplete="off" required />
                </div>
              )}
              <div className="mfield">
                <label>{t('mod.f.name')}</label>
                <input type="text" name="name" autoComplete="name" required />
              </div>
              <div className="mrow">
                <div className="mfield">
                  <label>{t('mod.f.email')}</label>
                  <input type="email" name="email" autoComplete="email" required />
                </div>
                <div className="mfield">
                  <label>{t('mod.f.phone')}</label>
                  <input type="tel" name="phone" placeholder="+34" autoComplete="tel" />
                </div>
              </div>
              <div className="mrow">
                <div className="mfield">
                  <label>{t('mod.f.city')}</label>
                  <input type="text" name="city" placeholder={t('mod.f.city.ph')} />
                </div>
                <div className="mfield">
                  <label>{t('mod.f.when')}</label>
                  <select name="when">
                    <option>{t('mod.f.w1')}</option>
                    <option>{t('mod.f.w2')}</option>
                    <option>{t('mod.f.w3')}</option>
                  </select>
                </div>
              </div>
              <div className="mfield">
                <label dangerouslySetInnerHTML={{ __html: t('mod.f.msg') }}></label>
                <textarea name="msg" rows="3"></textarea>
              </div>
              <button type="submit" className="msubmit" data-cursor="cta">{t('mod.submit')}</button>
            </form>
          </div>
        )}

        {submitted && (
          <div id="modalSuccess" className="modal__success show">
            <span className="hand">{t('mod.ok.hand')}</span>
            <h3>{t('mod.ok.t')}</h3>
            <p>{t('mod.ok.d')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Shop, CheckoutModal });
