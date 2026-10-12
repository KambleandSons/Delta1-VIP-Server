import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function HelpAndFooter() {
  const { upsellOpen, closeUpsell } = useApp();

  useEffect(() => {
    if (!upsellOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e) {
      if (e.key === 'Escape') closeUpsell();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [upsellOpen, closeUpsell]);

  return (
    <>
      <section className="help" id="help">
        <div className="wrap">
          <div className="notes">
            <h2>Three things to keep in mind</h2>
            <p>1. Every figure on this page is an illustration at the engine's average daily result. Results and rewards are not guaranteed, and most members earn no commission at all.</p>
            <p>2. A module is a software purchase, not an investment or a deposit. Only purchase with money you can afford to lose.</p>
            <p>3. Translations are drafts awaiting review by native speakers and compliance. The English edition is the reference.</p>
          </div>
          <div className="helpgrid">
            <article className="tool">
              <h3>Need to speak to a person?</h3>
              <p>A live agent is on Zoom 24/7 at deltavip24.com, or use the live chat in the bottom right.</p>
              <div className="actions">
                <a className="btn primary" href="https://deltavip24.com" target="_blank" rel="noopener">
                  Join live Zoom ↗
                </a>
              </div>
            </article>
            <article className="tool">
              <h3>Want to test yourself?</h3>
              <p>Take the Certified Compensation Plan Master test above. Thirty questions, all must be right.</p>
              <div className="actions">
                <a className="btn primary" href="#cert">
                  Go to certification ▸
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p>
            Delta One VIP · Draft for legal and compliance review · All numbers are illustrations at the engine's average daily result
          </p>
        </div>
      </footer>

      {/* Upsell Modal */}
      {upsellOpen && (
        <div
          className="upsell"
          id="vip-upsell"
          onClick={(e) => {
            if (e.target.id === 'vip-upsell') closeUpsell();
          }}
        >
          <div className="upsell-in">
            <button
              type="button"
              className="ask-x upsell-x"
              id="upsell-x"
              aria-label="Close"
              onClick={closeUpsell}
            >
              ✕
            </button>
            <h2>Upgrade to Delta One VIP</h2>
            {/* <ul className="upsell-list">
              <li><b>Your personal AI assistant, Aria</b> — knows where you are in the hallway and walks you through any document</li>
              <li><b>Live Zoom agent 24/7</b> — real human support at any hour</li>
              <li><b>Your personal progress dashboard</b> — your sponsor sees where you are and can help you directly</li>
              <li><b>The Skill Shop</b> — ten full masterclasses from legendary teachers</li>
              <li><b>Team view & contacts</b> — manage your lines, follow-ups and messages in one place</li>
            </ul> */}

            <h3>
              <span>Coming Soon</span>
            </h3>

            <p className="ask-note">
              We are currently preparing the VIP experience. Live concierge, team dashboard, and pro distributor tools are coming soon!
            </p>

            <div className="actions" style={{ marginTop: '14px' }}>
              <a
                className="btn gold big"
                href="#upgrade"
                id="upsell-go"
                onClick={(e) => {
                  e.preventDefault();
                  closeUpsell();
                }}
              >
                Got it
              </a>
              <button type="button" className="btn ghost" id="upsell-later" onClick={closeUpsell}>
                Maybe later
              </button>
            </div>
            {/* <p className="ask-note" id="upsell-note">Paid in USDT on BNB Smart Chain. Cancel any time.</p> */}
          </div>
        </div>
      )}
    </>
  );
}

