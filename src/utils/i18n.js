// Delta One VIP - Universal i18n Engine

const SEL = ".hero .eyebrow, .hero h1, .hero-lede, .window, .btn, .section-title, .section-lede, .group-head h2, .group-head p, .doc-tag, .doc h3, .plain, .plain-who, .more summary, .doc-desc, .doc-specs, .know h3, .know p, .legend span, .split div, .need-table td, .need-table th, .langs th, .notes h2, .notes p, .peak strong, .peak span, .tour-steps .tt, .tour-kicker, .tour-stop h3, .tour-why, .tour-lf, .tour-look .pg span, .tour-look .plain, .tour-say, .wt-cta p, footer p, #lang-note, .jump a, .who-card b, .who-card .tl, .hero-note, .block-head .bt, .block-head p, .chip, .strip-card b, .strip-card .tl, .shelf h2, .shelf .cnt, .sh-s, .reel-ch .ck, .reel-ch b, .reel-ch .cl, .tile5 .ep, .tile5 .tc b, .appnav a, .langline .ll, .soon-art span, .goals li, .goals-t, .kicker, .step-foot p, .film-cap h3, .film-cap p, .tile b, .tile .tl, .motto, .motto span, .q h3, .opt, .why, .qn, .teach-box p, .model p, .review-when, .review-due b, .review-due span, .prog .t, .aria-btn span, .tool h3, .tool p, .vbar .btn, .vbar option, .ready-badge, .brand .txt, #qresult, #review-result, .ex, .rd, .live .lt, #zoom-fab .lt, .sup-t, .sup-s, .ask-note, .ask-drawer-top b, .ask-fab .t, label.sr, .lao, .lao span, .hbtn .t, .hbtn .t2, .ps-tag, .ps-t, .vip-lock-card h3, .vip-lock-card p, .upsell-in h2, .upsell-list li, .upsell-in .ask-note, .pr-badge, .pr-head h3, .pr-line, .pr-bar span, .pr-grid li, .pr-grid p, .pr-blend, .pr-more, #upsell-later, .aria-say p, .cert-in p, .cert-in h3, .cert-start label, .cert-top .qn, .cert-q h3, .cert-miss b, .cert-miss p, .course h3, .course .plain, .course-meta p, .lesson h4, .lesson p, .course-top h3, .course-foot";

const TSEL = ".doc-specs, .tour-kicker, .btn, .tour-count, .tile5 .ep, .shelf .cnt, .row-body .more summary, .who-card .tl, .block-head p, .hero-note, .reel-ch .ck, .reel-ch .cl, .sh-s, .strip-card b, .strip-card .tl, .helpgrid p, .langline .ll, .doc-tag, .ps-t";

const I18N = ["Delta_One_Momentum_Plan_Simple_Words", "Delta_One_Module_Key_Facts"];
const RTL = ["ar", "ur"];
const NOTE = "Documents available in this language: The Plan in Simple Words and the Module Key Facts. Every other document opens in English. Translations are drafts awaiting native-speaker review.";

const cache = {};
let currentCode = 'en';
let isApplying = false;
let observer = null;
let debounceTimer = null;

