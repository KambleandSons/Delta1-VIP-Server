import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Header({
  onStartWalkthrough,
  onOpenAriaChat,
  currentLang = 'en',
  onLangChange,
  onUpgradeClick,
  plan = 'free',
  stepsDone = { 1: false, 2: false, 3: false }
}) {
  const [activeNav, setActiveNav] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['support', 'check', 'distributors', 'members'];
      const scrollY = window.scrollY + 120;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          setActiveNav(id);
          return;
        }
      }
      setActiveNav('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const doneCount = Object.values(stepsDone).filter(Boolean).length;

  return (
    <>
      <nav
        className="top sticky top-0 z-40 w-full border-b border-d1line bg-[var(--topbar)] backdrop-blur-md"
        aria-label="Your place on the page"
      >
        <div className="wrap flex flex-row flex-nowrap items-center justify-between w-full max-w-[1160px] mx-auto px-6 min-h-[68px] h-[68px] gap-3 sm:gap-4 box-border">
          {/* Brand Logo */}
          <Link
            className="brand flex flex-row items-center gap-2.5 no-underline text-d1fg font-display font-bold text-[1.05rem] whitespace-nowrap shrink-0"
            to="/#start"
          >
            <svg className="mark w-[34px] h-[34px] shrink-0" viewBox="0 0 40 40" aria-hidden="true">
              <path
                d="M20 5 34 33H6z"
                fill="none"
                stroke="#0B1A33"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="27" r="2.6" fill="#1F6FEB" />
            </svg>
            <span className="txt font-bold hidden sm:inline">
              Delta One <span className="vip text-d1blue-ink">VIP</span>
            </span>
          </Link>

          {/* Progress Steps (1 Watch, 2 Read, 3 Try) */}
          <div className="prog !h-full flex flex-row items-center gap-1.5 mx-auto shrink-0" aria-label="Progress">
            <a
              href="#watch"
              data-step="1"
              className={`inline-flex flex-row items-center gap-2 no-underline text-d1muted font-semibold text-[0.82rem] py-1.5 pl-1.5 pr-3 rounded-full border border-d1line bg-d1surface whitespace-nowrap transition-colors ${
                stepsDone[1] ? 'done text-d1green border-d1green' : ''
              }`}
            >
              <span className="n w-[26px] h-[26px] rounded-full flex items-center justify-center text-white text-[0.8rem] font-display font-bold bg-[#1F6FEB]">
                <span>1</span>
              </span>
              <span className="t hidden min-[1160px]:inline">Watch</span>
            </a>
            <a
              href="#read"
              data-step="2"
              className={`inline-flex flex-row items-center gap-2 no-underline text-d1muted font-semibold text-[0.82rem] py-1.5 pl-1.5 pr-3 rounded-full border border-d1line bg-d1surface whitespace-nowrap transition-colors ${
                stepsDone[2] ? 'done text-d1green border-d1green' : ''
              }`}
            >
              <span className="n w-[26px] h-[26px] rounded-full flex items-center justify-center text-white text-[0.8rem] font-display font-bold bg-[#0FB5A4]">
                <span>2</span>
              </span>
              <span className="t hidden min-[1160px]:inline">Read</span>
            </a>
            <a
              href="#try"
              data-step="3"
              className={`inline-flex flex-row items-center gap-2 no-underline text-d1muted font-semibold text-[0.82rem] py-1.5 pl-1.5 pr-3 rounded-full border border-d1line bg-d1surface whitespace-nowrap transition-colors ${
                stepsDone[3] ? 'done text-d1green border-d1green' : ''
              }`}
            >
              <span className="n w-[26px] h-[26px] rounded-full flex items-center justify-center text-d1fg text-[0.8rem] font-display font-bold bg-[#FFB400]">
                <span>3</span>
              </span>
              <span className="t hidden min-[1160px]:inline">Try</span>
            </a>
            <span className="pc text-[0.8rem] text-d1muted ml-1 font-mono hidden" id="pcount">
              {doneCount} / 3
            </span>
          </div>

          {/* Language Selector */}
          <label className="langpick inline-flex flex-row items-center m-0 ml-1 sm:ml-2 shrink-0">
            <span className="hidden">Language</span>
            <select
              id="lang"
              aria-label="Language of this page"
              value={currentLang}
              onChange={(e) => onLangChange && onLangChange(e.target.value)}
              className="min-h-[40px] h-10 bg-d1surface text-d1fg border border-d1line rounded-[10px] px-2 text-[0.82rem] font-semibold font-sans cursor-pointer max-w-[90px] sm:max-w-[140px] md:max-w-[170px] box-border focus-visible:outline-2 focus-visible:outline-d1gold"
            >
              <option value="en">English</option>
              <option value="ko">한국어 · Korean</option>
              <option value="ja">日本語 · Japanese</option>
              <option value="zh-Hans">简体中文 · Chinese (Simplified, Mandarin)</option>
              <option value="zh-Hant">繁體中文 · Chinese (Traditional, for Cantonese readers)</option>
              <option value="es">Español · Spanish</option>
              <option value="pt">Português · Portuguese</option>
              <option value="fr">Français · French</option>
              <option value="it">Italiano · Italian</option>
              <option value="hu">Magyar · Hungarian</option>
              <option value="ru">Русский · Russian</option>
              <option value="af">Afrikaans · Afrikaans</option>
              <option value="ms">Bahasa Melayu · Malay (Malaysia &amp; Singapore)</option>
              <option value="id">Bahasa Indonesia · Indonesian</option>
              <option value="th">ไทย · Thai</option>
              <option value="hi">हिन्दी · Hindi</option>
              <option value="bn">বাংলা · Bengali</option>
              <option value="ar">العربية · Arabic</option>
              <option value="ur">اردو · Urdu</option>
              <option value="uk">Українська · Ukrainian</option>
            </select>
          </label>

          {/* Theme Toggle (Light / Dark) */}
          <ThemeToggle />

          {/* Aria Walkthrough Launcher */}
          <button
            type="button"
            className="aria-btn wt-start inline-flex flex-row items-center gap-2 min-h-[40px] h-10 !px-1 sm:px-3.5 rounded-full border border-d1line bg-d1surface text-d1fg font-sans font-semibold text-[0.82rem] cursor-pointer whitespace-nowrap shrink-0 box-border hover:border-d1blue transition-colors"
            onClick={onStartWalkthrough}
          >
            <img src="/img/host.svg" alt="" className="w-[26px] h-[26px] rounded-full shrink-0" />
            {/* <span className="hidden min-[920px]:inline">Aria, walk me through</span> */}
          </button>

          {/* My Dashboard link (shown for VIP) */}
          <Link
            className="hbtn pro inline-flex flex-row items-center gap-1 min-h-[40px] h-10 px-3 sm:px-3.5 rounded-full border border-d1blue bg-d1surface text-d1blue-ink font-sans font-bold text-[0.82rem] no-underline whitespace-nowrap shrink-0 box-border hover:brightness-95 transition-all"
            id="hdr-pro"
            to="/pro"
            hidden={plan !== 'vip'}
          >
            <span className="t hidden min-[920px]:inline">My dashboard ↗</span>
            <span className="s inline min-[920px]:hidden">Dashboard</span>
          </Link>

          {/* Go VIP Upgrade Button (shown for Free) */}
          <a
            className="hbtn gold inline-flex flex-row items-center gap-1 min-h-[40px] h-10 px-3 sm:px-3.5 rounded-full border-0 bg-[var(--gold-grad)] text-d1fg font-sans font-bold text-[0.82rem] no-underline whitespace-nowrap shrink-0 box-border shadow-[0_4px_14px_rgba(255,180,0,0.35)] hover:brightness-95 transition-all"
            id="hdr-upgrade"
            href="#upgrade"
            hidden={plan === 'vip'}
            onClick={(e) => {
              if (onUpgradeClick) {
                e.preventDefault();
                onUpgradeClick();
              }
            }}
          >
            <span className="t hidden min-[920px]:inline">Go VIP</span>
            <span className="t2 hidden min-[1120px]:inline">&nbsp;· 99 USDT/month</span>
            <span className="s inline min-[920px]:hidden">VIP</span>
          </a>
        </div>
      </nav>

      {/* App Nav Section Bar */}
      <nav
        className="appnav sticky top-[68px] z-[39] bg-[var(--topbar)] backdrop-blur-md border-b border-d1line w-full box-border"
        id="appnav"
        aria-label="Sections of this page"
      >
        <div className="wrap flex flex-row items-center gap-2 min-h-[46px] h-[46px] max-w-[1160px] mx-auto px-6 overflow-x-auto box-border [scrollbar-width:none]">
          <a
            href="#members"
            data-nav="members"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full no-underline text-d1muted font-sans font-semibold text-[0.84rem] whitespace-nowrap border border-transparent transition-colors hover:text-d1fg hover:border-d1line hover:bg-d1surface ${
              activeNav === 'members' ? 'is-on text-d1blue-ink border-d1blue bg-d1surface font-bold' : ''
            }`}
          >
            🙋 Customers
          </a>
          <a
            href="#distributors"
            data-nav="distributors"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full no-underline text-d1muted font-sans font-semibold text-[0.84rem] whitespace-nowrap border border-transparent transition-colors hover:text-d1fg hover:border-d1line hover:bg-d1surface ${
              activeNav === 'distributors' ? 'is-on text-d1blue-ink border-d1blue bg-d1surface font-bold' : ''
            }`}
          >
            🧭 Distributors
          </a>
          <a
            href="#check"
            data-nav="check"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full no-underline text-d1muted font-sans font-semibold text-[0.84rem] whitespace-nowrap border border-transparent transition-colors hover:text-d1fg hover:border-d1line hover:bg-d1surface ${
              activeNav === 'check' ? 'is-on text-d1blue-ink border-d1blue bg-d1surface font-bold' : ''
            }`}
          >
            Quiz
          </a>
          <a
            href="#support"
            data-nav="support"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full no-underline text-d1muted font-sans font-semibold text-[0.84rem] whitespace-nowrap border border-transparent transition-colors hover:text-d1fg hover:border-d1line hover:bg-d1surface ${
              activeNav === 'support' ? 'is-on text-d1blue-ink border-d1blue bg-d1surface font-bold' : ''
            }`}
          >
            Help
          </a>
        </div>
      </nav>
    </>
  );
}
