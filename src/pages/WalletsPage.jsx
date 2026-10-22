import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DATA, UI, LANGS } from '../data/walletsData';
import '../styles/wallets.css';

const WALLETS = [
  { w: 'TokenPocket', ids: ['tp1', 'tp2', 'tp3', 'tp4', 'tp5'] },
  { w: 'MetaMask', ids: ['mm1', 'mm2', 'mm3', 'mm4', 'mm5'] },
  { w: 'Trust Wallet', ids: ['tw1', 'tw2', 'tw3', 'tw4', 'tw5'] }
];

const RTL = new Set(['ar', 'ur']);

const VOICE = {
  en: 'en-GB',
  es: 'es',
  pt: 'pt-BR',
  fr: 'fr-FR',
  it: 'it-IT',
  hu: 'hu-HU',
  ru: 'ru-RU',
  uk: 'uk-UA',
  af: 'af-ZA',
  ms: 'ms-MY',
  id: 'id-ID',
  ko: 'ko-KR',
  ja: 'ja-JP',
  'zh-Hans': 'zh-CN',
  'zh-Hant': 'zh-HK',
  th: 'th-TH',
  hi: 'hi-IN',
  bn: 'bn-IN',
  ar: 'ar-SA',
  ur: 'ur-PK'
};

const SITE = {
  TokenPocket: ['tokenpocket.pro', 'TP Global Ltd.'],
  MetaMask: ['metamask.io', 'MetaMask Web3 Wallet'],
  'Trust Wallet': ['trustwallet.com', 'DApps Platform, Inc.']
};

const byId = Object.fromEntries(DATA.lessons.map(l => [l.id, l]));

