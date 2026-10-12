import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/quizData';

export default function Navbar() {
  const { theme, toggleTheme, plan, setPlan, stepsDone, lang, setLang, openUpsell } = useApp();
  const done = (n) => stepsDone.includes(n);
  const count = stepsDone.length;

  return (
    <nav className="top" aria-label="Your place in the hallway">
      <div className="wrap">
        <a className="brand" href="#start">
          <svg className="mark" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M20 5 34 33H6z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
            <circle cx="20" cy="27" r="2.6" fill="#1F6FEB" />
          </svg>
          <span className="txt">Delta One <span className="vip">VIP</span></span>
        </a>
        <div className="prog" aria-label="Progress">
          <a href="#step1" data-step="1" className={done(1) ? 'done' : ''}>
            <span className="n"><span>1</span></span>
            <span className="t">Watch</span>
          </a>
          <a href="#step2" data-step="2" className={done(2) ? 'done' : ''}>
            <span className="n"><span>2</span></span>
            <span className="t">Read</span>
          </a>
          <a href="#step3" data-step="3" className={done(3) ? 'done' : ''}>
            <span className="n"><span>3</span></span>
            <span className="t">Do</span>
          </a>
          <span className="pc" id="pcount">{count} / 3</span>
        </div>
        <div className="top-right">
          <label className="langpick">
            <span style={{ display: 'none' }}>Language</span>
            <select id="lang" aria-label="Language of this page" value={lang} onChange={e => setLang(e.target.value)}>
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </label>
          <button type="button" className="mode" id="mode" aria-label="Switch between light and dark" title="Light / dark" onClick={toggleTheme}>
            <svg className="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg>
            <svg className="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            <span className="ml">Light</span><span className="md">Dark</span>
          </button>
          <button type="button" className="aria-btn wt-start">
            <img src="/img/host.svg" alt="" /><span>Aria, walk me through</span>
          </button>
          {/* {plan === 'free' ? ( */}
            <a
              className="hbtn gold"
              id="hdr-upgrade"
              href="#upgrade"
              onClick={(e) => {
                e.preventDefault();
                openUpsell();
              }}
            >
              <span className="t">Go VIP</span>
              <span className="t2">&nbsp;· 99 USDT/month</span>
              <span className="s">VIP</span>
            </a>
          {/* ) : (
            <a className="hbtn pro" id="hdr-pro" href="#" onClick={(e) => e.preventDefault()}>
              <span className="t">My dashboard ↗</span>
              <span className="s">Dashboard</span>
            </a>
          )} */}
          {/* <span className="plan-demo" id="plan-demo" title="Demo: see the page as a free member or as a VIP">
            <button
              type="button"
              data-plan="free"
              className={plan === 'free' ? 'on' : ''}
              onClick={() => setPlan('free')}
            >
              Free
            </button>
            <button
              type="button"
              data-plan="vip"
              className={plan === 'vip' ? 'on' : ''}
              onClick={() => setPlan('vip')}
            >
              VIP
            </button>
          </span> */}
        </div>
      </div>
    </nav>
  );
}

