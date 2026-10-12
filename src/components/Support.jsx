import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Support() {
  const { openUpsell } = useApp();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  function handleAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('Aria is consulting the plan published rules...');
    setTimeout(() => {
      setLoading(false);
      setAnswer(
        `Regarding "${question}": In the Momentum Plan, daily rewards are paid based on engine performance. Auto-Rebuy can be selected after day 11, or rewards are sent directly to your wallet. Every figure is an illustration at average daily results.`
      );
    }, 800);
  }

  return (
    <section className="support" id="support">
      <div className="wrap">
        <p className="kicker" style={{ color: 'var(--blue-ink)' }}>Need help right now?</p>
        <h2 className="section-title">Three ways to get an answer.</h2>
        <div className="sup-grid">
          {/* <a class="sup-box zoom" id="zoom-box" href="https://deltavip24.com" target="_blank" rel="noopener">
            <span className="live"><span className="dot"></span><span className="lt">LIVE · 24/7</span></span>
            <svg className="cam" viewBox="0 0 96 64" aria-hidden="true">
              <rect x="4" y="10" width="60" height="44" rx="12" fill="#fff" />
              <path d="M66 26 90 14v36L66 38z" fill="#fff" />
              <circle cx="34" cy="32" r="11" fill="#1F6FEB" />
              <circle cx="34" cy="32" r="5" fill="#fff" />
            </svg>
            <span className="sup-t">Speak to an agent now on Zoom</span>
            <span className="sup-s">An agent is live around the clock. One click opens the room — no account needed.</span>
            <span className="btn gold big">Join the live Zoom ↗</span>
            <span className="sup-url">deltavip24.com</span>
          </a> */}

          <div className="sup-box ask">
            <span className="sup-t">Do you have any questions about Delta One?</span>
            <span className="sup-s">Ask in your own words. The answer comes from the plan's published rules, in plain language.</span>
            <form className="ask-form" id="ask-form" onSubmit={handleAsk}>
              <label className="sr" htmlFor="ask-q">Your question</label>
              <input
                id="ask-q"
                type="text"
                maxLength={300}
                placeholder="For example: what happens on day 11?"
                autoComplete="off"
                value={question}
                onChange={e => setQuestion(e.target.value)}
              />
              <button type="submit" className="btn primary" id="ask-btn">Ask</button>
            </form>
            {answer && (
              <div className={`ask-out${loading ? ' thinking' : ''}`} id="ask-out">
                {answer}
              </div>
            )}
            <p className="ask-note" id="ask-note">
              Answers are illustrations at the engine's average daily result; nothing here is a promise. For anything personal, ask your sponsor or an agent.
            </p>
          </div>

          {/* <a className="sup-box chat" id="chat-box" href="https://deltavip24.com" target="_blank" rel="noopener">
            <svg className="bubble" viewBox="0 0 64 64" aria-hidden="true">
              <path d="M12 10h40a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H30l-14 10V48h-4a8 8 0 0 1-8-8V18a8 8 0 0 1 8-8z" fill="#fff" />
              <circle cx="22" cy="29" r="3.5" fill="#0FB5A4" />
              <circle cx="32" cy="29" r="3.5" fill="#0FB5A4" />
              <circle cx="42" cy="29" r="3.5" fill="#0FB5A4" />
            </svg>
            <span className="sup-t">Live chat with Delta One VIP support</span>
            <span className="sup-s">Type to a real person. Open it in a new tab and keep learning here.</span>
            <span className="btn primary">Open the live chat ↗</span>
          </a> */}

          <div className="sup-box upgrade free-el">
            <span className="live"><span className="dot"></span><span className="lt">LIVE · 24/7</span></span>
            <span className="sup-t">A live agent on Zoom and a concierge on chat, at any hour</span>
            <span className="sup-s">Delta One VIP members speak to a real person around the clock, and Aria, their personal assistant, knows exactly where they are in the hallway. 99 USDT a month, paid in USDT like a module.</span>
            <a
              className="btn gold big"
              href="https://deltavip24.com"
              data-upgrade="support"
              target="_blank" 
              rel="noopener"
            >
              Join Live Zoom
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

