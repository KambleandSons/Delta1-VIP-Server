// Complete internationalization engine matching original Delta One VIP design

const SEL = ".hero .eyebrow, .hero h1, .hero-lede, .window, .btn, .section-title, .section-lede, .group-head h2, .group-head p, .doc-tag, .doc h3, .plain, .plain-who, .more summary, .doc-desc, .doc-specs, .know h3, .know p, .legend span, .split div, .need-table td, .need-table th, .langs th, .notes h2, .notes p, .peak strong, .peak span, .tour-steps .tt, .tour-kicker, .tour-stop h3, .tour-why, .tour-lf, .tour-look .pg span, .tour-look .plain, .tour-say, .wt-cta p, footer p, #lang-note, .jump a, .goals li, .goals-t, .kicker, .step-foot p, .film-cap h3, .film-cap p, .tile b, .tile .tl, .motto, .motto span, .q h3, .opt, .why, .qn, .teach-box p, .model p, .review-when, .review-due b, .review-due span, .prog .t, .aria-btn span, .tool h3, .tool p, .vbar .btn, .vbar option, .ready-badge, .brand .txt, #qresult, #review-result, .ex, .rd, .live .lt, #zoom-fab .lt, .sup-t, .sup-s, .ask-note, .ask-drawer-top b, .ask-fab .t, label.sr, .lao, .lao span, .hbtn .t, .hbtn .t2, .ps-tag, .ps-t, .vip-lock-card h3, .vip-lock-card p, .upsell-in h2, .upsell-list li, .upsell-in .ask-note, .pr-badge, .pr-head h3, .pr-line, .pr-bar span, .pr-grid li, .pr-grid p, .pr-blend, .pr-more, #upsell-later, .aria-say p, .cert-in p, .cert-in h3, .cert-start label, .cert-top .qn, .cert-q h3, .cert-miss b, .cert-miss p, .course h3, .course .plain, .course-meta p, .lesson h4, .lesson p, .course-top h3, .course-foot";
const TSEL = ".doc-specs, .tour-kicker, .btn, .tour-count";
const I18N = ["Delta_One_Momentum_Plan_Simple_Words", "Delta_One_Module_Key_Facts"];
const RTL = ["ar", "ur"];
const NOTE = "Documents available in this language: The Plan in Simple Words and the Module Key Facts. Every other document opens in English. Translations are drafts awaiting native-speaker review.";

const uiCache = {};
const vipCache = {};
let observer = null;
let currentCode = 'en';
let currentDict = {};

