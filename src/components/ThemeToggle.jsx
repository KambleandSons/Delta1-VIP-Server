import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`mode inline-flex flex-row items-center justify-center gap-1.5 min-h-[40px] h-10 px-2.5 sm:px-3 rounded-full border border-d1line bg-d1surface text-d1fg font-sans font-semibold text-[0.8rem] cursor-pointer shrink-0 box-border hover:border-d1blue transition-colors ${className}`}
      onClick={toggleTheme}
      aria-label="Switch between light and dark"
      title="Light / dark"
    >
      <svg
        className="moon w-[18px] h-[18px] fill-none stroke-current"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
      </svg>
      <svg
        className="sun w-[18px] h-[18px] fill-none stroke-current"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <span className="ml hidden sm:inline">Light</span>
      <span className="md hidden sm:inline">Dark</span>
    </button>
  );
}
