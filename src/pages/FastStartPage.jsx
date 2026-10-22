import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const RANKS = ["None", "Fuji", "Kilimanjaro", "Matterhorn", "Denali", "Rainier", "K-2", "Everest"];
const DEPTH = [0, 3, 6, 9, 12, 15, 18, 21];
const CAP = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000];
const REQ = [
  null,
  [1000, 2, 2000],      // Fuji
  [2500, 3, 5000],      // Kilimanjaro
  [6000, 4, 12000],     // Matterhorn
  [12000, 5, 25000],    // Denali
  [25000, 7, 75000],    // Rainier
  [50000, 12, 250000],  // K-2
  [200000, 21, 1000000] // Everest
];
const SHARE = [null, 1/2, 1/2, 1/3, 1/3, 1/4, 1/5, 1/5];

export default function FastStartPage() {
  const [ownModule, setOwnModule] = useState(1000);
  const [enrolled, setEnrolled] = useState(2);
  const [line1, setLine1] = useState(1000);
  const [line2, setLine2] = useState(1000);
  const [line3, setLine3] = useState(0);

  const [ticks, setTicks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('d1fs-ticks') || '{}') || {};
    } catch (e) {
      return {};
    }
  });

  const toggleTick = (id) => {
    setTicks(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('d1fs-ticks', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const lines = [parseFloat(line1) || 0, parseFloat(line2) || 0, parseFloat(line3) || 0];

  const qualification = useMemo(() => {
    const own = parseFloat(ownModule) || 0;
    const pe = parseInt(enrolled) || 0;

    for (let r = 7; r >= 1; r--) {
      const [d, reqPe, qv] = REQ[r];
      const lim = SHARE[r] * qv;
      const counted = lines.reduce((sum, v) => sum + Math.min(v, lim), 0);
      if (own >= d && pe >= reqPe && counted >= qv) {
        return { rank: r, rankName: RANKS[r], counted, lim, qv, pe, d, qualified: true };
      }
    }
    return { rank: 0, rankName: "None", counted: lines.reduce((a, b) => a + b, 0), qualified: false };
  }, [ownModule, enrolled, line1, line2, line3]);

  return (
    <div className="min-h-screen bg-d1bg text-d1fg font-sans">
      {/* Top Bar */}
      <div className="bg-[#0B1A33] text-white px-6 py-3 flex items-center justify-between border-b border-[#2A3C5E]">
        <Link to="/" className="text-white hover:text-d1gold text-sm font-semibold flex items-center gap-2">
          ← Back to Delta One VIP
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#A9BAD6] hidden sm:inline">Fast Start Planner</span>
          <ThemeToggle />
        </div>
      </div>

      <div className="wrap max-w-[980px] mx-auto px-6 py-10 space-y-8">
        <header className="hero space-y-2">
          <p className="eyebrow text-xs uppercase tracking-widest font-bold text-d1gold">
            Delta One · 90-day momentum planner
          </p>
          <h1 className="text-3xl md:text-5xl font-light text-d1fg font-display">
            Your First 90 Days
          </h1>
          <p className="lede text-sm text-d1muted max-w-2xl leading-relaxed">
            The straight path from your first day to leadership. Plan your volume, check your Line Balance qualification in real time, and tick your daily tasks.
          </p>
        </header>

        {/* Qualification Calculator */}
        <div className="panel p-6 rounded-2xl border border-d1line bg-d1surface shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-d1line pb-4">
            <div>
              <h2 className="text-xl font-bold font-display text-d1fg">
                Rank Qualification Simulator
              </h2>
              <p className="text-xs text-d1muted">
                Tested against the official Momentum Plan Line Balance Rules.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-d1muted">Current Rank:</span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                qualification.rank > 0
                  ? 'bg-emerald-500 text-white'
                  : 'bg-d1line text-d1muted'
              }`}>
                {qualification.rankName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-d1muted mb-1">
                Your Module (USDT)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={ownModule}
                onChange={(e) => setOwnModule(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-d1line bg-d1bg text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-d1muted mb-1">
                Enrolled Members
              </label>
              <input
                type="number"
                min="0"
                value={enrolled}
                onChange={(e) => setEnrolled(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-d1line bg-d1bg text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-d1muted mb-1">
                Line 1 Volume
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-d1line bg-d1bg text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-d1muted mb-1">
                Line 2 Volume
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-d1line bg-d1bg text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-d1muted mb-1">
                Line 3 Volume
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={line3}
                onChange={(e) => setLine3(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-d1line bg-d1bg text-sm font-semibold"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-d1bg border border-d1line text-xs text-d1muted flex items-center justify-between flex-wrap gap-2">
            <span>
              Total Counted Qualifying Volume (QV): <b className="text-d1fg">{qualification.counted.toLocaleString()} USDT</b>
            </span>
            <span>
              Daily Cap at Rank: <b className="text-d1fg">{CAP[qualification.rank].toLocaleString()} USDT / day</b>
            </span>
            <span>
              Depth: <b className="text-d1fg">{DEPTH[qualification.rank]} Levels</b>
            </span>
          </div>
        </div>

        {/* 90-Day Milestones */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-display text-d1fg">
            Three 30-Day Milestones
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-d1line bg-d1surface shadow-sm space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-d1gold">
                Days 1 to 30 · Summit 1
              </span>
              <h3 className="text-lg font-bold font-display text-d1fg">
                Fuji Qualified
              </h3>
              <p className="text-xs text-d1muted leading-relaxed">
                Own module of 1,000 USDT, 2 personally enrolled, and 2,000 QV across at least two lines (max 50% from one line).
              </p>
              <div className="pt-2 border-t border-d1line text-xs font-semibold text-d1fg flex items-center justify-between">
                <span>Daily Cap:</span>
                <span>1,000 USDT</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-d1line bg-d1surface shadow-sm space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-d1gold">
                Days 31 to 60 · Summit 2
              </span>
              <h3 className="text-lg font-bold font-display text-d1fg">
                Kilimanjaro
              </h3>
              <p className="text-xs text-d1muted leading-relaxed">
                Own module of 2,500 USDT, 3 personally enrolled, 5,000 QV. Unlocks 6 levels of depth.
              </p>
              <div className="pt-2 border-t border-d1line text-xs font-semibold text-d1fg flex items-center justify-between">
                <span>Daily Cap:</span>
                <span>2,000 USDT</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-d1line bg-d1surface shadow-sm space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-d1gold">
                Days 61 to 90 · Summit 3
              </span>
              <h3 className="text-lg font-bold font-display text-d1fg">
                Matterhorn
              </h3>
              <p className="text-xs text-d1muted leading-relaxed">
                Own module of 6,000 USDT, 4 personally enrolled, 12,000 QV (max 33% from one line). Unlocks 9 levels.
              </p>
              <div className="pt-2 border-t border-d1line text-xs font-semibold text-d1fg flex items-center justify-between">
                <span>Daily Cap:</span>
                <span>3,000 USDT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Checklist */}
        <div className="panel p-6 rounded-2xl border border-d1line bg-d1surface shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-display text-d1fg">
            Daily Habits Checklist
          </h2>
          <p className="text-xs text-d1muted">
            Tick your daily commitments. Stored on this device to keep your momentum steady.
          </p>

          <div className="space-y-2.5 pt-2">
            {[
              { id: "task1", text: "Watch or review 1 short film from The Journey" },
              { id: "task2", text: "Read 2 pages of Key Facts or The Plan in Simple Words" },
              { id: "task3", text: "Start 1 honest conversation using the Language Card" },
              { id: "task4", text: "Check line balance in dashboard and support downline members" },
              { id: "task5", text: "Review disclosure line: 'Most members earn no commission at all'" }
            ].map(task => (
              <label
                key={task.id}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-d1line bg-d1bg cursor-pointer hover:border-d1gold transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!ticks[task.id]}
                  onChange={() => toggleTick(task.id)}
                  className="w-4 h-4 accent-[#E8A912] rounded cursor-pointer"
                />
                <span className={`text-xs font-medium ${ticks[task.id] ? 'line-through text-d1muted' : 'text-d1fg'}`}>
                  {task.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        <footer className="text-center text-xs text-d1muted pt-8 border-t border-d1line">
          Delta One Fast Start · Always verify results and maintain line balance.
        </footer>
      </div>
    </div>
  );
}

