import React, { useState, useEffect, useMemo, useRef } from 'react';
import certData from '../data/cert-data.json';
import personaData from '../data/persona-data.json';

// Checkpoint 6 Questions
const CHECKPOINT_QUESTIONS = [
  {
    q: "Your friend's contract earns something today. What do you get for each level?",
    opts: [
      "2% of what the contract earns that day",
      "2% of the purchase price",
      "42% of what it earns"
    ],
    ans: 0,
    why: "Two percent of what the contract earns that day. Never a share of the purchase price."
  },
  {
    q: "Everest is the top rank. On how many levels is it paid?",
    opts: ["7", "21", "42"],
    ans: 1,
    why: "Three levels per rank: Fuji 3, Kilimanjaro 6 … Everest 21."
  },
  {
    q: "What is the daily cap at Fuji, the first rank?",
    opts: ["1,000 USDT", "7,000 USDT", "There is no cap"],
    ans: 0,
    why: "The caps go from 1,000 USDT at Fuji to 7,000 USDT at Everest. They apply to the base matrix; the differential has no cap."
  },
  {
    q: "At Fuji, how much of your volume can one single line count for?",
    opts: ["Half, at most", "A fifth", "All of it — one line is enough"],
    ans: 0,
    why: "Half at Fuji and Kilimanjaro, a third at Matterhorn and Denali, a quarter at Rainier, a fifth at K-2 and Everest. Build wide."
  },
  {
    q: "What is the most a module can give back?",
    opts: [
      "2× its price, price included (2.2× for a Believer)",
      "Unlimited, as long as it runs",
      "Only the price back"
    ],
    ans: 0,
    why: "A module ends at two times its price, price included. A Believer, with Auto-Rebuy on for the whole life, ends at 2.2×."
  },
  {
    q: "Which sentence goes with every conversation?",
    opts: [
      "The engine never has a zero day",
      "Most members earn no commission at all; results and rewards are not guaranteed",
      "A module pays every day, no matter what"
    ],
    ans: 1,
    why: "The disclosure line. Every figure is an illustration at the engine's average daily result."
  }
];

// Spaced review constants
const REVIEW_DAYS = [1, 3, 7];
const REVIEW_SETS = [[0, 1, 5], [2, 3, 5], [1, 4, 5]];

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

function pick(a) {
  return a[Math.floor(Math.random() * a.length)];
}

function fmtU(n) {
  return (Math.round(n * 100) / 100).toLocaleString('en-US') + ' USDT';
}

function shareTxt(r) {
  return r.share === 50 ? '50%' : r.share === 25 ? '25%' : r.share === 20 ? '20%' : '33⅓%';
}

function others(list, key, r, fmt, n) {
  const vals = [];
  const seen = {};
  seen[r[key]] = 1;
  shuffle(list).forEach(x => {
    if (!seen[x[key]] && vals.length < n) {
      seen[x[key]] = 1;
      vals.push(fmt(x[key]));
    }
  });
  return vals;
}

