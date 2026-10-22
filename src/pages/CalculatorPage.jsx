import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function CalculatorPage() {
  const [amt, setAmt] = useState(1000);
  const [rate, setRate] = useState(0.005); // 0.50% default

  const money = (val, dec = 0) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    }) + ' USDT';
  };

  const simulate = (P, capMult, rebuyMult, switchOff, days) => {
    const mods = [[P, capMult * P, 0]];
    let wallet = 0;
    let cum = 0;
    let origEnd = null;
    const out = [];

    for (let day = 1; day <= days; day++) {
      let res = 0;
      const newMods = [];
      for (let i = 0; i < mods.length; i++) {
        const m = mods[i];
        if (m[2] < m[1]) {
          const x = Math.min(rate * m[0], m[1] - m[2]);
          m[2] += x;
          res += x;
        }
      }
      if (origEnd === null && mods[0][2] >= mods[0][1] - 1e-9) {
        origEnd = day;
      }
      cum += res;
      const toWallet = switchOff !== null && day > switchOff && day > 10;
      if (toWallet) {
        wallet += res;
      } else if (res > 0.001) {
        newMods.push([res, rebuyMult * res, 0]);
      }
      for (let j = 0; j < newMods.length; j++) {
        mods.push(newMods[j]);
      }
      let active = 0;
      for (let k = 0; k < mods.length; k++) {
        if (mods[k][2] < mods[k][1] - 1e-9) active++;
      }
      out.push({ day, res, cum, wallet, active, total: mods.length });
      if (switchOff !== null && day > switchOff && active === 0) break;
    }
    return { o: out, end: origEnd };
  };

  const P = Math.max(1000, parseFloat(amt) || 1000);
  const perDay = P * rate;
  const back = Math.round(1 / rate);
  const end = Math.round(2 / rate);
  const bEnd = Math.round(2.2 / rate);

  const tiles = [
    {
      label: 'Per day, on average',
      value: money(perDay, 2),
      sub: `${(rate * 100).toFixed(2)}% of ${money(P)}`,
    },
    {
      label: 'Purchase price back',
      value: `about day ${back}`,
      sub: `results equal ${money(P)}`,
    },
    {
      label: 'The module ends',
      value: `about day ${end}`,
      sub: `after delivering ${money(2 * P)} (2×)`,
    },
    {
      label: 'As a Believer',
      value: `about day ${bEnd}`,
      sub: `after delivering ${money(2.2 * P)} (2.2×)`,
    },
  ];

  // SVG Chart Calculation
  const chartData = useMemo(() => {
    const W = 900;
    const H = 290;
    const L = 56;
    const Rr = 20;
    const T = 24;
    const B = 70;
    const days = bEnd + 10;
    const maxY = 2.2 * P;

    const sx = (d) => L + ((W - L - Rr) * d) / days;
    const sy = (v) => T + (H - T - B) * (1 - v / maxY);

    const pts = [];
    const pb = [];
    const step = Math.max(1, Math.floor(days / 300));
    for (let d = 0; d <= days; d += step) {
      pts.push(`${sx(d)},${sy(Math.min(2 * P, perDay * d))}`);
      pb.push(`${sx(d)},${sy(Math.min(2.2 * P, perDay * d))}`);
    }

    return { W, H, L, Rr, T, B, sx, sy, pts: pts.join(' '), pb: pb.join(' ') };
  }, [P, perDay, bEnd]);

  // Simulation table data
  const simData = useMemo(() => {
    const s = simulate(P, 2.0, 2.0, 10, 4000);
    const b = simulate(P, 2.2, 2.2, bEnd, 6000);
    const sLast = s.o[s.o.length - 1] || { wallet: 0, day: 0, total: 1 };
    const bLast = b.o[b.o.length - 1] || { wallet: 0, day: 0, total: 1 };
    const b440 = b.o[Math.min(bEnd, b.o.length) - 1] || { total: 1 };

    return [
      ['Delivers in total', `200% · ${money(2 * P)}`, `220% · ${money(2.2 * P)}`],
      ['The original module ends', `about day ${s.end}`, `about day ${b.end}`],
      ['Modules created from results', `${sLast.total - 1} small rebuy modules (days 1–10)`, `${b440.total - 1} rebuy modules by day ${b.end}`],
      ['Wallet, when every module has finished', `${money(sLast.wallet)} by about day ${sLast.day}`, `${money(bLast.wallet)} by about day ${bLast.day}`],
      ['Nothing in the wallet until', 'day 11', `day ${b.end + 1}`],
      ['Can you change your mind?', 'Yes, the switch is yours from day 11', 'No: locked ON until 220%'],
    ];
  }, [P, rate, bEnd]);

  return (
    <div className="min-h-screen bg-d1bg text-d1fg font-sans">
      {/* Top Bar */}
      <div className="bg-[#0B1A33] text-white px-6 py-3 flex items-center justify-between border-b border-[#2A3C5E]">
        <Link to="/" className="text-white hover:text-d1gold text-sm font-semibold flex items-center gap-2">
          ← Back to Delta One VIP
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#A9BAD6] hidden sm:inline">Module Simulator</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Masthead */}
      <header className="mast bg-[#090A0C] text-[#F5F6F4] py-10 px-6">
        <div className="wrap max-w-[900px] mx-auto">
          <p className="k text-[11px] uppercase tracking-widest text-d1gold font-semibold mb-2">
            Delta One · module calculator
          </p>
          <h1 className="text-3xl md:text-5xl font-light text-white leading-tight font-display">
            What does one module do?
          </h1>
          <p className="text-sm text-[#C9CED4] max-w-2xl mt-3 leading-relaxed">
            Type an amount. See what a module of that size does at the engine's average daily result: the daily result, the day the purchase price is back, the day it ends, and the Believer version. Every figure is an average over time; real days vary from zero to several percent and nothing is guaranteed.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="wrap max-w-[900px] mx-auto px-6 py-8 space-y-8">
        {/* Input Card */}
        <div className="in p-6 rounded-xl border border-d1line bg-d1surface shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label htmlFor="amt" className="block text-xs font-semibold text-d1muted mb-2">
                Module size (USDT, min 1,000)
              </label>
              <input
                id="amt"
                type="number"
                min="1000"
                step="100"
                value={amt}
                onChange={(e) => setAmt(e.target.value)}
                className="w-full text-2xl font-light p-2.5 rounded-lg border border-d1line bg-d1bg text-d1fg focus:outline-none focus:border-d1blue"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-d1muted mb-2">
                Quick sizes
              </label>
              <div className="flex gap-2 flex-wrap">
                {[1000, 2500, 5000, 10000, 25000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmt(v)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                      P === v
                        ? 'border-d1gold bg-d1gold text-d1fg font-bold'
                        : 'border-d1line bg-d1surface text-d1fg hover:border-d1gold'
                    }`}
                  >
                    {v.toLocaleString()} USDT
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-d1muted mb-2">
              Average daily result
            </label>
            <div className="inline-flex rounded-lg border border-d1line overflow-hidden">
              <button
                type="button"
                onClick={() => setRate(0.005)}
                className={`px-4 py-2 text-xs font-medium transition-all ${
                  rate === 0.005
                    ? 'bg-[#090A0C] text-white font-bold'
                    : 'bg-d1surface text-d1fg'
                }`}
              >
                0.50% (the average)
              </button>
              <button
                type="button"
                onClick={() => setRate(0.0025)}
                className={`px-4 py-2 text-xs font-medium transition-all ${
                  rate === 0.0025
                    ? 'bg-[#090A0C] text-white font-bold'
                    : 'bg-d1surface text-d1fg'
                }`}
              >
                0.25% (a weaker year)
              </button>
            </div>
          </div>
        </div>

        {/* Tiles */}
        <div className="tiles grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiles.map((t, idx) => (
            <div
              key={idx}
              className="tile p-4 rounded-xl border-t-4 border-d1gold bg-d1surface border border-d1line shadow-sm"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-d1muted block">
                {t.label}
              </span>
              <strong className="block text-2xl font-light text-d1fg my-1">
                {t.value}
              </strong>
              <span className="text-xs text-d1muted">{t.sub}</span>
            </div>
          ))}
        </div>

        <p className="note p-4 rounded-xl border-t-2 border-d1gold bg-d1surface border border-d1line text-xs text-d1muted leading-relaxed">
          The <b className="text-d1fg">first ten days</b> rebuy automatically: each day's result opens a tiny module with its own 2×. From <b className="text-d1fg">day 11</b> your switch decides: OFF sends results to your app wallet; ON keeps rebuying. The figures above are the module alone, switch OFF from day 11; the table below adds the rebuys.
        </p>

        {/* SVG Chart */}
        <div className="chart-wrap rounded-xl border border-d1line bg-d1surface p-4 shadow-sm overflow-hidden">
          <svg viewBox="0 0 900 290" className="w-full h-auto block bg-transparent">
            {/* Grid Lines */}
            {[0.5, 1, 1.5, 2].map((f) => {
              const y = chartData.sy(f * P);
              return (
                <g key={f}>
                  <line
                    x1={chartData.L}
                    y1={y}
                    x2={chartData.W - chartData.Rr}
                    y2={y}
                    stroke="#D8DDE1"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={chartData.L - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="#65717C"
                  >
                    {f === 1 ? money(P) : `${f}×`}
                  </text>
                </g>
              );
            })}

            {/* Threshold Line for Price Back */}
            <line
              x1={chartData.L}
              y1={chartData.sy(P)}
              x2={chartData.W - chartData.Rr}
              y2={chartData.sy(P)}
              stroke="#B8432F"
              strokeDasharray="6 4"
              strokeWidth="1.5"
            />

            {/* Believer Line */}
            <polyline
              points={chartData.pb}
              fill="none"
              stroke="#8A5E00"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Standard Line */}
            <polyline
              points={chartData.pts}
              fill="none"
              stroke="#FFC93C"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Milestone Markers */}
            {[
              [back, 'price back', 0],
              [end, 'ends (2×)', 0],
              [bEnd, 'Believer ends (2.2×)', 24],
            ].map(([dayVal, title, dy], i) => {
              const x = chartData.sx(dayVal);
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={chartData.H - chartData.B}
                    x2={x}
                    y2={chartData.H - chartData.B + 8 + dy}
                    stroke="#65717C"
                  />
                  <text
                    x={x}
                    y={chartData.H - chartData.B + 22 + dy}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#65717C"
                  >
                    day {dayVal}
                  </text>
                  <text
                    x={x}
                    y={chartData.H - chartData.B + 35 + dy}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#8A5E00"
                    fontWeight="bold"
                  >
                    {title}
                  </text>
                </g>
              );
            })}

            <text x={chartData.L} y="16" fontSize="11" fill="#65717C">
              results received by the module alone, at the average
            </text>
          </svg>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-d1line bg-d1surface shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#090A0C] text-[#F5F6F4] border-b-2 border-d1gold">
                <th className="p-3.5 font-semibold"></th>
                <th className="p-3.5 font-semibold">Standard (wallet from day 11)</th>
                <th className="p-3.5 font-semibold">Believer (rebuy for the whole life)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-d1line">
              {simData.map((row, idx) => (
                <tr key={idx} className="hover:bg-d1bg transition-colors">
                  <td className="p-3.5 font-bold text-d1fg">{row[0]}</td>
                  <td className="p-3.5 text-d1muted">{row[1]}</td>
                  <td className="p-3.5 text-d1muted">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <footer className="text-center text-xs text-d1muted pt-8 border-t border-d1line">
          Delta One · module calculator · Every figure is an illustration at the engine's average daily result. Not a guarantee.
        </footer>
      </main>
    </div>
  );
}

