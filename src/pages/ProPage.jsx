import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import ClimbingQuiz from '../components/ClimbingQuiz';

const DEMO_MEMBERS = [
  { id: 1, name: "Lucas Chen", level: 1, rank: "Fuji", volume: 6000, style: "Summiteer", styleColor: "#E8463A", progress: "85%", quiz: "6/6", film: "Ep 12" },
  { id: 2, name: "Sarah Miller", level: 1, rank: "Member", volume: 2500, style: "Anchor", styleColor: "#0FB5A4", progress: "60%", quiz: "5/6", film: "Ep 6" },
  { id: 3, name: "Marcus Johnson", level: 2, rank: "Kilimanjaro", volume: 14000, style: "Storyteller", styleColor: "#FFB400", progress: "95%", quiz: "6/6", film: "Ep 19" },
  { id: 4, name: "Elena Rostova", level: 2, rank: "Member", volume: 1000, style: "Mapmaker", styleColor: "#1F6FEB", progress: "40%", quiz: "4/6", film: "Ep 4" },
  { id: 5, name: "David Kim", level: 3, rank: "Fuji", volume: 4500, style: "Summiteer", styleColor: "#E8463A", progress: "70%", quiz: "6/6", film: "Ep 9" },
];

const MESSAGE_TEMPLATES = [
  {
    title: "First Day Welcome",
    text: "Welcome to Delta One VIP! The first step is simple: watch Episode 1 (The Seed Farm) and read the Key Facts. Let me know when you're done and we'll check your calculator together."
  },
  {
    title: "Day 11 Switch Reminder",
    text: "Congratulations on day 11! Today your Auto-Rebuy switch unlocks. You can keep it ON to compound tiny modules, or switch it OFF to send USDT straight to your app wallet."
  },
  {
    title: "Checkpoint Follow-up",
    text: "Great job completing the 6-question checkpoint! How did your 3-sentence summary feel? Let's do a 10-minute Zoom this week to talk about qualifying for Fuji."
  }
];

