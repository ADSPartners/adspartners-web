/* global React, ReactDOM, I18nProvider, Nav, SideMenu, Hero, Marquee, Manifiesto, Services, Team, WorkModel, Clients, FAQs, Footer, Shop, CheckoutModal, CookieConsent, useReveal, useT */
const { useState, useEffect } = React;

function MarqueeI18n() {
  const { t, lang } = useT();
  const items = lang === 'en'
    ? ['We don\'t sell smoke.', 'There\'s enough pollution already.', 'The first sale is fine. The second one is business.', 'Filtering is also positioning.', 'If we go in, we go all in.']
    : ['No vendemos humo.', 'Bastante contaminación hay ya.', 'La primera venta está bien. La segunda es negocio.', 'Filtrar también es posicionar.', 'Si vamos dentro, vamos de verdad.'];
  return <Marquee items={items} />;
}

function AppInner() {
  const [cartCount, setCartCount] = useState(0);
  const [openProduct, setOpenProduct] = useState(null);

  useReveal();

  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const handleOpenProduct = (product) => {
    setOpenProduct(product);
    setCartCount((c) => c + 1);
  };

  return (
    <>
      <Nav cartCount={cartCount} onCartClick={scrollToContact} />
      <SideMenu onCartClick={scrollToContact} />
      <Hero />
      <Manifiesto />
      <Clients />
      <Team />
      <Services />
      <WorkModel />
      <Shop cartCount={cartCount} onOpenProduct={handleOpenProduct} />
      <FAQs />
      <Footer onCartClick={scrollToContact} />
      <CheckoutModal product={openProduct} onClose={() => setOpenProduct(null)} />
      {typeof CookieConsent !== 'undefined' && <CookieConsent />}
    </>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