function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function fmt(s) {
  const sec = Math.round(s || 0);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

export default function WalletsPage() {
  const location = useLocation();

  // State
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('d1w_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  const [wallet, setWallet] = useState(() => {
    try {
      return localStorage.getItem('d1w_wallet') || 'TokenPocket';
    } catch (e) {
      return 'TokenPocket';
    }
  });

  const [cur, setCur] = useState(() => {
    const hash = (window.location.hash || '').replace(/^#/, '');
    if (hash && byId[hash]) return hash;
    try {
      return localStorage.getItem('d1w_lesson') || 'g1';
    } catch (e) {
      return 'g1';
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speak, setSpeak] = useState(() => {
    try {
      return localStorage.getItem('d1w_voice') === '1';
    } catch (e) {
      return false;
    }
  });

  // Refs
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const ovRef = useRef(null);
  const lastStepRef = useRef('-1');

  const currentLesson = byId[cur] || byId.g1;

  // Localized string helper
  const S = useCallback((k) => {
    return (DATA.strings[lang] && DATA.strings[lang][k]) || DATA.strings.en[k] || '';
  }, [lang]);

  const U = useCallback((idx) => {
    return (UI[lang] || UI.en)[idx];
  }, [lang]);

  const lessonLabel = useCallback((L) => {
    return L.label ? S(L.label) : S('lesson').replace('{n}', L.n);
  }, [S]);

  // Handle Hash Changes
  useEffect(() => {
    const hash = (location.hash || '').replace(/^#/, '');
    if (hash && byId[hash] && hash !== cur) {
      loadLesson(hash, isPlaying);
    }
  }, [location.hash]);

  // Load lesson
  const loadLesson = (id, shouldPlay = false) => {
    setCur(id);
    try {
      localStorage.setItem('d1w_lesson', id);
      window.history.replaceState(null, '', `#${id}`);
    } catch (e) {}

    const L = byId[id];
    if (L && L.w !== 'Delta One') {
      setWallet(L.w);
      try {
        localStorage.setItem('d1w_wallet', L.w);
      } catch (e) {}
    }

    if (videoRef.current) {
      videoRef.current.src = `/wallets/v/${id}.mp4`;
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      lastStepRef.current = '-1';
      if (shouldPlay) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Switch wallet
  const handleWalletTab = (wName) => {
    setWallet(wName);
    try {
      localStorage.setItem('d1w_wallet', wName);
    } catch (e) {}
    const wObj = WALLETS.find(x => x.w === wName);
    if (wObj && wObj.ids.length > 0) {
      loadLesson(wObj.ids[0], isPlaying);
    }
  };

  // Switch Language
  const handleLangChange = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('d1w_lang', newLang);
    } catch (e) {}
    lastStepRef.current = '-1';
  };

  // Toggle Read Aloud
  const handleToggleVoice = () => {
    const nextVal = !speak;
    setSpeak(nextVal);
    try {
      localStorage.setItem('d1w_voice', nextVal ? '1' : '0');
    } catch (e) {}
    if (videoRef.current) {
      videoRef.current.volume = nextVal ? 0.25 : 1;
    }
    if (!nextVal && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    lastStepRef.current = '-1';
  };

  // Step calculation
  const stepAt = useCallback((L, t) => {
    let idx = 0;
    for (let k = 0; k < L.steps.length; k++) {
      if (t >= L.steps[k].s - 0.01) idx = k;
    }
    return idx;
  }, []);

  const revealAt = useCallback((st, t) => {
    let j = 0;
    (st.rv || [0]).forEach((r, k) => {
      if (t >= st.s + r - 0.01) j = k;
    });
    return j;
  }, []);

  // Speech utterance text
  const speakText = useCallback((L, i) => {
    const st = L.steps[i];
    let t = '';
    if (st.k === 't') t = S(L.title);
    else if (st.k === 'e') t = `${S(st.x)}. ${S('end_safety')}`;
    else t = S(st.t);
    return t.replace(/0x[0-9a-fA-F]{40}/g, '').replace(/[•✓▲△→←]/g, '');
  }, [S]);

  // Teach overlay HTML
  const teachHTML = useCallback((st, L, j, isRtl) => {
    const R = r => (r <= j ? '' : ' h');
    const rtlClass = isRtl ? ' rtl' : '';

    if (st.p === 'gas') {
      return (
        `<div class="ct big fit${R(0)}" data-max="80" style="top:112px;font-size:60px">${esc(S('teach_gas_title'))}</div>` +
        `<div class="ct fit${R(0)}" data-max="118" style="top:200px;font-size:29px;line-height:1.3;color:#dfe6f3">${esc(S('teach_gas_def'))}</div>` +
        `<div class="trow${rtlClass}${R(1)}" style="top:332px;height:150px"><span class="coin c-usdt" style="width:104px;height:104px;font-size:52px">T</span><div class="fit" data-max="112"><b>USDT</b><span>${esc(S('teach_gas_usdt'))}</span></div></div>` +
        `<div class="trow${rtlClass}${R(2)}" style="top:500px;height:186px"><span class="coin c-bnb" style="width:104px;height:104px;font-size:52px">B</span><div class="fit" data-max="150"><b>BNB</b><span>${esc(S('teach_gas_bnb'))}</span><span class="wl">${esc(S('teach_gas_nobnb'))}</span></div></div>` +
        `<div class="gbox${rtlClass}${R(3)}" style="top:706px;height:272px"><div class="fit" data-max="232"><h4>${esc(S('teach_gas_get'))}</h4><p><i>1</i><span>${esc(S('teach_gas_buy'))}</span></p><p><i>2</i><span>${esc(S('teach_gas_ex'))}</span></p></div></div>`
      );
    }
    if (st.p === 'paper') {
      const items = [
        ['📷', 'teach_no_photos'],
        ['📱', 'teach_no_screens'],
        ['💬', 'teach_no_messages']
      ];
      return (
        `<div class="ct big fit${R(0)}" data-max="78" style="top:110px;font-size:50px">${esc(S('teach_paper_title'))}</div>` +
        `<div class="exl${R(0)}"><span>${esc(S('teach_paper_example'))}</span></div>` +
        `<div class="nos${rtlClass}${R(1)}">` +
        items.map(([e, k]) => `<div class="no"><div class="e">${e}</div><div class="fit" data-max="66">${esc(S(k))}</div></div>`).join('') +
        `</div>` +
        `<div class="ban${rtlClass}${R(2)}"><span class="e">🔒</span><div class="fit" data-max="116">${esc(S('teach_paper_private'))}</div></div>`
      );
    }
    if (st.p === 'privacy') {
      const checks = [
        [1, 'teach_privacy_1'],
        [2, 'teach_privacy_2'],
        [3, 'teach_privacy_3']
      ];
      return (
        `<div class="ct" style="top:108px"><span class="pill">1 · ${esc(S('teach_privacy'))}</span></div>` +
        `<div class="ct fit" data-max="118" style="top:184px;font-size:46px;font-weight:800;line-height:1.2">${esc(S('teach_privacy_title'))}</div>` +
        `<div class="ill"><div style="position:absolute;left:150px;top:0;font-size:250px;line-height:1">📱</div><div style="position:absolute;left:300px;top:110px;font-size:190px;line-height:1;transform:rotate(-12deg)">🤚</div>` +
        `<div style="position:absolute;left:520px;top:10px;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,.08);font-size:76px;line-height:140px;text-align:center">👀<div style="position:absolute;inset:0;border:9px solid #e74c3c;border-radius:50%;background:linear-gradient(45deg,transparent 46%,#e74c3c 46% 54%,transparent 54%)"></div></div></div>` +
        checks.map(([n, k]) => `<div class="chk${rtlClass}${R(n)}" style="top:${660 + (n - 1) * 104}px"><i>✓</i><span class="fit" data-max="84">${esc(S(k))}</span></div>`).join('')
      );
    }
    if (st.p === 'install') {
      const [site, dev] = SITE[L.w] || ['', ''];
      return (
        `<div class="ct fit" data-max="80" style="top:118px;font-size:48px;font-weight:800">${esc(S('teach_install_only'))}</div>` +
        [['📲', 'App Store'], ['📲', 'Google Play'], ['🌐', site]]
          .map(([e, nm], n) => `<div class="tile" style="top:${214 + n * 128}px"><span class="e">${e}</span><b>${esc(nm)}</b><span class="ok">✓</span></div>`)
          .join('') +
        `<div class="gbox${R(1)}" style="top:640px;height:230px;text-align:center"><div class="fit" data-max="190"><h4 style="color:#dfe6f3;font-weight:700">${esc(S('teach_install_dev'))}</h4><div style="font-size:46px;font-weight:900;color:#E8B64C;margin-top:14px">${esc(dev)} <span class="ok" style="display:inline-block;vertical-align:middle">✓</span></div></div></div>`
      );
    }
    return '';
  }, [S]);

  // Overlay HTML Generator
  const overlayHTML = useCallback((L, i, j) => {
    const st = L.steps[i];
    const isRtl = RTL.has(lang);
    const d = isRtl ? ' dir="rtl"' : '';
    const hdr = `<div class="hdr"${d}><b>${esc(L.w)}</b> · ${esc(lessonLabel(L))} — ${esc(S(L.title))}</div>`;

    if (st.k === 't') {
      return `<div class="ttl${L.cover ? ' cv' : ''}"${d}><div class="ser">${esc(S('series'))}</div><div class="wal">${esc(L.w)}</div><div class="les">${esc(lessonLabel(L))}</div><div class="lt">${esc(S(L.title))}</div></div>`;
    }
    if (st.k === 'e') {
      return `<div class="end"${d}><div class="nx">${esc(S(st.x))}</div><div class="sf">${esc(S('end_safety'))}</div><div class="lg">${esc(S('end_legal'))}</div></div>`;
    }
    if (st.k === 'n') {
      return `${hdr}<div class="note"${d}><div class="badge">${st.n}</div><div class="nt">${esc(S(st.t))}</div></div>`;
    }
    const card = `<div class="card"${d}><div class="badge">${st.n}</div><div class="txt">${esc(S(st.t))}</div></div>`;
    if (st.k === 'p') {
      return `${hdr}${teachHTML(st, L, j, isRtl)}${card}`;
    }
    const skey = String(st.t || '').startsWith('d1_') ? 'source_d1' : st.ill ? `source_ill_${L.w}` : L.src;
    const tag = st.tag ? `<div class="tag">${esc(st.tag[0])} · ${esc(S(st.tag[1]).toUpperCase())}</div>` : '';
    return `${hdr}${tag}${card}<div class="src">${esc(S(skey))}</div>`;
  }, [lang, lessonLabel, S, teachHTML]);

  // Fit text to box
  const fitText = (ov) => {
    if (!ov) return;
    ov.querySelectorAll('.txt').forEach(t => {
      let s = 36;
      t.style.fontSize = `${s}px`;
      while (t.scrollHeight > 212 && s > 20) {
        s--;
        t.style.fontSize = `${s}px`;
      }
    });
    ov.querySelectorAll('.nt').forEach(t => {
      let s = 58;
      const box = t.parentElement;
      t.style.fontSize = `${s}px`;
      while (box && t.scrollHeight > box.clientHeight - 110 && s > 26) {
        s--;
        t.style.fontSize = `${s}px`;
      }
    });
    ov.querySelectorAll('.nx,.lt').forEach(t => {
      let s = parseFloat(window.getComputedStyle(t).fontSize);
      while (t.scrollHeight > t.clientHeight + Math.max(4, 0.5 * s) && s > 22) {
        s--;
        t.style.fontSize = `${s}px`;
      }
    });
    ov.querySelectorAll('.fit').forEach(t => {
      const mx = +t.dataset.max;
      let g = 40;
      while (t.scrollHeight > mx && g-- > 0) {
        for (const e of [t, ...t.querySelectorAll('*')]) {
          const fs = parseFloat(window.getComputedStyle(e).fontSize);
          e.style.fontSize = `${fs * 0.95}px`;
        }
      }
    });
    ov.querySelectorAll('.hdr').forEach(t => {
      let s = 24;
      while (t.scrollWidth > t.clientWidth + 1 && s > 17) {
        s--;
        t.style.fontSize = `${s}px`;
      }
    });
  };

  // Scale Overlay to Stage
  const scaleOv = useCallback(() => {
    if (!stageRef.current || !ovRef.current) return;
    const w = stageRef.current.clientWidth;
    const h = stageRef.current.clientHeight;
    const k = Math.max(w / 720, h / 1280);
    ovRef.current.style.transform = `translate(${(w - 720 * k) / 2}px, ${(h - 1280 * k) / 2}px) scale(${k})`;
  }, []);

  // Update sync overlay & playback
  const sync = useCallback((force = false) => {
    const L = currentLesson;
    const v = videoRef.current;
    if (!v || !ovRef.current) return;

    const t = v.currentTime || 0;
    setCurrentTime(t);

    const i = stepAt(L, t);
    const j = revealAt(L.steps[i], t);
    const key = `${i}:${j}`;

    if (key !== lastStepRef.current || force) {
      const newStep = String(lastStepRef.current).split(':')[0] !== String(i);
      ovRef.current.innerHTML = overlayHTML(L, i, j);
      fitText(ovRef.current);
      lastStepRef.current = key;

      if (!newStep && !force) return;

      if (speak && !v.paused && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = speakText(L, i);
        if (textToSpeak) {
          const u = new SpeechSynthesisUtterance(textToSpeak);
          u.lang = VOICE[lang] || lang;
          const vs = window.speechSynthesis.getVoices();
          const m =
            vs.find(x => x.lang && x.lang.toLowerCase().startsWith(u.lang.toLowerCase())) ||
            vs.find(x => x.lang && x.lang.toLowerCase().startsWith(u.lang.slice(0, 2).toLowerCase()));
          if (m) u.voice = m;
          u.rate = 0.95;
          window.speechSynthesis.speak(u);
        }
      }
    }
  }, [currentLesson, stepAt, revealAt, overlayHTML, speak, speakText, lang]);

  // Responsive stage observer
  useEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver(() => {
      scaleOv();
    });
    ro.observe(stageRef.current);
    scaleOv();
    return () => ro.disconnect();
  }, [scaleOv]);

  // Animation frame loop when playing
  useEffect(() => {
    let animId;
    const tick = () => {
      if (videoRef.current && !videoRef.current.paused) {
        sync(false);
        animId = requestAnimationFrame(tick);
      }
    };
    if (isPlaying) {
      animId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, sync]);

  // Initial load
  useEffect(() => {
    loadLesson(cur, false);
    scaleOv();
  }, []);

  // Controls
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const seekStep = (delta) => {
    const L = currentLesson;
    const v = videoRef.current;
    if (!v) return;
    const i = Math.min(L.steps.length - 1, Math.max(0, stepAt(L, v.currentTime) + delta));
    v.currentTime = L.steps[i].s + 0.4;
    lastStepRef.current = '-1';
    sync(true);
  };

  const handleProgressClick = (e) => {
    const v = videoRef.current;
    if (!v || !currentLesson) return;
    const r = e.currentTarget.getBoundingClientRect();
    const f = (e.clientX - r.left) / r.width;
    v.currentTime = Math.max(0, Math.min(1, f)) * (currentLesson.dur || 1);
    lastStepRef.current = '-1';
    sync(true);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    const W = WALLETS.find(x => x.ids.includes(cur));
    if (W) {
      const k = W.ids.indexOf(cur);
      if (k < W.ids.length - 1) {
        loadLesson(W.ids[k + 1], true);
      }
    }
  };

  // Progress metrics
  const activeStepIdx = stepAt(currentLesson, currentTime);
  const activeStep = currentLesson.steps[activeStepIdx];
  const countedSteps = currentLesson.steps.filter(s => s.n).length;
  const currentStepNum = activeStep ? activeStep.n : null;
  const progressPercent = ((currentTime / (currentLesson.dur || 1)) * 100).toFixed(2);

  const activeWalletObj = WALLETS.find(x => x.w === wallet) || WALLETS[0];

  return (
    <div className="wlt-page" dir={RTL.has(lang) ? 'rtl' : 'ltr'}>
      {/* Top Nav Header */}
      <div className="wlt-nav-back">
        <Link to="/" className="wlt-back-link">
          ← Back to Delta One VIP
        </Link>
        <div style={{ color: 'var(--wlt-mist)', fontSize: '13px' }}>
          17 Lessons & Guides
        </div>
      </div>

      <div className="wlt-wrap" id="wlt-app">
        {/* Header Top */}
        <header className="wlt-top">
          <div className="wlt-brand">
            <svg width="46" height="46" viewBox="0 0 100 100" aria-hidden="true">
              <polygon points="50,8 94,86 6,86" fill="none" stroke="#e8b64c" strokeWidth="5" />
              <polygon points="50,36 72,76 28,76" fill="#e8b64c" />
            </svg>
            <div>
              <div className="wlt-wm">Delta One</div>
              <h1>Wallet Guides</h1>
              <p>{S('series')}</p>
            </div>
          </div>

          <div className="wlt-controls">
            <label htmlFor="wlt-lang">{U(3)}</label>
            <select
              id="wlt-lang"
              value={lang}
              onChange={(e) => handleLangChange(e.target.value)}
            >
              {LANGS.map(c => (
                <option key={c} value={c}>
                  {(DATA.strings[c] && DATA.strings[c]._lang) || c}
                </option>
              ))}
            </select>
            <button
              id="wlt-voice"
              type="button"
              aria-pressed={speak ? 'true' : 'false'}
              onClick={handleToggleVoice}
            >
              {U(0)}
            </button>
          </div>
        </header>

        {/* 2-Column Grid */}
        <div className="wlt-grid">
          {/* Left Column: Player */}
          <section className="wlt-player" aria-label="Player">
            <div className="wlt-stage" id="wlt-stage" ref={stageRef}>
              <video
                id="wlt-vid"
                ref={videoRef}
                playsInline
                preload="metadata"
                onPlay={() => {
                  setIsPlaying(true);
                  if (videoRef.current) {
                    videoRef.current.volume = speak ? 0.25 : 1;
                  }
                  lastStepRef.current = '-1';
                  sync(true);
                }}
                onPause={() => {
                  setIsPlaying(false);
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                onTimeUpdate={() => sync(false)}
                onEnded={handleVideoEnded}
              />
              <div className="wlt-ov" id="wlt-ov" ref={ovRef} />
            </div>

            {/* Playback Control Bar */}
            <div className="wlt-bar">
              <button
                type="button"
                id="wlt-prev"
                aria-label="Previous step"
                onClick={() => seekStep(-1)}
              >
                ◀◀
              </button>
              <button
                type="button"
                id="wlt-play"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={togglePlay}
              >
                {isPlaying ? '❚❚' : '▶'}
              </button>
              <button
                type="button"
                id="wlt-next"
                aria-label="Next step"
                onClick={() => seekStep(1)}
              >
                ▶▶
              </button>
              <div
                className="wlt-prog"
                role="slider"
                aria-label="Position"
                tabIndex={0}
                onClick={handleProgressClick}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') seekStep(1);
                  if (e.key === 'ArrowLeft') seekStep(-1);
                }}
              >
                <i className="wlt-progi" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="wlt-stepno">
                {currentStepNum ? `${currentStepNum} / ${countedSteps}` : fmt(currentTime)}
              </span>
            </div>
          </section>

          {/* Right Column: Lessons & Trail */}
          <section className="wlt-side">
            <div>
              <h2>{S('g1_label')}</h2>
              <div className="wlt-starters">
                {['g1', 'g2'].map(id => {
                  const L = byId[id];
                  const isCurrent = cur === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      className="wlt-tile"
                      aria-current={isCurrent ? 'true' : 'false'}
                      onClick={() => loadLesson(id, true)}
                    >
                      <small>
                        {lessonLabel(L)} · {fmt(L.dur)}
                      </small>
                      <strong>{S(L.title)}</strong>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2>{U(2)}</h2>
              <div className="wlt-tabs" role="tablist">
                {WALLETS.map(W => (
                  <button
                    key={W.w}
                    type="button"
                    role="tab"
                    aria-selected={wallet === W.w ? 'true' : 'false'}
                    onClick={() => handleWalletTab(W.w)}
                  >
                    {W.w}
                  </button>
                ))}
              </div>

              {/* Numbered Summit Trail */}
              <ol className="wlt-trail">
                {activeWalletObj.ids.map(id => {
                  const L = byId[id];
                  const isCurrent = cur === id;
                  return (
                    <li key={id} className="wlt-trail-item">
                      <button
                        type="button"
                        aria-current={isCurrent ? 'true' : 'false'}
                        onClick={() => loadLesson(id, true)}
                      >
                        <span className="wlt-num">{L.n}</span>
                        <span className="wlt-lt">
                          <strong>{S(L.title)}</strong>
                          <small>
                            {lessonLabel(L)} · {fmt(L.dur)}
                          </small>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Legal Disclaimer Note */}
            <p className="wlt-note">
              <strong>{S('end_safety')}</strong> {S('end_legal')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
