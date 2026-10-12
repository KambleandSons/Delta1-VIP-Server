import { useState } from 'react';

const REVIEW_QUESTIONS = [
  {
    q: "What is the maximum return of a standard module?",
    opts: ["1.5×", "2× its purchase price", "3×"],
    ans: 1,
    why: "A module can return up to 2× its purchase price (or 2.2× for a Believer)."
  },
  {
    q: "When does the Auto-Rebuy switch unlock?",
    opts: ["Day 1", "Day 11", "Day 30"],
    ans: 1,
    why: "Day 11 is when you can choose to continue auto-rebuy or direct rewards to your wallet."
  },
  {
    q: "What percentage is paid per level on the base matrix?",
    opts: ["1%", "2%", "5%"],
    ans: 1,
    why: "The base matrix pays 2% per unlocked level based on rank."
  }
];

export default function Review() {
  const [answers, setAnswers] = useState({});
  const [showQuestions, setShowQuestions] = useState(false);

  function handleSelect(qIdx, optIdx) {
    if (answers[qIdx] !== undefined) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.entries(answers).filter(([qIdx, optIdx]) => REVIEW_QUESTIONS[Number(qIdx)].ans === optIdx).length;

  return (
    <section className="review" id="review">
      <div className="wrap">
        <p className="kicker" style={{ color: 'var(--gold-ink)' }}>Review · day 1, day 3, day 7</p>
        <h2 className="section-title">A little review, three times.</h2>
        <p className="section-lede">
          Things stick when you meet them again. After your checkpoint, three quick questions come back tomorrow, then in three days, then in a week. The page remembers the dates on your device.
        </p>
        <div className="review-box" id="review-box">
          <p id="review-when" className="review-when">
            Your Day 1 review is ready today.{' '}
            <button
              type="button"
              className="btn primary sm-btn"
              style={{ marginLeft: '12px' }}
              onClick={() => setShowQuestions(true)}
            >
              Start 2-min review
            </button>
          </p>

          {showQuestions && (
            <div className="qs" id="review-qs" style={{ marginTop: '18px' }}>
              {REVIEW_QUESTIONS.map((q, qIdx) => {
                const userChoice = answers[qIdx];
                const isAnswered = userChoice !== undefined;

                return (
                  <div key={qIdx} className={`q${isAnswered ? ' locked' : ''}`}>
                    <p className="qn">Review Question {qIdx + 1} of {REVIEW_QUESTIONS.length}</p>
                    <h3>{q.q}</h3>
                    <div className="opts">
                      {q.opts.map((opt, optIdx) => {
                        let optClass = 'opt';
                        if (isAnswered) {
                          if (optIdx === q.ans) optClass += ' right';
                          else if (optIdx === userChoice) optClass += ' wrong';
                        }
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            className={optClass}
                            onClick={() => handleSelect(qIdx, optIdx)}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {isAnswered && <p className="why">{q.why}</p>}
                  </div>
                );
              })}
            </div>
          )}

          {answeredCount === REVIEW_QUESTIONS.length && (
            <p id="review-result">
              ✓ Review complete! {correctCount} of {REVIEW_QUESTIONS.length} correct. Next review due in 3 days.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

