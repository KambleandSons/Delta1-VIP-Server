import { useState } from 'react';
import { useApp } from '../context/AppContext';

const STYLES = {
  D: { name: "Summiteer", color: "#E8463A", soft: "#FDE8E6", line: "Direct, fast, focused on the goal and the peak.", strengths: ["Clear focus on the top", "Decides fast", "Not afraid of direct conversations"], moves: ["Big targets", "Freedom to build their way", "Numbers and ranks"], pressure: "Impatient with slow pace or complicated rules", coach: ["Give them a target and room to climb", "Keep meetings short and numbers-first"] },
  I: { name: "Storyteller", color: "#FFB400", soft: "#FFF6DC", line: "Warm, enthusiastic, connecting people through stories.", strengths: ["Inspires and excites people", "Naturally meets new people", "Shares the films and stories with energy"], moves: ["Recognition and stage", "Community and team events", "Helping friends succeed"], pressure: "Dislikes isolation and dry paperwork", coach: ["Praise their effort publicly", "Give them people to talk to, not spreadsheets"] },
  S: { name: "Anchor", color: "#14A05C", soft: "#E3F7EC", line: "Steady, loyal, building trust that lasts for years.", strengths: ["Consistent every single day", "Listens deeply", "Keeps team members from quitting"], moves: ["Safety and honesty", "Step-by-step clarity", "Serving their family"], pressure: "Dislikes sudden changes or hype", coach: ["Provide a calm, predictable rhythm", "Walk through the first 11 days together"] },
  C: { name: "Mapmaker", color: "#1F6FEB", soft: "#E9F2FF", line: "Thorough, exact, mastering every rule and document.", strengths: ["Knows the compensation plan cold", "Accurate with every disclosure", "Earns trust through precision"], moves: ["Mastering the details", "Truth and compliance", "Logical systems"], pressure: "Frustrated by sloppy claims or exaggeration", coach: ["Point to the document and page number", "Let them study before they present"] }
};

const QUESTIONS = [
  {
    q: "When you hear about a new goal, what is your first thought?",
    opts: [
      { k: "D", t: "How fast can we reach the summit?" },
      { k: "I", t: "Who can we bring with us to celebrate?" },
      { k: "S", t: "What is the steady, safe way to get there?" },
      { k: "C", t: "What are the exact rules and steps required?" }
    ]
  },
  {
    q: "In a conversation with a prospect, you naturally focus on:",
    opts: [
      { k: "D", t: "The potential and what they could achieve" },
      { k: "I", t: "Their story, their dreams and building rapport" },
      { k: "S", t: "Listening patiently to their concerns" },
      { k: "C", t: "Explaining the module facts and disclosure cleanly" }
    ]
  },
  {
    q: "What gives you the most satisfaction in your work?",
    opts: [
      { k: "D", t: "Hitting a rank and moving ahead" },
      { k: "I", t: "Hearing someone say thank you for introducing them" },
      { k: "S", t: "Knowing everything is stable and people are supported" },
      { k: "C", t: "Getting every calculation and detail 100% right" }
    ]
  },
  {
    q: "When faced with an unexpected obstacle:",
    opts: [
      { k: "D", t: "I push right through or find another path immediately" },
      { k: "I", t: "I call someone to talk through it and stay positive" },
      { k: "S", t: "I take a breath, stay calm and keep my routine" },
      { k: "C", t: "I review the facts and analyze where the error lies" }
    ]
  },
  {
    q: "Your team appreciates you most because you are:",
    opts: [
      { k: "D", t: "The one who shows where we are heading" },
      { k: "I", t: "The one who brings energy and excitement" },
      { k: "S", t: "The one they can always count on" },
      { k: "C", t: "The one who always knows the answer" }
    ]
  },
  {
    q: "When looking at the 7 Summits to Success, you notice first:",
    opts: [
      { k: "D", t: "Everest at the peak" },
      { k: "I", t: "How fun the journey will be with the team" },
      { k: "S", t: "Fuji and the manageable first steps" },
      { k: "C", t: "The volume qualifications and line balance ratios" }
    ]
  },
  {
    q: "If you had an extra hour today, you would spend it:",
    opts: [
      { k: "D", t: "Prospecting new potential leaders" },
      { k: "I", t: "Reconnecting with friends on WhatsApp" },
      { k: "S", t: "Checking in on a new member who just started" },
      { k: "C", t: "Studying the Momentum Plan Guide" }
    ]
  },
  {
    q: "What is your philosophy on success?",
    opts: [
      { k: "D", t: "Results speak louder than words" },
      { k: "I", t: "Together everyone achieves more" },
      { k: "S", t: "Slow and steady wins the race" },
      { k: "C", t: "Do it right or don't do it at all" }
    ]
  }
];

