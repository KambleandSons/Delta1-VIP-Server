import { useState, useEffect } from 'react';

export default function Teach() {
  const [text, setText] = useState(() => {
    try { return localStorage.getItem('d1teach') || ''; } catch { return ''; }
  });
  const [showModel, setShowModel] = useState(false);
  const [status, setStatus] = useState('');

  function handleSave() {
    try {
      localStorage.setItem('d1teach', text);
      setStatus('Saved to your device.');
      setTimeout(() => setStatus(''), 3000);
    } catch {
      setStatus('Could not save.');
    }
  }

  return (
    <section className="teach" id="teach">
      <div className="wrap">
        <p className="kicker" style={{ color: 'var(--teal-ink)' }}>Say it in your own words</p>
        <h2 className="section-title">If you can teach it, you know it.</h2>
        <p className="section-lede">
          Explain the Momentum Plan to a friend in three sentences: what you buy, how introducing people pays, and what is never promised. Write it here, then compare with the model answer. Your words go into your training record, so your sponsor can see how you explain it.
        </p>

        <div className="teach-box">
          <label className="sr" htmlFor="teach-text">Your three sentences</label>
          <textarea
            id="teach-text"
            rows={5}
            placeholder="1. You buy a module…  2. When you introduce someone…  3. Nothing is…"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="actions">
            <button type="button" className="btn primary" id="teach-save" onClick={handleSave}>
              Save my words
            </button>
            <button
              type="button"
              className="btn ghost"
              id="teach-model"
              onClick={() => setShowModel(prev => !prev)}
            >
              {showModel ? 'Hide the model answer' : 'Show the model answer'}
            </button>
            {status && <span className="status ok" id="teach-status">{status}</span>}
          </div>

          {showModel && (
            <div className="model" id="teach-answer">
              <p className="goals-t">A model answer</p>
              <p>1. You buy a module. It is a software purchase, and at the engine's average daily result it can give back up to two times its price, price included.</p>
              <p>2. When you introduce people, you get 2% of what their contracts earn each day, on up to 21 levels, depending on your rank. Leaders add the breakage differential.</p>
              <p>3. Nothing is promised: some days are zero, the price cannot be refunded, and most members earn no commission at all.</p>
              <p className="goals-t" style={{ marginTop: '14px' }}>Your homework</p>
              <p>Say it out loud to one real person this week. That is the whole test.</p>
            </div>
          )}
        </div>

        <div className="actions" style={{ marginTop: '22px' }}>
          <button
            type="button"
            className="btn primary next"
            onClick={() => document.getElementById('review')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Next: review ▸
          </button>
        </div>
      </div>
    </section>
  );
}

