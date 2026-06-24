/* global React, ReactDOM, I18nProvider, Nav, SideMenu, Hero, Manifiesto, Services, Team, WorkModel, WinWin, Clients, Footer, Quedamos, useReveal, useT, CookieConsent */
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
      <SideMenu onCartClick={scrollToContact} />
      <div className="scroll-content">
        <Hero />
        <Manifiesto />
        <Clients />
        <Services />
        <WorkModel />
        <WinWin />
        <Team />
        <Quedamos />
      </div>
      <Footer onCartClick={scrollToContact} />
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
