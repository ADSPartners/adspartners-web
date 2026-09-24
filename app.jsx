/* global React, ReactDOM, I18nProvider, Nav, SideMenu, Hero, Manifiesto, Services, WorkModel, WinWin, Footer, Quedamos, useReveal, useT, CookieConsent, ChatGlobo */
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
        <Manifiesto />
        <Services />
        <WorkModel />
        <WinWin />
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