function tmpl(id, CD, CR) {
  switch (id) {
    case 'levelPay': {
      const E = pick([20, 25, 40, 50, 75, 100, 150, 200, 250, 500]);
      return {
        q: `A contract in your paid levels earns ${fmtU(E)} today. How much do you receive from it on that level?`,
        o: [fmtU(E * 0.02), fmtU(E * 0.05), fmtU(E * 0.2), fmtU(E * 0.5)],
        w: `2% of ${fmtU(E)} is ${fmtU(E * 0.02)} — per paid level, per day, from that contract. Never a share of the purchase price.`
      };
    }
    case 'moduleDay': {
      const P = pick([1000, 2000, 2500, 5000, 6000, 10000, 12000, 25000]);
      return {
        q: `At the engine's average daily result, a ${fmtU(P)} module's result is about…`,
        o: [`${fmtU(P * 0.005)} a day`, `${fmtU(P * 0.05)} a day`, `${fmtU(P * 0.0005)} a day`, `${fmtU(P * 0.02)} a day`],
        w: `0.50% of ${fmtU(P)} is ${fmtU(P * 0.005)} a day — an illustration at the average; real days vary from zero to several percent.`
      };
    }
    case 'moduleEnd': {
      const P2 = pick([1000, 2500, 5000, 6000, 10000, 12000]);
      const bel = Math.random() < 0.5;
      const end = bel ? P2 * 2.2 : P2 * 2;
      return {
        q: `A ${bel ? "Believer's " : ""}${fmtU(P2)} module ends when it has delivered how much, price included?`,
        o: [fmtU(end), fmtU(bel ? P2 * 2 : P2 * 2.2), fmtU(P2 * 3), fmtU(P2)],
        w: `${bel ? "A Believer's module delivers 220%: " : 'A module delivers 200%, price included: '}${fmtU(end)}. Then it ends.`
      };
    }
    case 'volumeMonth': {
      const V = pick([10000, 50000, 100000, 200000, 500000, 1000000]);
      const m = V * 0.005 * 0.02 * 30;
      return {
        q: `With ${fmtU(V)} of active modules in your paid levels, at the average, the base matrix pays you about…`,
        o: [`${fmtU(m)} a month`, `${fmtU(m * 10)} a month`, `${fmtU(m / 10)} a month`, `${fmtU(V * 0.02)} a month`],
        w: `${fmtU(V)} × 0.50% = ${fmtU(V * 0.005)} of earnings a day; 2% of that is ${fmtU(V * 0.005 * 0.02)} a day, about ${fmtU(m)} a month. An illustration at the average; the daily cap may apply.`
      };
    }
    case 'rankLevels': {
      const r = pick(CR);
      const k = pick(['lv', 'ent', 'cap', 'own', 'enr', 'vol']);
      const Qs = {
        lv: [`On how many levels is ${r.n} paid?`, v => `1–${v}`, `Each rank adds three paid levels: ${r.n} is paid on levels 1–${r.lv}.`],
        ent: [`What is ${r.n}'s entitlement?`, v => `${v}%`, `${r.n}'s entitlement is ${r.ent}%; the differential pays the gap above the highest entitlement claimed below you.`],
        cap: [`What is the daily base-matrix cap at ${r.n}?`, v => fmtU(v), `The cap at ${r.n} is ${fmtU(r.cap)} a day, on the base matrix only.`],
        own: [`What own purchase does ${r.n} require?`, v => fmtU(v), `${r.n} requires an own purchase of ${fmtU(r.own)}.`],
        enr: [`How many personal enrollees does ${r.n} require?`, v => String(v), `${r.n} requires ${r.enr} personal enrollees.`],
        vol: [`What qualifying volume does ${r.n} require?`, v => fmtU(v), `${r.n} requires ${fmtU(r.vol)} of qualifying volume, counted under the line balance rule.`]
      }[k];
      return { q: Qs[0], o: [Qs[1](r[k])].concat(others(CR, k, r, Qs[1], 3)), w: Qs[2] };
    }
    case 'lineShare': {
      const r2 = pick(CR);
      const ml = Math.round(100 / r2.share);
      return {
        q: `At ${r2.n}, one line may count for at most what share of the qualifying volume — and so how many lines at least?`,
        o: [`${shareTxt(r2)} · at least ${ml} lines`, '100% · 1 line is enough', (r2.share === 50 ? '20% · at least 5 lines' : '50% · at least 2 lines'), (r2.share === 25 ? '33⅓% · at least 3 lines' : '25% · at least 4 lines')],
        w: `At ${r2.n} no single line counts for more than ${shareTxt(r2)} of the qualifying volume, so at least ${ml} balanced lines are needed. Build wide.`
      };
    }
    case 'gapPoints': {
      const ia = 1 + Math.floor(Math.random() * 6);
      const ib = Math.floor(Math.random() * ia);
      const A = CR[ia];
      const B = CR[ib];
      const g = A.ent - B.ent;
      return {
        q: `A ${A.n} (${A.ent}%) sits above a ${B.n} (${B.ent}%) at the head of a line. What gap does the ${A.n} collect on that line's contracts?`,
        o: [`${g} points`, `${A.ent} points`, `${B.ent} points`, `${A.ent + B.ent} points`],
        w: `${A.ent} − ${B.ent} = ${g} points of the contract's earnings, after the base matrix has been paid. No cap, no depth limit.`
      };
    }
    default:
      return null;
  }
}

function buildTest(CD) {
  const CR = CD.ranks;
  const byCat = {};
  CD.q.forEach(x => {
    (byCat[x.cat] = byCat[x.cat] || []).push(x);
  });
  const out = [];
  Object.keys(CD.quota).forEach(cat => {
    const qNeeded = CD.quota[cat];
    const available = shuffle(byCat[cat] || []);
    const picked = available.slice(0, qNeeded);
    picked.forEach(x => {
      let item = x;
      if (x.tmpl) {
        const t = tmpl(x.tmpl, CD, CR);
        if (t) item = { cat: x.cat, q: t.q, o: t.o, w: t.w };
      }
      out.push(item);
    });
  });
  return shuffle(out).map(x => {
    const right = x.o[0];
    const opts = shuffle(x.o);
    const ans = opts.indexOf(right);
    return { ...x, opts, ans };
  });
}

