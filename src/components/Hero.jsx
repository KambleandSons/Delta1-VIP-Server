import { useApp } from '../context/AppContext';

export default function Hero() {
  const { stepsDone, isReady, openUpsell } = useApp();
  const done = (n) => stepsDone.includes(n);

  return (
    <header className="hero" id="start">
      <div className="wrap">
        <div>
          <p className="eyebrow">Delta One VIP · Your classroom</p>
          <h1>Learn the Momentum Plan in <em>three steps</em>.</h1>
          <p className="hero-lede">
            This page is a hallway with three doors, and they open one after the other: watch, read, do. Walk through all three and you can explain the plan to a friend — what you buy, what it pays, and what it never promises.
          </p>
          <div className="actions">
            <button
              type="button"
              className="btn primary next"
              onClick={() => document.getElementById('step1')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start at Step 1
            </button>
            <button type="button" className="btn ghost wt-start">
              <span className="ic">▶</span>&nbsp; Aria, my teacher, walks me through · 2:49
            </button>
          </div>
          <p className="lao">
            “A journey of a thousand miles begins with a single step.” <span>— Lao Tzu. This hallway is three steps long.</span>
          </p>
          <p id="lang-note"></p>
          {isReady && (
            <p className="ready-badge" style={{ display: 'inline-block' }}>
              ✓ You have walked the whole hallway. The library below goes as deep as you like.
            </p>
          )}
        </div>
        <img
          className="hero-art"
          src="/img/hero_plan.jpg"
          alt="7 Summits to Success — the Momentum Plan on one page"
          width="1200"
          height="954"
        />
      </div>
      <div className="wrap tiles-wrap">
        <div className="tiles">
          <a className={`tile${done(1) ? ' done' : ''}`} href="#step1" data-step="1">
            <span className="n"><i>1</i></span>
            <span><b>Watch</b><span className="tl">The plan as a film · 4 or 10 min</span></span>
          </a>
          <a className={`tile${done(2) ? ' done' : ''}`} href="#step2" data-step="2">
            <span className="n"><i>2</i></span>
            <span><b>Read</b><span className="tl">Three documents, in order · 15 min</span></span>
          </a>
          <a className={`tile${done(3) ? ' done' : ''}`} href="#step3" data-step="3">
            <span className="n"><i>3</i></span>
            <span><b>Do</b><span className="tl">Set up, plan, say it right · 10 min</span></span>
          </a>
        </div>
        <p className="motto">
          “I hear and I forget. I see and I remember. I do and I understand.” <span>— Confucius. That is why the hallway has three doors.</span>
        </p>
        <div className="plan-strip free-el" id="plan-strip-free">
          <span className="ps-tag">Delta One Training · free</span>
          <span className="ps-t">
            You have the whole hallway: the films, the checkpoint, the reviews and every document, for your customers and for you as a distributor, in 20 languages. <b>Delta One VIP</b> adds your personal assistant, a live agent on Zoom 24/7, a concierge, your own progress dashboard, your team's view, your contacts and messages, and the Skill Shop.
          </span>
          <a
            className="btn gold"
            href="#upgrade"
            data-upgrade="hero"
            onClick={(e) => {
              e.preventDefault();
              openUpsell();
            }}
          >
            Go VIP · 99 USDT/month
          </a>
        </div>
        <div className="plan-strip vip-el" id="plan-strip-vip">
          <span className="ps-tag vip">Delta One VIP</span>
          <span className="ps-t">
            Your progress on this page is saved to your dashboard, so your sponsor can help you exactly where you are: which film, which page, which checkpoint.
          </span>
          <a className="btn primary" href="#" data-dashboard="hero">Open my dashboard ↗</a>
        </div>
      </div>
      <div className="mtn" aria-hidden="true"></div>
    </header>
  );
}