function norm(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function hasSvg(el) {
  return !!el.querySelector('svg');
}

function textOf(el) {
  let t = '';
  el.childNodes.forEach(n => {
    if (n.nodeType === 3) t += n.nodeValue;
  });
  return norm(t);
}

function setText(el, s) {
  let done = false;
  el.childNodes.forEach(n => {
    if (n.nodeType === 3) {
      if (!done) {
        n.nodeValue = s;
        done = true;
      } else {
        n.nodeValue = '';
      }
    }
  });
  if (!done) el.appendChild(document.createTextNode(s));
}

function keyOf(el) {
  return hasSvg(el) ? textOf(el) : norm(el.innerHTML);
}

function tpl(s) {
  let i = 0;
  return s.replace(/\d[\d.,]*/g, () => {
    i += 1;
    return `{n${i}}`;
  });
}

function nums(s) {
  return s.match(/\d[\d.,]*/g) || [];
}

function fill(t, ns) {
  return t.replace(/\{n(\d+)\}/g, (_, k) => ns[+k - 1] || '');
}

function els(root) {
  return Array.prototype.slice.call((root || document).querySelectorAll(SEL));
}

export function remember(root) {
  els(root).forEach(el => {
    if (el.dataset.en === undefined) {
      el.dataset.en = keyOf(el);
      el.dataset.svg = hasSvg(el) ? '1' : '';
    }
  });
}

function lookup(el, dict) {
  const k = el.dataset.en;
  if (!k) return null;
  if (dict[k]) return dict[k];
  if (el.matches && el.matches(TSEL)) {
    const t = tpl(k);
    if (dict[t]) return fill(dict[t], nums(k));
  }
  return null;
}

function swapDocs(code) {
  const docs = document.querySelectorAll('[data-file]');
  Array.prototype.forEach.call(docs, b => {
    const f = b.getAttribute('data-file0') || b.getAttribute('data-file');
    if (!f) return;
    if (!b.getAttribute('data-file0')) b.setAttribute('data-file0', f);
    const n = b.getAttribute('data-name0') || b.getAttribute('data-name') || '';
    if (!b.getAttribute('data-name0') && n) b.setAttribute('data-name0', n);

    const stem = I18N.find(s => f === `docs/${s}.pdf` || f === `light/docs/${s}.pdf`);
    if (!stem) return;
    if (code === 'en') {
      b.setAttribute('data-file', f);
      if (n) b.setAttribute('data-name', n);
    } else {
      const isLight = f.startsWith('light/');
      const prefix = isLight ? 'light/' : '';
      const newFile = `${prefix}docs/i18n/${stem}_${code}.pdf`;
      b.setAttribute('data-file', newFile);
      if (n) b.setAttribute('data-name', `${stem}_${code}.pdf`);
    }
  });
}

function put(el, s) {
  if (el.dataset.svg) {
    setText(el, s);
  } else {
    el.innerHTML = s;
  }
}

function apply(code, dict, root) {
  currentCode = code;
  window.D1LANG = { code, dict };
  isApplying = true;

  try {
    els(root).forEach(el => {
      const k = el.dataset.en;
      if (k === undefined) return;
      if (code === 'en') {
        put(el, k);
        return;
      }
      const v = lookup(el, dict);
      if (v) put(el, v);
    });

    document.documentElement.lang = code;
    document.documentElement.dir = RTL.includes(code) ? 'rtl' : 'ltr';
    swapDocs(code);

    const note = document.getElementById('lang-note');
    if (note) {
      note.textContent = code === 'en' ? '' : (dict[NOTE] || NOTE);
    }

    document.dispatchEvent(new CustomEvent('d1lang', { detail: code }));
  } finally {
    setTimeout(() => {
      isApplying = false;
    }, 50);
  }
}

export async function setLanguage(code, root) {
  currentCode = code;
  try {
    localStorage.setItem('d1lang', code);
  } catch (e) {}

  remember(root);

  if (code === 'en') {
    apply('en', {}, root);
    return;
  }

  if (cache[code]) {
    apply(code, cache[code], root);
    return;
  }

  try {
    const [uiRes, vipRes] = await Promise.all([
      fetch(`/i18n/ui_${code}.json`).then(r => r.ok ? r.json() : {}).catch(() => ({})),
      fetch(`/i18n/vip_${code}.json`).then(r => r.ok ? r.json() : {}).catch(() => ({}))
    ]);

    const merged = { ...uiRes, ...vipRes };
    cache[code] = merged;

    if (currentCode === code) {
      apply(code, merged, root);
    }
  } catch (err) {
    console.error('Translation load error:', err);
    const note = document.getElementById('lang-note');
    if (note) {
      note.textContent = 'This language is still being prepared. The documents in it are in the table below.';
    }
  }
}

export function getCurrentLanguage() {
  try {
    return localStorage.getItem('d1lang') || currentCode || 'en';
  } catch (e) {
    return currentCode || 'en';
  }
}

export function startI18nObserver(targetNode) {
  if (observer) observer.disconnect();

  observer = new MutationObserver(() => {
    if (isApplying || currentCode === 'en' || !cache[currentCode]) return;

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (isApplying || currentCode === 'en' || !cache[currentCode]) return;
      remember(targetNode);
      apply(currentCode, cache[currentCode], targetNode);
    }, 100);
  });

  observer.observe(targetNode || document.body, {
    childList: true,
    subtree: true
  });
}

export function stopI18nObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}
