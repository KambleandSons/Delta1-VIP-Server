import { useState } from 'react';

const SAMPLE_QUESTIONS = [
  { q: "Is the breakage differential capped per day?", opts: ["No — no cap and no depth limit", "Yes, 7,000 USDT a day", "Yes, at the rank's daily cap", "Yes, 42 USDT a day"], ans: 0, why: "The differential has no daily cap and no depth limit. The daily caps apply to the base matrix only." },
  { q: "When is settlement?", opts: ["Every day at 12:00 UTC", "Every Friday", "Every day at midnight UTC", "Once a month"], ans: 0, why: "Every day at 12:00 UTC. Results and commissions are credited to the app wallet in USDT." },
  { q: "What is the minimum withdrawal from the app wallet?", opts: ["5 USDT, instant, gas fee only", "100 USDT, monthly", "50 USDT, with a 5% fee", "There is no withdrawal before 2×"], ans: 0, why: "Withdraw any time, 5 USDT minimum, instant, gas fee only — results and commissions, never the purchase price." },
  { q: "Which word do we use for putting money into a module?", opts: ["Purchase", "Deposit", "Investment", "Capital"], ans: 0, why: "A module is a purchase. Never deposit, invest, investment, principal or capital." },
  { q: "Which word do we use for what the engine produces for a module?", opts: ["Result (daily result, average daily result)", "Return", "Interest", "Yield"], ans: 0, why: "Result — never return, ROI, yield, interest or dividend." },
  { q: "Which word do we use when a result buys a new module?", opts: ["Rebuy / Auto-Rebuy", "Reinvest", "Compound", "Roll over"], ans: 0, why: "Rebuy and Auto-Rebuy — never reinvest, compound or roll over." },
  { q: "Which word do we use for what members earn from the plan?", opts: ["Rewards (commission: base matrix, breakage differential)", "Passive income", "Residual income", "Profit"], ans: 0, why: "Rewards; commission, base matrix, breakage differential. Never passive income, residual, bonus pool or recruitment bonus." },
  { q: "Which sentence must go with every conversation about money, results or rewards?", opts: ["Every figure is an illustration at the engine's average daily result; results and rewards are not guaranteed, and most members earn no commission at all", "The engine never has a zero day", "A module pays every day, no matter what", "Returns are guaranteed by the DAO Treasury"], ans: 0, why: "The disclosure line: illustrations at the average; not guaranteed; most members earn no commission at all." },
  { q: "A prospect asks 'is my money safe?' The right answer is…", opts: ["Nothing is guaranteed: the price is not refundable and can be lost; only purchase with money you can afford to lose", "Yes, the Treasury protects it", "Yes, the engine has never lost", "It is as safe as a bank"], ans: 0, why: "Never promise safety. The purchase price is not refundable and can be lost in whole or in part; only purchase with money you can afford to lose." },
  { q: "Can you tell a prospect a module pays 0.50% every day?", opts: ["No — 0.50% is the average; days vary from zero to several percent and the average can change", "Yes, it is the published rate", "Yes, if they are a Believer", "Yes, after day 11"], ans: 0, why: "0.50% a day is an average over time, never a daily promise. Say 'average' every time a rate or a date appears." },
  { q: "A Denali (24%) sits above a Fuji (6%) at the head of a line. What gap does the Denali collect on that line's contracts?", opts: ["18 points", "24 points", "6 points", "30 points"], ans: 0, why: "24 − 6 = 18 points of the contract's earnings, after the base matrix already paid." },
  { q: "At Fuji, how much of your volume can one single line count for?", opts: ["Half, at most (50%)", "A fifth (20%)", "A third (33⅓%)", "All of it"], ans: 0, why: "Half at Fuji and Kilimanjaro, a third at Matterhorn and Denali, a quarter at Rainier, a fifth at K-2 and Everest." },
  { q: "What is the daily base-matrix cap at Everest?", opts: ["7,000 USDT", "1,000 USDT", "10,000 USDT", "No cap"], ans: 0, why: "The daily base matrix caps range from 1,000 USDT at Fuji up to 7,000 USDT at Everest." },
  { q: "What is the maximum return for a Believer module?", opts: ["2.2× its purchase price", "2.0× its purchase price", "3.0× its purchase price", "Unlimited"], ans: 0, why: "A Believer module locks Auto-Rebuy for its entire life and delivers up to 2.2×." },
  { q: "How is trading profit split per 100 USDT?", opts: ["50 to members, 25 to plan, 25 to DAO Treasury", "100 to members", "70 to members, 30 to company", "42 to members, 58 to DAO"], ans: 0, why: "50 USDT to members, 25 USDT to the plan commissions, 25 USDT to the DAO Treasury." }
];

