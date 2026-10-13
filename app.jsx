/* global React, ReactDOM, I18nProvider, Nav, SideMenu, Hero, PuntoPartida, Ramas, Principio, Diagnostico, Recorrido, Proyectos, Cerca, Testimonios, Preguntas, Cierre, Footer, Quedamos, useReveal, useT, CookieConsent, ChatGlobo */
const { useState, useEffect } = React;

function AppInner() {
  useReveal();

  const scrollToContact = () => {
    const el = document.getElementById('quedamos');
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <>
      <Nav onCartClick={scrollToContact} />
      <SideMenu />
      <div className="scroll-content">
        <Hero />
        <PuntoPartida />
        <Ramas />
        {typeof Principio !== 'undefined' && <Principio />}
        {typeof Diagnostico !== 'undefined' && <Diagnostico />}
        {typeof Recorrido !== 'undefined' && <Recorrido />}
        {typeof Proyectos !== 'undefined' && <Proyectos />}
        {typeof Cerca !== 'undefined' && <Cerca />}
        {typeof Testimonios !== 'undefined' && <Testimonios />}
        {typeof Preguntas !== 'undefined' && <Preguntas />}
        {typeof Cierre !== 'undefined' && <Cierre />}
        <Quedamos />
      </div>
      <Footer onCartClick={scrollToContact} />
      {typeof CookieConsent !== 'undefined' && <CookieConsent />}
      {typeof ChatGlobo !== 'undefined' && <ChatGlobo onCTA={scrollToContact} />}
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