export default function CheckpointSection() {
  // 1. Checkpoint 6 Questions State
  const [qAnswers, setQAnswers] = useState({});
  const [qResult, setQResult] = useState(null);

  // 2. Say It In Your Own Words State
  const [teachText, setTeachText] = useState(() => {
    try {
      return localStorage.getItem('d1vip-teach') || '';
    } catch (e) {
      return '';
    }
  });
  const [teachStatus, setTeachStatus] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // 3. Spaced Review State
  const [reviewState, setReviewState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('d1vip-review') || 'null');
    } catch (e) {
      return null;
    }
  });
  const [reviewAnswers, setReviewAnswers] = useState({});
  const [reviewDoneText, setReviewDoneText] = useState('');

  // 4. Certification State
  const [certRec, setCertRec] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('d1vip-cert') || '{"attempts":0,"best":0,"passed":false}');
    } catch (e) {
      return { attempts: 0, best: 0, passed: false };
    }
  });
  const [certStep, setCertStep] = useState('intro'); // 'intro' | 'test' | 'passed' | 'failed'
  const [certCandidateName, setCertCandidateName] = useState(() => certRec.name || '');
  const [certTestQuestions, setCertTestQuestions] = useState([]);
  const [certCurrentIndex, setCertCurrentIndex] = useState(0);
  const [certAnswers, setCertAnswers] = useState({});
  const [certMissed, setCertMissed] = useState([]);
  const [certStatus, setCertStatus] = useState('');
  const certStartTime = useRef(0);

  // 5. Persona Quiz State
  const pItems = useMemo(() => personaData.items.filter(it => it.light), []);
  const [pIndex, setPIndex] = useState(0);
  const [pScores, setPScores] = useState({ D: 0, I: 0, S: 0, C: 0 });
  const [pResult, setPResult] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('d1vip-style') || 'null');
    } catch (e) {
      return null;
    }
  });
  const [pStatus, setPStatus] = useState('');

  // -------------------------------------------------------------
  // Checkpoint Quiz Handlers
  // -------------------------------------------------------------
  const handleSelectAnswer = (qIdx, optIdx) => {
    if (qAnswers[qIdx] !== undefined) return;
    const nextAnswers = { ...qAnswers, [qIdx]: optIdx };
    setQAnswers(nextAnswers);

    if (Object.keys(nextAnswers).length === CHECKPOINT_QUESTIONS.length) {
      let score = 0;
      CHECKPOINT_QUESTIONS.forEach((q, i) => {
        if (nextAnswers[i] === q.ans) score++;
      });
      const summaryMsg =
        score === 6
          ? 'Perfect! You know the plan. Take the certification next.'
          : score >= 4
          ? 'Good grasp! A couple of details to review below.'
          : 'Keep learning — reread The Plan in Simple Words and try again.';
      setQResult({ score, msg: summaryMsg });
      try {
        localStorage.setItem('d1vip-quiz', `${score}/6`);
      } catch (e) {}

      // Schedule Spaced Review if not already scheduled
      if (!reviewState) {
        const now = Date.now();
        const initialReview = {
          stage: 0,
          base: now,
          next: now + REVIEW_DAYS[0] * 86400000
        };
        setReviewState(initialReview);
        try {
          localStorage.setItem('d1vip-review', JSON.stringify(initialReview));
        } catch (e) {}
      }
    }
  };

  const handleResetCheckpoint = () => {
    setQAnswers({});
    setQResult(null);
    const el = document.getElementById('check');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleGoTeach = (e) => {
    e.preventDefault();
    const teach = document.getElementById('teach');
    if (teach) {
      teach.open = true;
      teach.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // -------------------------------------------------------------
  // Say It In Your Own Words Handlers
  // -------------------------------------------------------------
  const handleSaveTeach = () => {
    try {
      localStorage.setItem('d1vip-teach', teachText);
      setTeachStatus('Saved to this device.');
      setTimeout(() => setTeachStatus(''), 3000);
    } catch (e) {
      setTeachStatus('Could not save.');
    }
  };

  // -------------------------------------------------------------
  // Spaced Review Handlers
  // -------------------------------------------------------------
  const handleReviewAnswer = (k, optIdx, qIdx) => {
    if (reviewAnswers[k] !== undefined) return;
    const nextAnswers = { ...reviewAnswers, [k]: optIdx };
    setReviewAnswers(nextAnswers);

    const activeSet = reviewState ? REVIEW_SETS[reviewState.stage] : [];
    if (Object.keys(nextAnswers).length === activeSet.length) {
      let score = 0;
      activeSet.forEach((qId, i) => {
        if (nextAnswers[i] === CHECKPOINT_QUESTIONS[qId].ans) score++;
      });
      const nextStage = reviewState.stage + 1;
      const isAllDone = nextStage >= REVIEW_DAYS.length;
      const updated = {
        stage: nextStage,
        next: Date.now() + REVIEW_DAYS[Math.min(nextStage, REVIEW_DAYS.length - 1)] * 86400000
      };
      setReviewState(updated);
      try {
        localStorage.setItem('d1vip-review', JSON.stringify(updated));
      } catch (e) {}
      setReviewDoneText(
        `${score} of 3. ` + (isAllDone ? 'All reviews complete! The plan is in your bones.' : 'Next review scheduled.')
      );
    }
  };

  // -------------------------------------------------------------
  // Certification Handlers
  // -------------------------------------------------------------
  const handleStartCert = () => {
    const trimmed = certCandidateName.trim();
    if (!trimmed) {
      const input = document.getElementById('cert-name');
      if (input) input.focus();
      return;
    }
    const test = buildTest(certData);
    setCertTestQuestions(test);
    setCertCurrentIndex(0);
    setCertAnswers({});
    setCertMissed([]);
    certStartTime.current = Date.now();
    const nextRec = { ...certRec, name: trimmed, attempts: (certRec.attempts || 0) + 1 };
    setCertRec(nextRec);
    try {
      localStorage.setItem('d1vip-cert', JSON.stringify(nextRec));
    } catch (e) {}
    setCertStep('test');
    const certEl = document.getElementById('cert');
    if (certEl) certEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectCertAnswer = (optIdx) => {
    if (certAnswers[certCurrentIndex] !== undefined) return;
    const q = certTestQuestions[certCurrentIndex];
    const isOk = optIdx === q.ans;
    setCertAnswers(prev => ({ ...prev, [certCurrentIndex]: optIdx }));
    if (!isOk) {
      setCertMissed(prev => [...prev, { cat: q.cat, q: q.q, w: q.w }]);
    }
  };

  const handleNextCertQuestion = () => {
    if (certCurrentIndex + 1 < certTestQuestions.length) {
      setCertCurrentIndex(prev => prev + 1);
    } else {
      // Finished test
      const mins = Math.max(1, Math.round((Date.now() - certStartTime.current) / 60000));
      const totalRight = certTestQuestions.length - certMissed.length;
      const passed = totalRight === certTestQuestions.length;

      const nextRec = {
        ...certRec,
        best: Math.max(certRec.best || 0, totalRight),
        attempts: certRec.attempts || 1
      };

      if (passed) {
        nextRec.passed = true;
        nextRec.id = `D1-CPM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
        nextRec.date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        setCertRec(nextRec);
        try {
          localStorage.setItem('d1vip-cert', JSON.stringify(nextRec));
        } catch (e) {}
        setCertStep('passed');
      } else {
        setCertRec(nextRec);
        try {
          localStorage.setItem('d1vip-cert', JSON.stringify(nextRec));
        } catch (e) {}
        setCertStep('failed');
      }
    }
  };

  const handleDownloadCertificate = () => {
    const W = 1600;
    const Hh = 1131;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = Hh;
    const g = c.getContext('2d');

    g.fillStyle = '#FFFFFF';
    g.fillRect(0, 0, W, Hh);

    const grad = g.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#E9A300');
    grad.addColorStop(0.5, '#FFE28A');
    grad.addColorStop(1, '#E9A300');
    g.strokeStyle = grad;
    g.lineWidth = 18;
    g.strokeRect(40, 40, W - 80, Hh - 80);

    g.strokeStyle = '#0B1A33';
    g.lineWidth = 3;
    g.strokeRect(70, 70, W - 140, Hh - 140);

    g.fillStyle = '#0B1A33';
    g.beginPath();
    g.moveTo(W / 2, 130);
    g.lineTo(W / 2 + 46, 222);
    g.lineTo(W / 2 - 46, 222);
    g.closePath();
    g.lineWidth = 10;
    g.strokeStyle = '#0B1A33';
    g.stroke();

    g.fillStyle = '#1F6FEB';
    g.beginPath();
    g.arc(W / 2, 200, 9, 0, 7);
    g.fill();

    g.textAlign = 'center';
    g.fillStyle = '#8A5E00';
    g.font = '600 28px Poppins, Inter, Arial, sans-serif';
    g.fillText('DELTA ONE  ·  MOMENTUM PLAN', W / 2, 290);

    g.fillStyle = '#0B1A33';
    g.font = '700 72px Poppins, Inter, Arial, sans-serif';
    g.fillText('Certified Compensation Plan Master', W / 2, 400);

    g.fillStyle = '#44587A';
    g.font = '400 30px Inter, Arial, sans-serif';
    g.fillText('This certifies that', W / 2, 480);

    g.fillStyle = '#0B4FB8';
    g.font = '700 84px Poppins, Inter, Arial, sans-serif';
    g.fillText(certRec.name || 'Member', W / 2, 590);

    function wrap(text, maxW) {
      const words = text.split(' ');
      const lines = [];
      let cur = '';
      words.forEach(w => {
        const t = cur ? cur + ' ' + w : w;
        if (g.measureText(t).width > maxW && cur) {
          lines.push(cur);
          cur = w;
        } else {
          cur = t;
        }
      });
      if (cur) lines.push(cur);
      return lines;
    }

    g.fillStyle = '#0B1A33';
    g.font = '400 28px Inter, Arial, sans-serif';
    let y = 672;
    wrap(
      'answered every question on the module, the split, the base matrix, the seven ranks, the line balance rule, the breakage differential, settlement and the words we use — thirty of thirty — and may train others on the plan.',
      W - 300
    ).forEach(l => {
      g.fillText(l, W / 2, y);
      y += 40;
    });

    g.fillStyle = '#44587A';
    g.font = '500 26px Inter, Arial, sans-serif';
    g.fillText(`${certRec.date}   ·   Certificate ${certRec.id}`, W / 2, y + 40);

    g.font = '400 20px Inter, Arial, sans-serif';
    let y2 = 940;
    wrap(
      "Every figure in the plan is an illustration at the engine's average daily result; results and rewards are not guaranteed, and most members earn no commission at all.",
      W - 300
    ).forEach(l => {
      g.fillText(l, W / 2, y2);
      y2 += 28;
    });
    g.fillText('Delta One VIP  ·  Draft for legal and compliance review', W / 2, y2 + 10);

    c.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Delta_One_Certified_Compensation_Plan_Master_${certRec.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleShareCert = () => {
    const text = `I am a Certified Compensation Plan Master — Delta One Momentum Plan. Certificate ${certRec.id}, ${certRec.date}.`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCertStatus('Copied to clipboard.');
        setTimeout(() => setCertStatus(''), 3000);
      });
    }
  };

  // -------------------------------------------------------------
  // Persona Quiz Handlers
  // -------------------------------------------------------------
  const handleSelectPersona = (k) => {
    const nextScores = { ...pScores, [k]: (pScores[k] || 0) + 1 };
    setPScores(nextScores);

    if (pIndex + 1 < pItems.length) {
      setPIndex(prev => prev + 1);
    } else {
      // Finished Persona
      const PKEYS = ['D', 'I', 'S', 'C'];
      const ranked = PKEYS.slice().sort((a, b) => nextScores[b] - nextScores[a]);
      const p = ranked[0];
      const s = ranked[1];
      const sec = nextScores[s] > 0 && nextScores[s] >= Math.max(2, nextScores[p] * 0.6) ? s : null;
      const rec = {
        version: 'light',
        scores: nextScores,
        primary: p,
        secondary: sec,
        at: Date.now()
      };
      setPResult(rec);
      try {
        localStorage.setItem('d1vip-style', JSON.stringify(rec));
      } catch (e) {}
    }
  };

  const handleResetPersona = () => {
    setPIndex(0);
    setPScores({ D: 0, I: 0, S: 0, C: 0 });
    setPResult(null);
    setPStatus('');
    const styleEl = document.getElementById('style');
    if (styleEl) styleEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSharePersona = () => {
    if (!pResult) return;
    const st = personaData.styles.find(s => s.k === pResult.primary) || personaData.styles[0];
    const text = `My Delta One climbing style: ${st.name} (${st.word}). ${st.line} How to work with me: ${st.coach[0]}`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setPStatus('Copied to clipboard.');
        setTimeout(() => setPStatus(''), 3000);
      });
    }
  };

  // -------------------------------------------------------------
  // Render Helpers
  // -------------------------------------------------------------
  const personaPrimaryStyle = pResult
    ? personaData.styles.find(s => s.k === pResult.primary) || personaData.styles[0]
    : null;
  const personaSecondaryStyle =
    pResult && pResult.secondary
      ? personaData.styles.find(s => s.k === pResult.secondary)
      : null;

  return (
    <section className="zone checkzone quiz" id="check">
      <div className="wrap">
        <div className="zone-head">
          <span className="zone-ic">✓</span>
          <div>
            <p className="kicker" style={{ color: 'var(--gold-ink)' }}>
              Checkpoint
            </p>
            <h2 className="section-title">
              Six questions. You know the plan when you can answer them.
            </h2>
            <p className="section-lede">
              Pick an answer. The right one lights up green, with the reason. A wrong answer is fine — that is how we learn. Your answers stay on your device; your training record keeps only the score.
            </p>
          </div>
        </div>

        {/* 6 Questions */}
        <div className="qs">
          {CHECKPOINT_QUESTIONS.map((item, qIdx) => {
            const chosen = qAnswers[qIdx];
            const isLocked = chosen !== undefined;

            return (
              <div
                key={qIdx}
                className={`q ${isLocked ? 'locked' : ''}`}
                data-ans={item.ans}
              >
                <p className="qn">Question {qIdx + 1} of 6</p>
                <h3>{item.q}</h3>
                <div className="opts">
                  {item.opts.map((optText, optIdx) => {
                    let optClass = 'opt';
                    if (isLocked) {
                      if (optIdx === item.ans) {
                        optClass += ' right';
                      } else if (optIdx === chosen) {
                        optClass += ' wrong';
                      }
                    }
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        className={optClass}
                        data-i={optIdx}
                        onClick={() => handleSelectAnswer(qIdx, optIdx)}
                      >
                        {optText}
                      </button>
                    );
                  })}
                </div>
                {isLocked && (
                  <p className="why">{item.why}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Checkpoint Result Bar */}
        {qResult && (
          <p id="qresult">
            <b>{qResult.score} of 6</b> · {qResult.msg}
          </p>
        )}

        <div className="actions" style={{ marginTop: '18px' }}>
          <button
            type="button"
            className="btn ghost"
            id="qagain"
            onClick={handleResetCheckpoint}
          >
            Try again
          </button>
          <button
            type="button"
            className="btn primary next"
            data-go="#teach"
            onClick={handleGoTeach}
          >
            Next: say it in your own words ▸
          </button>
        </div>

        {/* Shelf 1: Say it in your own words */}
        <details className="shelf more-check" id="teach">
          <summary>
            <span className="sh-t">
              <h2>Say it in your own words</h2>
              <span className="cnt">3 sentences</span>
            </span>
            <span className="sh-s">
              If you can teach it, you know it. Write it, then compare with the model answer.
            </span>
          </summary>
          <p className="section-lede">
            Explain the Momentum Plan to a friend in three sentences: what you buy, how introducing people pays, and what is never promised. Your words go into your training record, so your sponsor can see how you explain it.
          </p>
          <div className="teach-box">
            <label className="sr" htmlFor="teach-text">
              Your three sentences
            </label>
            <textarea
              id="teach-text"
              rows="5"
              placeholder="1. You buy a module…  2. When you introduce someone…  3. Nothing is…"
              value={teachText}
              onChange={(e) => setTeachText(e.target.value)}
            />
            <div className="actions">
              <button
                type="button"
                className="btn primary"
                id="teach-save"
                onClick={handleSaveTeach}
              >
                Save my words
              </button>
              <button
                type="button"
                className="btn ghost"
                id="teach-model"
                onClick={() => setShowModelAnswer(prev => !prev)}
              >
                {showModelAnswer ? 'Hide the model answer' : 'Show the model answer'}
              </button>
              {teachStatus && (
                <span className="status ok" id="teach-status">
                  {teachStatus}
                </span>
              )}
            </div>
            {showModelAnswer && (
              <div className="model" id="teach-answer">
                <p className="goals-t">A model answer</p>
                <p>
                  1. You buy a module. It is a software purchase, and at the engine's average daily result it can give back up to two times its price, price included.
                </p>
                <p>
                  2. When you introduce people, you get 2% of what their contracts earn each day, on up to 21 levels, depending on your rank. Leaders add the breakage differential.
                </p>
                <p>
                  3. Nothing is promised: some days are zero, the price cannot be refunded, and most members earn no commission at all.
                </p>
                <p className="goals-t" style={{ marginTop: '14px' }}>
                  Your homework
                </p>
                <p>Say it out loud to one real person this week. That is the whole test.</p>
              </div>
            )}
          </div>
        </details>

        {/* Shelf 2: Spaced Review */}
        <details className="shelf more-check review" id="review">
          <summary>
            <span className="sh-t">
              <h2>A little review, three times</h2>
              <span className="cnt">day 1 · 3 · 7</span>
            </span>
            <span className="sh-s">
              Things stick when you meet them again: three quick questions tomorrow, in three days, and in a week.
            </span>
          </summary>
          <div className="review-box" id="review-box">
            <p id="review-when" className="review-when">
              {!reviewState
                ? 'Finish the 6-question checkpoint first to begin your 3-step review.'
                : reviewState.stage >= REVIEW_DAYS.length
                ? 'All three reviews complete! The plan is in your bones.'
                : Date.now() < reviewState.next
                ? `Step ${reviewState.stage + 1} opens in ${Math.ceil((reviewState.next - Date.now()) / 86400000)} day(s).`
                : `Step ${reviewState.stage + 1} is ready now!`}
            </p>

            {/* Questions for active stage */}
            {reviewState && reviewState.stage < REVIEW_DAYS.length && (
              <div className="qs" id="review-qs" style={{ marginTop: '18px' }}>
                {REVIEW_SETS[reviewState.stage].map((qIdx, k) => {
                  const q = CHECKPOINT_QUESTIONS[qIdx];
                  const chosen = reviewAnswers[k];
                  const isLocked = chosen !== undefined;

                  return (
                    <div key={k} className={`q ${isLocked ? 'locked' : ''}`}>
                      <p className="qn">Review question {k + 1} of 3</p>
                      <h3>{q.q}</h3>
                      <div className="opts">
                        {q.opts.map((optText, optIdx) => {
                          let optClass = 'opt';
                          if (isLocked) {
                            if (optIdx === q.ans) optClass += ' right';
                            else if (optIdx === chosen) optClass += ' wrong';
                          }
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              className={optClass}
                              data-i={optIdx}
                              onClick={() => handleReviewAnswer(k, optIdx, qIdx)}
                            >
                              {optText}
                            </button>
                          );
                        })}
                      </div>
                      {isLocked && <p className="why">{q.why}</p>}
                    </div>
                  );
                })}
              </div>
            )}

            {reviewDoneText && (
              <p id="review-result" style={{ marginTop: '16px' }}>
                {reviewDoneText}
              </p>
            )}
          </div>
        </details>

        {/* Shelf 3: Certification */}
        <details className="shelf more-check certs" id="cert">
          <summary>
            <span className="sh-t">
              <h2>Certification · Certified Compensation Plan Master</h2>
              <span className="cnt">30 questions · 15 min</span>
            </span>
            <span className="sh-s">
              Every rule, every rank, every number, and the words we use. Only a certified member may train others on the plan.
            </span>
          </summary>
          <p className="section-lede">
            Aria asks thirty questions. A Certified Compensation Plan Master gets all thirty right. Take it as often as you like — the questions are different every time.
          </p>
          <div className="cert-box" id="cert-box">
            {certStep === 'intro' && (
              <>
                <div className="aria-say">
                  <img src="/img/host.svg" alt="" />
                  <p>
                    {certRec.passed
                      ? `You are a Certified Compensation Plan Master, ${certRec.name}. Your certificate is below; take the test again any time to stay sharp — the questions change every time.`
                      : 'Hello. Before anyone trains others on the plan, I ask them thirty questions. Every rule, every rank, every number, and the words we use. You need all thirty right, and you can try as often as you like. Shall we?'}
                  </p>
                </div>

                {certRec.passed ? (
                  <>
                    <div className="cert-card" id="cert-card">
                      <div className="cert-in">
                        <p className="cert-k">Delta One · Momentum Plan</p>
                        <h3>Certified Compensation Plan Master</h3>
                        <p className="cert-n">{certRec.name}</p>
                        <p className="cert-s">
                          answered every question on the module, the split, the base matrix, the seven ranks, the line balance rule, the breakage differential, settlement and the words we use — thirty of thirty — and may train others on the plan.
                        </p>
                        <p className="cert-m">
                          {certRec.date} · certificate {certRec.id}
                        </p>
                      </div>
                    </div>
                    <div className="actions" style={{ marginTop: '14px' }}>
                      <button
                        type="button"
                        className="btn primary"
                        id="cert-dl"
                        onClick={handleDownloadCertificate}
                      >
                        Download my certificate
                      </button>
                      <button
                        type="button"
                        className="btn ghost"
                        id="cert-share"
                        onClick={handleShareCert}
                      >
                        Share
                      </button>
                      <button
                        type="button"
                        className="btn ghost"
                        id="cert-go"
                        onClick={() => {
                          const test = buildTest(certData);
                          setCertTestQuestions(test);
                          setCertCurrentIndex(0);
                          setCertAnswers({});
                          setCertMissed([]);
                          certStartTime.current = Date.now();
                          setCertStep('test');
                        }}
                      >
                        Take the test again
                      </button>
                      {certStatus && <span className="status ok">{certStatus}</span>}
                    </div>
                  </>
                ) : (
                  <div className="cert-start">
                    <label className="field">
                      Your name, as it should appear on the certificate
                      <input
                        id="cert-name"
                        type="text"
                        maxLength="60"
                        value={certCandidateName}
                        onChange={(e) => setCertCandidateName(e.target.value)}
                        placeholder="First and last name"
                      />
                    </label>
                    <div className="actions">
                      <button
                        type="button"
                        className="btn primary next"
                        id="cert-go"
                        onClick={handleStartCert}
                      >
                        Start the test · 30 questions
                      </button>
                      {certRec.attempts > 0 && (
                        <span className="status">
                          Attempt {certRec.attempts} · best so far {certRec.best} of 30
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {certStep === 'test' && certTestQuestions.length > 0 && (
              <div className="q cert-q">
                <div className="cert-top">
                  <span className="qn">
                    Question {certCurrentIndex + 1} of {certTestQuestions.length} ·{' '}
                    {certData.cats[certTestQuestions[certCurrentIndex].cat] || ''}
                  </span>
                  <span className="qn">
                    {certCurrentIndex - certMissed.length} right
                  </span>
                </div>
                <div className="bar">
                  <i
                    style={{
                      width: `${Math.round((100 * certCurrentIndex) / certTestQuestions.length)}%`
                    }}
                  />
                </div>
                <h3>{certTestQuestions[certCurrentIndex].q}</h3>
                <div className="opts">
                  {certTestQuestions[certCurrentIndex].opts.map((opt, i) => {
                    const isChosen = certAnswers[certCurrentIndex] !== undefined;
                    let cls = 'opt';
                    if (isChosen) {
                      if (i === certTestQuestions[certCurrentIndex].ans) cls += ' right';
                      else if (i === certAnswers[certCurrentIndex]) cls += ' wrong';
                    }
                    return (
                      <button
                        key={i}
                        type="button"
                        className={cls}
                        data-i={i}
                        onClick={() => handleSelectCertAnswer(i)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {certAnswers[certCurrentIndex] !== undefined && (
                  <>
                    <p className="why" id="cert-why">
                      {certAnswers[certCurrentIndex] === certTestQuestions[certCurrentIndex].ans
                        ? 'Right. '
                        : 'Not this one. '}
                      {certTestQuestions[certCurrentIndex].w}
                    </p>
                    <div className="actions" style={{ marginTop: '14px' }}>
                      <button
                        type="button"
                        className="btn primary"
                        id="cert-next"
                        onClick={handleNextCertQuestion}
                      >
                        {certCurrentIndex === certTestQuestions.length - 1
                          ? 'See my result'
                          : 'Next question ▸'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {certStep === 'passed' && (
              <>
                <div className="aria-say">
                  <img src="/img/host.svg" alt="" />
                  <p>
                    Thirty of thirty! You know the plan, {certRec.name} — every rule, every number, and the words. You may train others on it now. Your certificate:
                  </p>
                </div>
                <div className="cert-card" id="cert-card">
                  <div className="cert-in">
                    <p className="cert-k">Delta One · Momentum Plan</p>
                    <h3>Certified Compensation Plan Master</h3>
                    <p className="cert-n">{certRec.name}</p>
                    <p className="cert-s">
                      answered every question on the module, the split, the base matrix, the seven ranks, the line balance rule, the breakage differential, settlement and the words we use — thirty of thirty — and may train others on the plan.
                    </p>
                    <p className="cert-m">
                      {certRec.date} · certificate {certRec.id}
                    </p>
                  </div>
                </div>
                <div className="actions" style={{ marginTop: '14px' }}>
                  <button
                    type="button"
                    className="btn primary"
                    id="cert-dl"
                    onClick={handleDownloadCertificate}
                  >
                    Download my certificate
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    id="cert-share"
                    onClick={handleShareCert}
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    id="cert-again"
                    onClick={() => setCertStep('intro')}
                  >
                    Back
                  </button>
                  {certStatus && <span className="status ok">{certStatus}</span>}
                </div>
              </>
            )}

            {certStep === 'failed' && (
              <>
                <div className="aria-say">
                  <img src="/img/host.svg" alt="" />
                  <p>
                    {certTestQuestions.length - certMissed.length} of {certTestQuestions.length}. Close — but a Certified Compensation Plan Master gets every one right, because a prospect will ask exactly the one you missed. Read the notes below, open the documents they point to, then try again: the next test has different questions.
                  </p>
                </div>
                <div className="cert-miss">
                  <p className="goals-t">What to review</p>
                  {certMissed.map((m, idx) => (
                    <div key={idx} className="miss">
                      <b>
                        {certData.cats[m.cat] || m.cat} · {m.q}
                      </b>
                      <p>{m.w}</p>
                    </div>
                  ))}
                </div>
                <div className="actions" style={{ marginTop: '14px' }}>
                  <button
                    type="button"
                    className="btn primary next"
                    id="cert-retry"
                    onClick={() => {
                      const test = buildTest(certData);
                      setCertTestQuestions(test);
                      setCertCurrentIndex(0);
                      setCertAnswers({});
                      setCertMissed([]);
                      certStartTime.current = Date.now();
                      const nextRec = { ...certRec, attempts: (certRec.attempts || 0) + 1 };
                      setCertRec(nextRec);
                      try {
                        localStorage.setItem('d1vip-cert', JSON.stringify(nextRec));
                      } catch (e) {}
                      setCertStep('test');
                    }}
                  >
                    Try again · new questions
                  </button>
                  <a className="btn ghost" href="#library" data-go="#library">
                    Open the library
                  </a>
                </div>
              </>
            )}
          </div>
        </details>

        {/* Shelf 4: Climbing Style Persona Quiz */}
        <details className="shelf more-check persona" id="style">
          <summary>
            <span className="sh-t">
              <h2>A little fun · What kind of climber are you?</h2>
              <span className="cnt">8 questions</span>
            </span>
            <span className="sh-s">
              Your climbing style, what moves you, and how your sponsor can work with you best. Four styles; every one reaches the summit.
            </span>
          </summary>

          {!pResult ? (
            <div className="pq" id="pq">
              {pIndex < pItems.length && (
                <div className="q" style={{ border: 0, padding: 0, background: 'transparent' }}>
                  <p className="qn">Question {pIndex + 1} of {pItems.length}</p>
                  <h3>{pItems[pIndex].q}</h3>
                  <div className="opts">
                    {['D', 'I', 'S', 'C'].map((k) => (
                      <button
                        key={k}
                        type="button"
                        className="opt"
                        data-k={k}
                        onClick={() => handleSelectPersona(k)}
                      >
                        {pItems[pIndex][k]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="pq-result" id="pq-result" style={{ margin: '14px' }}>
              <div
                className="pr-card"
                style={{
                  '--pc': personaPrimaryStyle.color,
                  '--ps': personaPrimaryStyle.soft
                }}
              >
                <div className="pr-head">
                  <span className="pr-badge">Your Climbing Style</span>
                  <h3>{personaPrimaryStyle.name}</h3>
                  <p className="pr-line">{personaPrimaryStyle.line}</p>
                  <p className="goals-t" style={{ marginTop: '8px' }}>
                    How strongly each style shows up
                  </p>
                  <div className="pr-bars">
                    {['D', 'I', 'S', 'C'].map((k) => {
                      const sObj = personaData.styles.find(s => s.k === k) || {};
                      const count = pResult.scores[k] || 0;
                      const pct = Math.round((100 * count) / (pItems.length || 8));
                      return (
                        <div
                          key={k}
                          className="pr-bar"
                          style={{ '--bc': sObj.color }}
                        >
                          <span>{sObj.name} ({k})</span>
                          <div>
                            <i style={{ width: `${pct}%` }} />
                          </div>
                          <b>{pct}%</b>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pr-grid">
                  <div>
                    <p className="goals-t">Your strengths</p>
                    <ul>
                      {personaPrimaryStyle.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="goals-t">What moves you</p>
                    <ul>
                      {personaPrimaryStyle.moves.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="goals-t">Under pressure</p>
                    <p>{personaPrimaryStyle.pressure}</p>
                  </div>
                  <div>
                    <p className="goals-t">How your sponsor works with you best</p>
                    <ul>
                      {personaPrimaryStyle.coach.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {personaSecondaryStyle && (
                  <p className="pr-blend" style={{ padding: '0 24px 16px' }}>
                    <b>{personaPrimaryStyle.name} + {personaSecondaryStyle.name}.</b>{' '}
                    {personaData.blends[personaPrimaryStyle.k + personaSecondaryStyle.k] || ''}
                  </p>
                )}

                <div className="actions">
                  <button
                    type="button"
                    className="btn primary"
                    id="pq-share"
                    onClick={handleSharePersona}
                  >
                    Share my style
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    id="pq-again"
                    onClick={handleResetPersona}
                  >
                    Take it again
                  </button>
                  {pStatus && <span className="status ok">{pStatus}</span>}
                </div>

                <p className="pr-more free-el">
                  The full 20-question profile is in Delta One VIP Pro.{' '}
                  <a href="#upgrade" data-upgrade="style">
                    Go VIP
                  </a>
                </p>
              </div>
            </div>
          )}
        </details>
      </div>
    </section>
  );
}