function norm(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function hasSvg(el) {
  return !!el.querySelector('svg');
}

function textOf(el) {
  let t = '';
  el.childNodes.forEach((n) => {
    if (n.nodeType === 3) t += n.nodeValue;
  });
  return norm(t);
}

function setText(el, s) {
  let done = false;
  el.childNodes.forEach((n) => {
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
  return s.replace(/\d[\d.,]*/g, () => '{n' + (++i) + '}');
}

function nums(s) {
  return s.match(/\d[\d.,]*/g) || [];
}

function fill(t, ns) {
  return t.replace(/\{n(\d+)\}/g, (_, k) => ns[+k - 1] || '');
}

function els(root = document) {
  const list = Array.prototype.slice.call(root.querySelectorAll(SEL));
  if (root !== document && root.matches && root.matches(SEL)) {
    list.unshift(root);
  }
  return list;
}

function remember(root = document) {
  els(root).forEach((el) => {
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

  const unescaped = k.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  if (dict[unescaped]) return dict[unescaped];

  const escaped = k.replace(/&/g, '&amp;');
  if (dict[escaped]) return dict[escaped];

  if (el.matches(TSEL)) {
    const t = tpl(k);
    if (dict[t]) return fill(dict[t], nums(k));
    const tUnescaped = tpl(unescaped);
    if (dict[tUnescaped]) return fill(dict[tUnescaped], nums(k));
  }
  return null;
}

function put(el, s) {
  if (el.dataset.svg) {
    setText(el, s);
  } else {
    el.innerHTML = s;
  }
}

function swapDocs(code) {
  Array.prototype.forEach.call(document.querySelectorAll('[data-file]'), (b) => {
    const f = b.dataset.file0 || (b.dataset.file0 = b.dataset.file);
    const n = b.dataset.name0 || (b.dataset.name0 = b.dataset.name || '');
    const stem = I18N.find((s) => f === 'docs/' + s + '.pdf' || f === '/' + 'docs/' + s + '.pdf');
    if (!stem) return;
    if (code === 'en') {
      b.dataset.file = f;
      if (n) b.dataset.name = n;
    } else {
      b.dataset.file = 'docs/i18n/' + stem + '_' + code + '.pdf';
      if (n) b.dataset.name = stem + '_' + code + '.pdf';
    }
  });
}

function translateContainer(root, code, dict) {
  if (!root || !root.querySelectorAll) return;
  remember(root);
  const elements = els(root);
  elements.forEach((el) => {
    const k = el.dataset.en;
    if (k === undefined) return;
    if (code === 'en') {
      put(el, k);
      return;
    }
    const v = lookup(el, dict);
    if (v) put(el, v);
  });
}

export function applyLanguage(code, dict, vipData = null) {
  currentCode = code;
  currentDict = dict || {};

  window.D1LANG = {
    code,
    dict: currentDict,
    translateIn: (subRoot) => translateContainer(subRoot, code, currentDict),
  };

  window.VIPL = {
    code,
    data: vipData,
  };

  // Remember English keys across the page first
  remember(document);

  // Apply translations to all matching elements
  els(document).forEach((el) => {
    const k = el.dataset.en;
    if (k === undefined) return;
    if (code === 'en') {
      put(el, k);
      return;
    }
    const v = lookup(el, currentDict);
    if (v) put(el, v);
  });

  // Update HTML tag lang and dir
  document.documentElement.lang = code;
  document.documentElement.dir = RTL.includes(code) ? 'rtl' : 'ltr';

  // Swap documents
  swapDocs(code);

  // Update note under hero
  const note = document.getElementById('lang-note');
  if (note) {
    note.textContent = code === 'en' ? '' : (currentDict[NOTE] || NOTE);
  }

  // Dispatch custom event for sub-systems
  document.dispatchEvent(new CustomEvent('d1lang', { detail: code }));
}

export async function changeLanguage(code) {
  remember(document);

  if (code === 'en') {
    applyLanguage('en', {}, null);
    try { localStorage.setItem('d1lang', 'en'); } catch {}
    return;
  }

  try {
    let uiData = uiCache[code];
    let vipData = vipCache[code];

    if (!uiData) {
      const res = await fetch(`/i18n/ui_${code}.json`);
      if (res.ok) {
        uiData = await res.json();
        uiCache[code] = uiData;
      }
    }

    if (!vipData) {
      try {
        const vRes = await fetch(`/i18n/vip_${code}.json`);
        if (vRes.ok) {
          vipData = await vRes.json();
          vipCache[code] = vipData;
        }
      } catch {}
    }

    if (uiData) {
      applyLanguage(code, uiData, vipData);
      try { localStorage.setItem('d1lang', code); } catch {}
    } else {
      const note = document.getElementById('lang-note');
      if (note) {
        note.textContent = 'This language is still being prepared. The documents in it are in the table below.';
      }
    }
  } catch (err) {
    console.error('Failed to change language:', err);
    const note = document.getElementById('lang-note');
    if (note) {
      note.textContent = 'This language is still being prepared. The documents in it are in the table below.';
    }
  }
}

export function initTranslationObserver() {
  if (observer || typeof window === 'undefined') return;

  // Set initial English baseline
  remember(document);

  // Set up mutation observer to automatically translate any newly mounted dynamic React DOM chunks
  observer = new MutationObserver((mutations) => {
    if (currentCode === 'en' || !currentDict) return;
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          translateContainer(node, currentCode, currentDict);
        }
      }
    }
  });

  const root = document.getElementById('root') || document.body;
  observer.observe(root, { childList: true, subtree: true });
}
