import React, { useState } from 'react';
import ClimbingQuiz from './ClimbingQuiz';

const QUESTIONS = [
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

export default function CheckpointQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [teachText, setTeachText] = useState(() => {
    try {
      return localStorage.getItem('d1_teach_words') || '';
    } catch (e) {
      return '';
    }
  });
  const [showModel, setShowModel] = useState(false);
  const [teachStatus, setTeachStatus] = useState('');

  const handleSelect = (qIdx, optIdx) => {
    if (selectedAnswers[qIdx] !== undefined) return; // already answered
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, optIdx]) => QUESTIONS[parseInt(qIdx)].ans === optIdx
  ).length;

  const handleSaveWords = () => {
    try {
      localStorage.setItem('d1_teach_words', teachText);
      setTeachStatus('Saved to device.');
      setTimeout(() => setTeachStatus(''), 3000);
    } catch (e) {
      setTeachStatus('Could not save.');
    }
  };

  return (
    <section className="zone checkzone quiz py-16 bg-d1surface border-t border-d1line" id="check">
      <div className="wrap max-w-[1160px] mx-auto px-6">
        <div className="zone-head flex items-start gap-4 mb-8">
          <span className="zone-ic w-10 h-10 rounded-full bg-d1s3-bg text-d1gold-ink grid place-content-center font-bold text-lg flex-shrink-0">
            ✓
          </span>
          <div>
            <p className="kicker text-xs font-bold uppercase tracking-widest text-d1gold-ink">
              Checkpoint
            </p>
            <h2 className="section-title text-2xl md:text-3xl font-display font-bold text-d1fg mt-1">
              Six questions. You know the plan when you can answer them.
            </h2>
            <p className="section-lede text-sm text-d1muted max-w-3xl mt-1 leading-relaxed">
              Pick an answer. The right one lights up green, with the reason. A wrong answer is fine — that is how we learn. Your answers stay on your device; your training record keeps only the score.
            </p>
          </div>
        </div>

        {/* 6 Questions Grid */}
        <div className="qs grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUESTIONS.map((item, qIdx) => {
            const chosen = selectedAnswers[qIdx];
            const isAnswered = chosen !== undefined;
            const isCorrect = chosen === item.ans;

            return (
              <div
                key={qIdx}
                className="q p-6 rounded-2xl border border-d1line bg-d1bg flex flex-col justify-between"
              >
                <div>
                  <p className="qn text-[11px] font-bold uppercase tracking-wider text-d1gold-ink mb-2">
                    Question {qIdx + 1} of 6
                  </p>
                  <h3 className="text-base font-bold font-display text-d1fg mb-4">
                    {item.q}
                  </h3>
                  <div className="opts space-y-2">
                    {item.opts.map((opt, optIdx) => {
                      let btnStyle = "border-d1line bg-d1surface text-d1fg hover:border-d1blue";

                      if (isAnswered) {
                        if (optIdx === item.ans) {
                          btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold";
                        } else if (optIdx === chosen) {
                          btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300";
                        } else {
                          btnStyle = "opacity-40 border-d1line bg-d1surface text-d1muted";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelect(qIdx, optIdx)}
                          className={`opt w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current grid place-content-center text-[10px] flex-shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isAnswered && (
                  <p className="why text-xs text-d1muted mt-4 p-3 rounded-lg bg-d1surface border-l-4 border-d1ok animate-fade-in">
                    {item.why}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Score & Actions */}
        {answeredCount > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-d1bg border border-d1line flex items-center justify-between flex-wrap gap-4">
            <span className="text-sm font-semibold text-d1fg">
              Score: {correctCount} of {QUESTIONS.length} correct
              {answeredCount === QUESTIONS.length && correctCount === QUESTIONS.length && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-2">
                  — Excellent! You know the plan.
                </span>
              )}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-1.5 text-xs rounded-full border border-d1line bg-d1surface text-d1fg hover:border-d1blue font-semibold"
              >
                Try again
              </button>
              <a
                href="#teach"
                className="px-4 py-1.5 text-xs rounded-full bg-d1blue-ink text-white hover:bg-d1blue font-bold inline-flex items-center gap-1"
              >
                Next: say it in your own words →
              </a>
            </div>
          </div>
        )}

        {/* Say it in your own words */}
        <details className="shelf more-check mt-10 rounded-2xl border border-d1line bg-d1surface overflow-hidden" id="teach">
          <summary className="p-5 cursor-pointer flex items-center justify-between bg-d1bg select-none">
            <span className="sh-t flex items-center gap-3">
              <h3 className="text-base font-bold font-display text-d1fg">
                Say it in your own words
              </h3>
              <span className="cnt text-[11px] font-bold text-d1gold-ink uppercase">
                3 sentences
              </span>
            </span>
            <span className="sh-s text-xs text-d1muted hidden md:inline">
              If you can teach it, you know it.
            </span>
          </summary>
          <div className="p-6 space-y-4">
            <p className="text-sm text-d1muted leading-relaxed">
              Explain the Momentum Plan to a friend in three sentences: what you buy, how introducing people pays, and what is never promised.
            </p>
            <div className="teach-box space-y-3">
              <textarea
                rows="4"
                value={teachText}
                onChange={(e) => setTeachText(e.target.value)}
                placeholder="1. You buy a module…  2. When you introduce someone…  3. Nothing is…"
                className="w-full p-4 rounded-xl border border-d1line bg-d1bg text-sm text-d1fg focus:outline-none focus:border-d1blue leading-relaxed"
              />
              <div className="actions flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleSaveWords}
                  className="px-4 py-2 text-xs rounded-full bg-d1blue-ink text-white font-bold hover:bg-d1blue"
                >
                  Save my words
                </button>
                <button
                  type="button"
                  onClick={() => setShowModel(prev => !prev)}
                  className="px-4 py-2 text-xs rounded-full border border-d1line bg-d1bg text-d1fg font-semibold hover:border-d1blue"
                >
                  {showModel ? 'Hide model answer' : 'Show the model answer'}
                </button>
                {teachStatus && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    {teachStatus}
                  </span>
                )}
              </div>

              {showModel && (
                <div className="model p-5 rounded-xl bg-d1s3-bg border border-d1gold/30 text-xs text-d1fg space-y-2 mt-4 animate-fade-in">
                  <p className="font-bold uppercase tracking-wider text-d1gold-ink">A model answer</p>
                  <p>1. You buy a module. It is a software purchase, and at the engine's average daily result it can give back up to two times its price, price included.</p>
                  <p>2. When you introduce people, you get 2% of what their contracts earn each day, on up to 21 levels, depending on your rank. Leaders add the breakage differential.</p>
                  <p>3. Nothing is promised: some days are zero, the price cannot be refunded, and most members earn no commission at all.</p>
                  <p className="font-bold text-d1gold-ink pt-2">Your homework</p>
                  <p>Say it out loud to one real person this week. That is the whole test.</p>
                </div>
              )}
            </div>
          </div>
        </details>

        {/* Climbing Style Quiz */}
        <details className="shelf more-check persona mt-6 rounded-2xl border border-d1line bg-d1surface overflow-hidden" id="style">
          <summary className="p-5 cursor-pointer flex items-center justify-between bg-d1bg select-none">
            <span className="sh-t flex items-center gap-3">
              <h3 className="text-base font-bold font-display text-d1fg">
                A little fun · What kind of climber are you?
              </h3>
              <span className="cnt text-[11px] font-bold text-d1gold-ink uppercase">
                8 questions
              </span>
            </span>
            <span className="sh-s text-xs text-d1muted hidden md:inline">
              Four styles; every one reaches the summit.
            </span>
          </summary>
          <div className="p-6">
            <ClimbingQuiz isFull={false} />
          </div>
        </details>
      </div>
    </section>
  );
}