export default function Persona() {
  const { openUpsell } = useApp();
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ D: 0, I: 0, S: 0, C: 0 });
  const [finished, setFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleSelect(k) {
    const nextScores = { ...scores, [k]: scores[k] + 1 };
    setScores(nextScores);
    if (currentQ + 1 < QUESTIONS.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
    }
  }

  function handleReset() {
    setCurrentQ(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setFinished(false);
    setCopied(false);
  }

  // Calculate primary style
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primaryKey = sorted[0][0];
  const primary = STYLES[primaryKey];
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;

  function handleShare() {
    const text = `My Delta One Climbing Style is: ${primary.name}! "${primary.line}"`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  return (
    <section className="persona" id="style">
      <div className="wrap">
        <p className="kicker" style={{ color: 'var(--coral)' }}>A little fun · Your climbing style</p>
        <h2 className="section-title">What kind of climber are you?</h2>
        <p className="section-lede">
          Eight quick questions. Pick the line that sounds most like you. You get your style, what moves you, and how your sponsor can work with you best — and your sponsor learns the same about you. There are four styles, and every one of them reaches the summit.
        </p>

        {!finished ? (
          <div className="pq" id="pq">
            <div className="q">
              <p className="qn">Question {currentQ + 1} of {QUESTIONS.length}</p>
              <h3>{QUESTIONS[currentQ].q}</h3>
              <div className="opts">
                {QUESTIONS[currentQ].opts.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    className="opt"
                    onClick={() => handleSelect(opt.k)}
                  >
                    {opt.t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="pq-result" id="pq-result">
            <div className="pr-card" style={{ '--pc': primary.color, '--ps': primary.soft }}>
              <div className="pr-head">
                <span className="pr-badge">Your Climbing Style</span>
                <h3>{primary.name}</h3>
                <p className="pr-line">{primary.line}</p>
                <p className="goals-t" style={{ marginTop: '8px' }}>Your Style Breakdown</p>
                <div className="pr-bars">
                  {Object.entries(STYLES).map(([k, s]) => {
                    const pct = Math.round((scores[k] / total) * 100);
                    return (
                      <div key={k} className="pr-bar">
                        <span>{s.name}</span>
                        <div><i style={{ width: `${pct}%`, backgroundColor: s.color }}></i></div>
                        <b>{pct}%</b>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pr-grid">
                <div>
                  <p className="goals-t">Your Strengths</p>
                  <ul>
                    {primary.strengths.map((str, i) => <li key={i}>{str}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="goals-t">What Moves You</p>
                  <ul>
                    {primary.moves.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="goals-t">Under Pressure</p>
                  <p>{primary.pressure}</p>
                </div>
                <div>
                  <p className="goals-t">How Your Sponsor Can Work With You</p>
                  <ul>
                    {primary.coach.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>

              <div className="actions" style={{ padding: '0 28px 24px' }}>
                <button type="button" className="btn primary" id="pq-share" onClick={handleShare}>
                  {copied ? 'Copied to clipboard!' : 'Share my style'}
                </button>
                <button type="button" className="btn ghost" id="pq-again" onClick={handleReset}>
                  Take the test again
                </button>
              </div>

              <p className="pr-more free-el">
                Delta One VIP includes the full 20-question profile and your team's style map.{' '}
                <a
                  href="#upgrade"
                  data-upgrade="style"
                  onClick={(e) => {
                    e.preventDefault();
                    openUpsell();
                  }}
                >
                  Go VIP · 99 USDT/month
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