export default function Cert() {
  const [name, setName] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);
  const [certId, setCertId] = useState('');

  function handleStart() {
    if (!name.trim()) return;
    setInProgress(true);
    setCurrentIdx(0);
    setScore(0);
    setAnswered(false);
    setSelectedOpt(null);
    setFinished(false);
  }

  function handleAnswer(optIdx) {
    if (answered) return;
    setSelectedOpt(optIdx);
    setAnswered(true);
    const isRight = optIdx === SAMPLE_QUESTIONS[currentIdx].ans;
    if (isRight) setScore(s => s + 1);
  }

  function handleNext() {
    if (currentIdx + 1 < SAMPLE_QUESTIONS.length) {
      setCurrentIdx(i => i + 1);
      setAnswered(false);
      setSelectedOpt(null);
    } else {
      setFinished(true);
      const finalScore = score + (selectedOpt === SAMPLE_QUESTIONS[currentIdx].ans ? 1 : 0);
      const isPass = finalScore === SAMPLE_QUESTIONS.length;
      setPassed(isPass);
      if (isPass) {
        setCertId('D1-CPM-' + Date.now().toString(36).toUpperCase());
      }
    }
  }

  return (
    <section className="certs" id="cert">
      <div className="wrap">
        <p className="kicker" style={{ color: 'var(--gold-ink)' }}>Certification · Certified Compensation Plan Master</p>
        <h2 className="section-title">Do you understand the compensation plan? Let's find out.</h2>
        <p className="section-lede">
          Aria asks questions on every rule, every rank, every number, and the words we use. A Certified Compensation Plan Master gets them all right. Take it as often as you like. Only a certified member may train others on the plan.
        </p>

        <div className="cert-box" id="cert-box">
          {!inProgress && !finished && (
            <>
              <div className="aria-say">
                <img src="/img/host.svg" alt="" />
                <p>
                  Hello. Before anyone trains others on the plan, I ask them about the rules, ranks, numbers, and the words we use. You need all of them right, and you can try as often as you like. Shall we?
                </p>
              </div>
              <div className="cert-start">
                <label className="field">
                  Your name, as it should appear on the certificate
                  <input
                    id="cert-name"
                    type="text"
                    maxLength={60}
                    placeholder="First and last name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </label>
                <div className="actions">
                  <button type="button" className="btn primary next" id="cert-go" onClick={handleStart}>
                    Start the test · {SAMPLE_QUESTIONS.length} questions
                  </button>
                </div>
              </div>
            </>
          )}

          {inProgress && !finished && (
            <div className="q cert-q">
              <div className="cert-top">
                <span className="qn">Question {currentIdx + 1} of {SAMPLE_QUESTIONS.length}</span>
                <span className="qn">{score} right</span>
              </div>
              <div className="bar">
                <i style={{ width: `${Math.round((currentIdx / SAMPLE_QUESTIONS.length) * 100)}%` }}></i>
              </div>
              <h3>{SAMPLE_QUESTIONS[currentIdx].q}</h3>
              <div className="opts">
                {SAMPLE_QUESTIONS[currentIdx].opts.map((opt, i) => {
                  let optClass = 'opt';
                  if (answered) {
                    if (i === SAMPLE_QUESTIONS[currentIdx].ans) optClass += ' right';
                    else if (i === selectedOpt) optClass += ' wrong';
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      className={optClass}
                      onClick={() => handleAnswer(i)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <>
                  <p className="why">
                    {selectedOpt === SAMPLE_QUESTIONS[currentIdx].ans ? 'Right. ' : 'Not this one. '}
                    {SAMPLE_QUESTIONS[currentIdx].why}
                  </p>
                  <div className="actions" style={{ marginTop: '14px' }}>
                    <button type="button" className="btn primary" onClick={handleNext}>
                      {currentIdx + 1 === SAMPLE_QUESTIONS.length ? 'See my result' : 'Next question ▸'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {finished && (
            <>
              {passed ? (
                <>
                  <div className="aria-say">
                    <img src="/img/host.svg" alt="" />
                    <p>
                      All correct! You know the plan, {name} — every rule, every number, and the words. You may train others on it now. Here is your certificate:
                    </p>
                  </div>
                  <div className="cert-card" id="cert-card">
                    <div className="cert-in">
                      <p className="cert-k">Delta One · Momentum Plan</p>
                      <h3>Certified Compensation Plan Master</h3>
                      <p className="cert-n">{name}</p>
                      <p className="cert-s">
                        answered every question on the module, the split, the base matrix, the seven ranks, the line balance rule, the breakage differential, settlement and the words we use, and may train others on the plan.
                      </p>
                      <p className="cert-m">
                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · Certificate {certId}
                      </p>
                    </div>
                  </div>
                  <div className="actions" style={{ marginTop: '14px' }}>
                    <button type="button" className="btn ghost" onClick={() => { setFinished(false); setInProgress(false); }}>
                      Back to start
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="aria-say">
                    <img src="/img/host.svg" alt="" />
                    <p>
                      {score} of {SAMPLE_QUESTIONS.length} correct. Close! A Certified Master gets every question right to ensure complete accuracy when speaking to prospects. Review the library documents and try again.
                    </p>
                  </div>
                  <div className="actions" style={{ marginTop: '14px' }}>
                    <button type="button" className="btn primary next" onClick={handleStart}>
                      Try again
                    </button>
                    <a className="btn ghost" href="#library">Open the library</a>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

