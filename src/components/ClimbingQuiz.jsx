import React, { useState, useMemo } from 'react';
import personaData from '../data/persona-data.json';

const KEYS = ['D', 'I', 'S', 'C'];

export default function ClimbingQuiz({ isFull = false }) {
  const items = useMemo(() => {
    return isFull ? personaData.items : personaData.items.filter(it => it.light);
  }, [isFull]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState({ D: 0, I: 0, S: 0, C: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentItem = items[currentIndex];

  const handleSelect = (keyIndex) => {
    const key = KEYS[keyIndex];
    setScores(prev => ({ ...prev, [key]: prev[key] + 1 }));

    if (currentIndex + 1 < items.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setIsFinished(false);
    setCopied(false);
  };

  // Calculate winner style
  const topStyleKey = useMemo(() => {
    let max = -1;
    let win = 'D';
    KEYS.forEach(k => {
      if (scores[k] > max) {
        max = scores[k];
        win = k;
      }
    });
    return win;
  }, [scores]);

  const topStyle = personaData.styles.find(s => s.k === topStyleKey) || personaData.styles[0];

  const handleCopy = () => {
    const text = `My Delta One climbing style: ${topStyle.name} (${topStyle.word}). ${topStyle.line} How to work with me: ${topStyle.coach[0]}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const totalVotes = items.length || 1;

  if (isFinished) {
    return (
      <div className="pq-result p-6 rounded-2xl bg-d1surface border border-d1line shadow-sm animate-fade-in space-y-6">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-md"
            style={{ backgroundColor: topStyle.color }}
          >
            {topStyle.k}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-d1gold-ink">
              Your Primary Climbing Style
            </span>
            <h3 className="text-2xl font-bold font-display text-d1fg mt-0.5">
              {topStyle.name} <span className="text-base font-normal text-d1muted">({topStyle.word})</span>
            </h3>
            <p className="text-sm text-d1muted mt-1 italic">"{topStyle.line}"</p>
          </div>
        </div>

        {/* Style Distribution Bars */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-d1fg">
            How strongly each style shows up
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {personaData.styles.map(s => {
              const pct = Math.round((scores[s.k] / totalVotes) * 100);
              return (
                <div key={s.k} className="p-3 rounded-xl bg-d1bg border border-d1line">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span style={{ color: s.color }}>{s.name} ({s.k})</span>
                    <span className="text-d1muted">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-d1line overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths & How to Coach */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-d1bg border border-d1line">
            <h4 className="text-xs font-bold uppercase tracking-wider text-d1fg mb-2">
              Your Strengths
            </h4>
            <ul className="text-xs text-d1muted space-y-1.5 list-disc pl-4">
              {topStyle.strengths.map((str, i) => (
                <li key={i}>{str}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-d1bg border border-d1line">
            <h4 className="text-xs font-bold uppercase tracking-wider text-d1fg mb-2">
              How Your Sponsor Can Work With You
            </h4>
            <ul className="text-xs text-d1muted space-y-1.5 list-disc pl-4">
              {topStyle.coach.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
          <button
            type="button"
            onClick={handleRestart}
            className="px-4 py-2 text-xs font-semibold rounded-full border border-d1line bg-d1bg hover:bg-d1surface text-d1fg transition-colors"
          >
            Retake Quiz
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-5 py-2 text-xs font-bold rounded-full bg-d1blue-ink text-white hover:bg-d1blue transition-colors shadow-sm"
          >
            {copied ? '✓ Copied to clipboard!' : 'Share my style with my sponsor'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pq p-6 rounded-2xl bg-d1surface border border-d1line shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-d1gold-ink">
          Question {currentIndex + 1} of {items.length}
        </span>
        <span className="text-xs text-d1muted">Pick the line most like you</span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-d1line mb-6 overflow-hidden">
        <div
          className="h-full bg-d1blue-ink transition-all duration-300"
          style={{ width: `${((currentIndex) / items.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {currentItem.o.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(idx)}
            className="text-left p-4 rounded-xl border border-d1line bg-d1bg hover:border-d1blue hover:bg-d1surface transition-all text-sm font-medium text-d1fg flex items-center justify-between group"
          >
            <span>{opt}</span>
            <span className="w-6 h-6 rounded-full border border-d1line group-hover:border-d1blue group-hover:bg-d1blue group-hover:text-white flex items-center justify-center text-xs font-bold text-d1muted flex-shrink-0 ml-3">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

