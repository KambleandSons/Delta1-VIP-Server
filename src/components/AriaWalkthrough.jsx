import React, { useState, useEffect, useRef } from 'react';

const WALKTHROUGH_SEGMENTS = [
  {
    id: "v01",
    t: "Welcome to Delta One VIP",
    text: "Hello, and welcome to Delta One VIP. I am Aria, and I will be your teacher today. This page has two doors. The first is for customers: what you buy, what it pays, and what it never promises. The second is for distributors: the plan, the words, and your kit. Pick your door, and the page takes you straight there. Ready? Let's start with the customer's door.",
    act: { site: "#start" },
    src: "/walk/v01.mp3",
    dur: 20.784
  },
  {
    id: "v02",
    t: "For customers · Watch",
    text: "For customers, three short things, in this order: watch, read, try. First, watch. Start with The Seed Farm: the whole plan the way you would tell it to a child. Then the box films: what you actually buy, what it does every day, and how it ends. Each film opens on the journey page, in a new tab. When you have watched one, press the chip that says, I watched one.",
    act: { site: "#members" },
    src: "/walk/v02.mp3",
    dur: 20.568
  },
  {
    id: "v03",
    t: "For customers · Read",
    text: "Second, read. Five documents, in this order. The Key Facts: what a module is, and what can go wrong. The Plan in Simple Words: one idea on each page, with a picture. The Product Guide, the Member FAQ, and the Believer. On every row you have three choices. Open it and read. Press Explain it, and I explain it. Or press Aria reads it to me, and I read you what matters, page by page.",
    act: { site: "#read" },
    src: "/walk/v03.mp3",
    dur: 23.52
  },
  {
    id: "v04",
    t: "The plan on one page",
    text: "Let's look at the plan on one page together. Seven mountains, seven ranks. Fuji is the first, Everest is the last. Under each name you see a percentage. That is the rank's share: six percent at Fuji, forty-two percent at Everest. Below that, what the rank needs, and the daily cap. One mountain at a time. Every number here is an average, not a promise.",
    act: { site: "#start" },
    src: "/walk/v04.mp3",
    dur: 21.0
  },
  {
    id: "v05",
    t: "For customers · Try",
    text: "Third, try. The calculator shows any module, day by day, at the average: when the price comes back, when two times arrives, and the rebuy modules on the way. If you have a question, ask me; the answer comes from the published rules. And if you want a person, Zoom and live chat are further down the page. That is the whole customer path: watch, read, try. About twenty minutes.",
    act: { site: "#try" },
    src: "/walk/v05.mp3",
    dur: 21.672
  },
  {
    id: "v06",
    t: "Check yourself",
    text: "Now, check yourself. Six questions, like a small quiz in class. If you get one wrong, that is fine; the right answer lights up, with the reason. Then say the plan in your own words, in three sentences, and compare with mine. A little review will come back tomorrow, and again in a week, so the plan stays with you.",
    act: { site: "#check" },
    src: "/walk/v06.mp3",
    dur: 17.976
  },
  {
    id: "v07",
    t: "For distributors",
    text: "The second door is for distributors. First, the plan films: how helpers are rewarded, rule by rule, then your first day, your words, your first ninety days, and the people behind it. Then the library, shelf by shelf: the plan in full, what to say, your kit step by step, the founders, and the Skill Shop. Every document is there once, and every row tells you what it is, who it is for, and when to open it. Then the planner for your first ninety days. And then the checkpoint, which we just saw.",
    act: { site: "#distributors" },
    src: "/walk/v07.mp3",
    dur: 28.032
  },
  {
    id: "v08",
    t: "Before you go",
    text: "One last thing, and it is the most important. Every number on this site is an illustration at the engine's average daily result. Results and rewards are not guaranteed. Most members earn no commission at all. And every document is a draft until the lawyers approve it. If you get stuck, ask your sponsor. Well done. Welcome to Delta One VIP.",
    act: { site: "#help" },
    src: "/walk/v08.mp3",
    dur: 20.784
  }
];

export default function AriaWalkthrough({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');
  const audioRef = useRef(null);

  const currentSegment = WALKTHROUGH_SEGMENTS[currentIndex];
  const tourDict = (typeof window !== 'undefined' && window.D1LANG?.dict?.tour) || {};
  const segTitle = tourDict[currentSegment.id]?.t || currentSegment.t;
  const segText = tourDict[currentSegment.id]?.text || currentSegment.text;

  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    // Scroll to section
    if (currentSegment && currentSegment.act && currentSegment.act.site) {
      const el = document.querySelector(currentSegment.act.site);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-4', 'ring-[#FFB400]', 'transition-all');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-[#FFB400]');
        }, 3000);
      }
    }

    // Play current segment
    if (audioRef.current) {
      audioRef.current.src = currentSegment.src;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isOpen, currentIndex]);

  const fmtTime = (secs) => {
    const s = Math.floor(secs || 0);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || currentSegment.dur;
    setCurrentTime(fmtTime(cur));
    setTotalTime(fmtTime(dur));
    setProgress((cur / dur) * 100);
  };

  const handleEnded = () => {
    if (currentIndex < WALKTHROUGH_SEGMENTS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const val = parseFloat(e.target.value);
    const dur = audioRef.current.duration || currentSegment.dur;
    audioRef.current.currentTime = (val / 100) * dur;
    setProgress(val);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[480px] z-50 bg-[#0B1A33] text-white rounded-2xl shadow-2xl border border-[#2A3C5E] p-4 animate-fade-in">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      <div className="flex items-start gap-3">
        <img
          src="/img/host.svg"
          alt="Aria"
          className="w-12 h-12 rounded-full border-2 border-d1blue flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-d1gold">
              Step {currentIndex + 1} of {WALKTHROUGH_SEGMENTS.length} · Aria Walkthrough
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-[#B3C1D8] hover:text-white text-lg font-bold p-1 leading-none transition-colors"
              aria-label="Close walkthrough"
            >
              ✕
            </button>
          </div>
          <h4 className="font-bold text-sm text-white truncate mt-0.5">
            {segTitle}
          </h4>
          <p className="text-xs text-[#B3C1D8] line-clamp-2 mt-1 leading-relaxed">
            {segText}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleSeek}
          className="w-full h-1.5 bg-[#2A3C5E] rounded-lg appearance-none cursor-pointer accent-[#FFB400]"
        />
        <div className="flex items-center justify-between text-[11px] text-[#B3C1D8] mt-1">
          <span>{currentTime}</span>
          <span>{totalTime}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1F2F4D]">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          className="px-3 py-1 text-xs rounded-full bg-[#12254A] hover:bg-[#1A3466] disabled:opacity-40 text-white font-medium transition-colors"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="px-4 py-1.5 text-xs rounded-full bg-d1gold text-[#0B1A33] font-bold hover:brightness-105 flex items-center gap-1.5 transition-all"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          type="button"
          disabled={currentIndex === WALKTHROUGH_SEGMENTS.length - 1}
          onClick={() => setCurrentIndex(prev => Math.min(WALKTHROUGH_SEGMENTS.length - 1, prev + 1))}
          className="px-3 py-1 text-xs rounded-full bg-[#12254A] hover:bg-[#1A3466] disabled:opacity-40 text-white font-medium transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

