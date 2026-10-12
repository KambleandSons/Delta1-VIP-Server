import { createContext, useContext, useState, useEffect } from 'react';
import { changeLanguage, initTranslationObserver } from '../utils/i18n';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Dark/light mode
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem('d1mode') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
  });

  // Plan: 'free' or 'vip'
  const [plan, setPlanState] = useState(() => {
    try {
      const saved = localStorage.getItem('d1vip-plan');
      if (saved === 'vip' || saved === 'free') return saved;
      return (typeof window !== 'undefined' && window.D1_SUPPORT?.plan) || 'free';
    } catch {
      return 'free';
    }
  });

  // Steps done (1, 2, 3)
  const [stepsDone, setStepsDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem('d1steps') || '[]'); } catch { return []; }
  });

  // Language
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem('d1lang') || 'en'; } catch { return 'en'; }
  });

  // PDF Viewer state
  const [viewer, setViewer] = useState({ open: false, file: null, name: null, title: null });

  // Aria player state
  const [player, setPlayer] = useState({ open: false, src: null, title: null, step: null, caption: null });

  // Ask drawer state
  const [askOpen, setAskOpen] = useState(false);

  // Upsell modal state
  const [upsellOpen, setUpsellOpen] = useState(false);

  // Apply theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('d1mode', theme); } catch {}
  }, [theme]);

  // Apply plan class to body ('plan-free' or 'plan-vip')
  useEffect(() => {
    document.body.classList.remove('plan-free', 'plan-vip');
    document.body.classList.add(`plan-${plan}`);
    try { localStorage.setItem('d1vip-plan', plan); } catch {}
  }, [plan]);

  // Persist steps
  useEffect(() => {
    try { localStorage.setItem('d1steps', JSON.stringify(stepsDone)); } catch {}
  }, [stepsDone]);

  // Apply language translations
  useEffect(() => {
    initTranslationObserver();
    changeLanguage(lang);
  }, [lang]);

  function setLang(newLang) {
    setLangState(newLang);
    changeLanguage(newLang);
  }

  function toggleTheme() {
    setThemeState(t => t === 'light' ? 'dark' : 'light');
  }

  function setPlan(newPlan) {
    setPlanState(newPlan);
  }

  function markStepDone(n) {
    setStepsDone(prev => prev.includes(n) ? prev : [...prev, n]);
  }

  function openViewer(file, name, title) {
    setViewer({ open: true, file, name, title });
  }

  function closeViewer() {
    setViewer({ open: false, file: null, name: null, title: null });
  }

  function openPlayer(src, title, step, caption) {
    setPlayer({ open: true, src, title, step, caption });
  }

  function closePlayer() {
    setPlayer({ open: false, src: null, title: null, step: null, caption: null });
  }

  function openUpsell() {
    setUpsellOpen(true);
  }

  function closeUpsell() {
    setUpsellOpen(false);
  }

  const isReady = stepsDone.length >= 3;

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      plan, setPlan,
      stepsDone, markStepDone,
      lang, setLang,
      viewer, openViewer, closeViewer,
      player, openPlayer, closePlayer,
      askOpen, setAskOpen,
      upsellOpen, openUpsell, closeUpsell,
      isReady,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
