import { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';

export default function Checkpoint() {
  const [answers, setAnswers] = useState({});

  function handleSelect(qIdx, optIdx) {
    if (answers[qIdx] !== undefined) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleReset() {
    setAnswers({});
  }

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.entries(answers).filter(([qIdx, optIdx]) => QUIZ_QUESTIONS[Number(qIdx)].ans === optIdx).length;

  return (
    <section className="quiz" id="check">
      <div className="wrap">
        <p className="kicker" style={{ color: 'var(--gold-ink)' }}>Checkpoint</p>
        <h2 className="section-title">Six questions. You know the plan when you can answer them.</h2>
        <p className="section-lede">
          Pick an answer. The right one lights up green, with the reason. A wrong answer is fine — that is how we learn. Your answers stay on your device; your training record keeps only the score.
        </p>

        <div className="qs">
          {QUIZ_QUESTIONS.map((q, qIdx) => {
            const userChoice = answers[qIdx];
            const isAnswered = userChoice !== undefined;

            return (
              <div key={qIdx} className={`q${isAnswered ? ' locked' : ''}`} data-ans={q.ans}>
                <p className="qn">Question {qIdx + 1} of {QUIZ_QUESTIONS.length}</p>
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
                {isAnswered && (
                  <p className="why">{q.why}</p>
                )}
              </div>
            );
          })}
        </div>

        {answeredCount === QUIZ_QUESTIONS.length && (
          <p id="qresult">
            {correctCount === QUIZ_QUESTIONS.length
              ? `Outstanding! ${correctCount} of ${QUIZ_QUESTIONS.length} correct. You have mastered the plan rules.`
              : `You scored ${correctCount} of ${QUIZ_QUESTIONS.length}. Review the explanations above or try again.`}
          </p>
        )}

        <div className="actions" style={{ marginTop: '22px' }}>
          <button type="button" className="btn ghost" id="qagain" onClick={handleReset}>
            Try again
          </button>
          <button
            type="button"
            className="btn primary next"
            onClick={() => document.getElementById('teach')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Next: say it in your own words ▸
          </button>
        </div>
      </div>
    </section>
  );
}

