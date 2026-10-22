import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('d1mode');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('d1mode', theme);
    } catch (e) {}

    // Update document light/dark folder references
    const mode = theme === 'light' ? 'light/' : '';
    document.querySelectorAll('[data-file]').forEach(el => {
      const orig = el.dataset.d1file || el.getAttribute('data-file') || '';
      if (!el.dataset.d1file) el.dataset.d1file = orig;
      if (/^docs\//.test(orig)) el.setAttribute('data-file', mode + orig);
    });

    document.querySelectorAll('a[href]').forEach(el => {
      const orig = el.dataset.d1href || el.getAttribute('href') || '';
      if (!el.dataset.d1href) el.dataset.d1href = orig;
      if (/^docs\//.test(orig)) el.setAttribute('href', mode + orig);
    });

    document.querySelectorAll('img[src]').forEach(el => {
      const orig = el.dataset.d1src || el.getAttribute('src') || '';
      if (!el.dataset.d1src) el.dataset.d1src = orig;
      if (/^img\/cover_/.test(orig)) el.setAttribute('src', mode + orig);
    });

    document.dispatchEvent(new CustomEvent('d1mode', { detail: theme }));
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