export default function ProPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMember, setSelectedMember] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(null);

  const referralLink = "https://deltaonevip.com/?ref=nora-davis-vip";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyTemplate = (idx, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMsg(idx);
    setTimeout(() => setCopiedMsg(null), 2500);
  };

  return (
    <div className="min-h-screen bg-d1bg text-d1fg flex flex-col font-sans">
      {/* Top Navigation Banner */}
      <div className="sticky top-0 z-40 bg-[#0B1A33] text-white px-6 py-2.5 flex items-center justify-between shadow-md border-b border-[#2A3C5E]">
        <Link to="/" className="text-white hover:text-d1gold text-xs font-semibold flex items-center gap-2">
          ← Back to Delta One VIP
        </Link>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-[#A9BAD6] hidden sm:inline">
            Delta One VIP Pro · Demo data · No login needed
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Rail */}
        <aside className="w-full md:w-64 bg-d1surface border-r border-d1line p-4 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Brand */}
            <div className="flex items-center gap-2 px-2 pt-2">
              <svg className="w-8 h-8 flex-none" viewBox="0 0 40 40" aria-hidden="true">
                <path d="M20 5 34 33H6z" fill="none" stroke="#0B1A33" strokeWidth="3.2" strokeLinejoin="round" />
                <circle cx="20" cy="27" r="2.6" fill="#1F6FEB" />
              </svg>
              <div>
                <span className="font-display font-bold text-sm block">Delta One VIP</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-d1gold-ink bg-[#FFF6DC] dark:bg-[#3A2E0E] px-2 py-0.5 rounded-full">
                  PRO MEMBER
                </span>
              </div>
            </div>

            {/* Navigation Links with exact original SVGs */}
            <nav className="space-y-1">
              {[
                {
                  id: 'overview',
                  label: 'Home',
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 11.5 12 4l9 7.5" />
                      <path d="M5 10v10h14V10" />
                    </svg>
                  )
                },
                {
                  id: 'team',
                  label: 'Team',
                  badge: '5',
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="8" r="3.5" />
                      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
                      <circle cx="17" cy="9" r="2.5" />
                      <path d="M15.5 14.5a5 5 0 0 1 6 5" />
                    </svg>
                  )
                },
                {
                  id: 'messages',
                  label: 'Contacts',
                  badge: '3',
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="3" width="16" height="18" rx="2" />
                      <circle cx="12" cy="10" r="2.5" />
                      <path d="M8 17a4 4 0 0 1 8 0" />
                    </svg>
                  )
                },
                {
                  id: 'landing',
                  label: 'Share',
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
                      <path d="M12 15V3" />
                      <path d="m7 8 5-5 5 5" />
                    </svg>
                  )
                },
                {
                  id: 'profile',
                  label: 'My style',
                  svg: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 20 7-14 4 8 2-4 5 10z" />
                    </svg>
                  )
                },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === item.id
                      ? 'bg-d1blue text-white shadow-sm font-bold'
                      : 'text-d1muted hover:bg-d1soft hover:text-d1fg'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.svg}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === item.id ? 'bg-white text-d1blue' : 'bg-d1line text-d1muted'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* User profile card */}
          <div className="p-3 rounded-2xl bg-d1soft border border-d1line flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-d1blue text-white font-bold flex items-center justify-center font-display text-sm">
              ND
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-xs text-d1fg block truncate">Nora Davis</b>
              <span className="text-[11px] text-d1muted block">Rank: Fuji Qualified</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold font-display text-d1fg">
                    Dashboard Overview
                  </h1>
                  <p className="text-xs text-d1muted">
                    Welcome back, Nora. Your downline activity and progress today.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-full bg-d1blue text-white text-xs font-bold hover:bg-d1blue-ink shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <span>{copiedLink ? '✓ Copied Link' : 'Copy Referral Link'}</span>
                </button>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-d1line bg-d1surface shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-d1muted block">
                    Active Modules
                  </span>
                  <strong className="text-2xl font-bold text-d1fg block my-1">
                    18,500 USDT
                  </strong>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    Across 3 lines
                  </span>
                </div>

                <div className="p-5 rounded-2xl border border-d1line bg-d1surface shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-d1muted block">
                    24h Result (0.50% avg)
                  </span>
                  <strong className="text-2xl font-bold text-d1gold block my-1">
                    +92.50 USDT
                  </strong>
                  <span className="text-xs text-d1muted">
                    Next settlement: 12:00 UTC
                  </span>
                </div>

                <div className="p-5 rounded-2xl border border-d1line bg-d1surface shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-d1muted block">
                    Qualifying Volume (QV)
                  </span>
                  <strong className="text-2xl font-bold text-d1fg block my-1">
                    26,000 QV
                  </strong>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    Line balance healthy (50% max)
                  </span>
                </div>

                <div className="p-5 rounded-2xl border border-d1line bg-d1surface shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-d1muted block">
                    Current Rank
                  </span>
                  <strong className="text-2xl font-bold text-d1blue block my-1">
                    Fuji
                  </strong>
                  <span className="text-xs text-d1muted">
                    Daily Cap: 1,000 USDT/day
                  </span>
                </div>
              </div>

              {/* Quick Jump to Tools */}
              <div className="p-5 rounded-2xl border border-d1line bg-d1surface flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-sm font-bold font-display text-d1fg">
                    90-Day Momentum Planner & Fast Start
                  </h3>
                  <p className="text-xs text-d1muted">
                    Set your milestones and verify line balance rules.
                  </p>
                </div>
                <Link
                  to="/tools/faststart"
                  className="px-4 py-2 rounded-full border border-d1line hover:border-d1blue text-xs font-semibold text-d1fg transition-colors"
                >
                  Open Fast Start Planner →
                </Link>
              </div>

              {/* Recent Member Training Records */}
              <div className="space-y-3">
                <h3 className="text-base font-bold font-display text-d1fg">
                  Recent Team Activity
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-d1line bg-d1surface shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-d1bg border-b border-d1line text-d1muted">
                        <th className="p-3.5 font-semibold">Member</th>
                        <th className="p-3.5 font-semibold">Rank</th>
                        <th className="p-3.5 font-semibold">Volume</th>
                        <th className="p-3.5 font-semibold">Climbing Style</th>
                        <th className="p-3.5 font-semibold">Training Progress</th>
                        <th className="p-3.5 font-semibold">Quiz Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-d1line">
                      {DEMO_MEMBERS.map(m => (
                        <tr key={m.id} className="hover:bg-d1bg transition-colors">
                          <td className="p-3.5 font-bold text-d1fg">{m.name}</td>
                          <td className="p-3.5 text-d1muted">{m.rank}</td>
                          <td className="p-3.5 font-mono text-d1fg">{m.volume.toLocaleString()} USDT</td>
                          <td className="p-3.5">
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                              style={{ backgroundColor: m.styleColor }}
                            >
                              {m.style}
                            </span>
                          </td>
                          <td className="p-3.5 text-d1muted">{m.progress} ({m.film})</td>
                          <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">{m.quiz}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Team View */}
          {activeTab === 'team' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold font-display text-d1fg">
                    Team View & Training Records
                  </h1>
                  <p className="text-xs text-d1muted">
                    Click any member to inspect their training record, film progress, and coaching advice.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_MEMBERS.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMember(m)}
                    className="p-5 rounded-2xl border border-d1line bg-d1surface shadow-sm hover:border-d1blue transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-display text-d1fg">
                        {m.name}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: m.styleColor }}
                      >
                        {m.style}
                      </span>
                    </div>

                    <div className="text-xs text-d1muted space-y-1">
                      <div className="flex justify-between">
                        <span>Level / Rank:</span>
                        <span className="font-semibold text-d1fg">L{m.level} · {m.rank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volume:</span>
                        <span className="font-semibold text-d1fg">{m.volume.toLocaleString()} USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Training Progress:</span>
                        <span className="font-semibold text-emerald-600">{m.progress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quiz Result:</span>
                        <span className="font-semibold text-d1fg">{m.quiz}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full py-1.5 rounded-xl border border-d1line bg-d1bg text-xs font-semibold text-d1fg hover:bg-d1blue hover:text-white transition-colors"
                    >
                      View Member Record →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Quick Messages */}
          {activeTab === 'messages' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-display text-d1fg">
                  One-Tap Message Templates
                </h1>
                <p className="text-xs text-d1muted">
                  Compliant, calm messages to send to your team on WhatsApp, Telegram, or SMS.
                </p>
              </div>

              <div className="space-y-4">
                {MESSAGE_TEMPLATES.map((tpl, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-d1line bg-d1surface shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold font-display text-d1fg">
                        {tpl.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleCopyTemplate(idx, tpl.text)}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-d1blue text-white hover:bg-d1blue-ink transition-colors"
                      >
                        {copiedMsg === idx ? '✓ Copied' : 'Copy Message'}
                      </button>
                    </div>
                    <p className="p-3 rounded-xl bg-d1bg border border-d1line text-xs text-d1muted leading-relaxed italic">
                      "{tpl.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Climbing Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-display text-d1fg">
                  The Full Climbing Profile
                </h1>
                <p className="text-xs text-d1muted">
                  20 questions to uncover your decision habits, pressure points, and coaching style.
                </p>
              </div>

              <ClimbingQuiz isFull={true} />
            </div>
          )}

          {/* Tab 5: Landing & QR */}
          {activeTab === 'landing' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-display text-d1fg">
                  Personal Referral Link & QR
                </h1>
                <p className="text-xs text-d1muted">
                  Share this page with prospects. When they open it, their progress reports directly to your dashboard.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-d1line bg-d1surface shadow-sm max-w-xl space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-d1muted mb-1">
                    Your Personal URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referralLink}
                      className="flex-1 p-2.5 rounded-xl border border-d1line bg-d1bg text-xs font-mono text-d1fg"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-4 py-2 rounded-xl bg-d1blue text-white text-xs font-bold hover:bg-d1blue-ink transition-colors"
                    >
                      {copiedLink ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-d1line flex flex-col items-center text-center">
                  <div className="w-40 h-40 bg-white p-3 rounded-2xl border border-d1line shadow-sm flex items-center justify-center">
                    {/* SVG QR Code Mockup */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#0B1A33]">
                      <rect x="10" y="10" width="24" height="24" fill="currentColor" />
                      <rect x="14" y="14" width="16" height="16" fill="white" />
                      <rect x="18" y="18" width="8" height="8" fill="currentColor" />

                      <rect x="66" y="10" width="24" height="24" fill="currentColor" />
                      <rect x="70" y="14" width="16" height="16" fill="white" />
                      <rect x="74" y="18" width="8" height="8" fill="currentColor" />

                      <rect x="10" y="66" width="24" height="24" fill="currentColor" />
                      <rect x="14" y="70" width="16" height="16" fill="white" />
                      <rect x="18" y="74" width="8" height="8" fill="currentColor" />

                      <rect x="42" y="12" width="6" height="6" fill="currentColor" />
                      <rect x="52" y="18" width="6" height="6" fill="currentColor" />
                      <rect x="42" y="42" width="16" height="16" fill="currentColor" />
                      <rect x="64" y="48" width="8" height="8" fill="currentColor" />
                      <rect x="78" y="66" width="12" height="12" fill="currentColor" />
                      <rect x="48" y="78" width="8" height="8" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-xs text-d1muted mt-2">
                    Scan with phone camera to open Delta One VIP with your referral code attached.
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Member Drilldown Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-d1surface border border-d1line rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-d1line pb-3">
              <div>
                <h3 className="text-lg font-bold font-display text-d1fg">
                  {selectedMember.name}
                </h3>
                <span className="text-xs text-d1muted">
                  Level {selectedMember.level} · Rank: {selectedMember.rank}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="text-xl font-bold text-d1muted hover:text-d1fg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-d1bg border border-d1line flex justify-between">
                <span>Total Volume:</span>
                <span className="font-bold text-d1fg">{selectedMember.volume.toLocaleString()} USDT</span>
              </div>
              <div className="p-3 rounded-xl bg-d1bg border border-d1line flex justify-between">
                <span>Climbing Personality:</span>
                <span className="font-bold" style={{ color: selectedMember.styleColor }}>
                  {selectedMember.style}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-d1bg border border-d1line flex justify-between">
                <span>Classroom Progress:</span>
                <span className="font-bold text-emerald-600">{selectedMember.progress} ({selectedMember.film})</span>
              </div>
              <div className="p-3 rounded-xl bg-d1bg border border-d1line flex justify-between">
                <span>Quiz Score:</span>
                <span className="font-bold text-emerald-600">{selectedMember.quiz}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="w-full py-2.5 rounded-full bg-d1blue text-white font-bold text-xs hover:bg-d1blue-ink transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

