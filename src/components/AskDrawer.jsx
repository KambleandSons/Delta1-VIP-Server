import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const INITIAL_MESSAGE = {
  role: 'aria',
  text: 'Hello! I am Aria, your Delta One helper. Ask me anything about the Momentum Plan, modules, ranks, or settlement.'
};

export default function AskDrawer() {
  const { askOpen, setAskOpen } = useApp();
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  function handleSubmit(e) {
    e.preventDefault();
    const q = inputVal.trim();
    if (!q) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'me', text: q }]);
    setInputVal('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      let reply = `Regarding "${q}": In the Momentum Plan, each software module delivers a share of daily trading profit up to 2× its purchase price. Daily settlement occurs at 12:00 UTC. Remember that results are illustrated at average performance and nothing is guaranteed.`;
      if (q.toLowerCase().includes('day 11')) {
        reply = 'On day 11, the Auto-Rebuy switch unlocks. You can choose whether each day’s results continue rebuying new modules or go directly to your app wallet for withdrawal.';
      } else if (q.toLowerCase().includes('rank') || q.toLowerCase().includes('mountain')) {
        reply = 'There are seven ranks named after mountains: Fuji, Kilimanjaro, Matterhorn, Denali, Rainier, K-2, and Everest. Each rank unlocks 3 more levels on the base matrix (from 3 levels to 21 levels).';
      }
      setMessages(prev => [...prev, { role: 'aria', text: reply }]);
    }, 700);
  }

  return (
    <>
      <button
        type="button"
        className="ask-fab"
        id="ask-fab"
        aria-label="Ask Delta One a question"
        aria-expanded={askOpen}
        onClick={() => setAskOpen(!askOpen)}
      >
        <span className="q">?</span>
        <span className="t">Ask Delta One</span>
        <span className="pdot ai" id="fab-dot"></span>
      </button>

      {askOpen && (
        <div className="ask-drawer" id="ask-drawer">
          <div className="ask-drawer-in chat">
            <div className="ask-drawer-top">
              <img className="av" src="/img/host.svg" alt="" />
              <div>
                <b>Aria · Delta One helper</b>
                <span className="pres ai" id="pres">
                  <span className="pdot ai"></span>
                  <span id="pres-t">Aria answers now</span>
                </span>
              </div>
              <button
                type="button"
                className="ask-x"
                id="ask-x"
                aria-label="Close"
                onClick={() => setAskOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="chat-log" id="chat-log" ref={logRef}>
              {messages.map((m, idx) => (
                <div key={idx} className={`msg ${m.role}`}>
                  {m.text}
                </div>
              ))}
              {isThinking && (
                <div className="msg aria thinking">
                  Aria is thinking...
                </div>
              )}
            </div>

            <form className="ask-form" id="ask-form2" onSubmit={handleSubmit}>
              <input
                id="ask-q2"
                type="text"
                maxLength={300}
                placeholder="Type your question..."
                autoComplete="off"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
              />
              <button type="submit" className="btn primary" id="ask-btn2" disabled={isThinking}>
                Send
              </button>
            </form>

            <div className="chat-hand">
              <a
                className="btn gold"
                id="hand-btn"
                href="https://deltavip24.com"
                target="_blank"
                rel="noopener"
              >
                <span className="lt">Ask for a person</span>
              </a>
              <span className="ask-note" id="hand-note">
                An agent on Zoom or chat is available for VIP members.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

