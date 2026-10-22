import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { order, DUBS, LANGS, NAMES } from '../data/journeyData';

const EPISODES = [
  // Chapter 1
  {
    chapter: 1,
    chapterTitle: "Chapter 1 · The farm",
    chapterLede: "The whole plan the way you would tell it to a child: a farm, a tractor, seed boxes and apples.",
    id: "seed_studio",
    epNum: "Episode 1 · 4:09",
    title: "The Seed Farm",
    desc: "Tracto plants only the good seeds. Maya's seed box, 100 apples shared, rain days, the switch, seven hills.",
    poster: "/journey/img/poster_seed_studio.jpg",
    src: "/journey/media/seed_farm_toonbee.mp4",
    vtt: "/journey/vtt/seed_farm_toonbee.vtt",
    dur: "4:09"
  },
  // Chapter 2
  {
    chapter: 2,
    chapterTitle: "Chapter 2 · The box",
    chapterLede: "What you actually buy, what it does every day, and how it ends.",
    id: "box_studio",
    epNum: "Episode 2 · 3:56",
    title: "Maya Buys a Box",
    desc: "A module: 1,000 USDT or more, not refundable, Bolt trades inside it, coins come from trades. Some days are rain days. The box gives at most two boxes' worth, then it ends.",
    poster: "/journey/img/poster_box_studio.jpg",
    src: "/journey/media/box_studio.mp4",
    vtt: "/journey/vtt/box_studio.vtt",
    dur: "3:56"
  },
  {
    chapter: 2,
    id: "tenboxes_studio",
    epNum: "Episode 3 · 3:31",
    title: "Ten Little Boxes and a Switch",
    desc: "Days 1 to 10 every result buys a tiny box. Day 11 the switch: ON rebuys, OFF goes to the wallet. Price back around day 200, two boxes' worth around day 400.",
    poster: "/journey/img/poster_tenboxes_studio.jpg",
    src: "/journey/media/tenboxes_studio.mp4",
    vtt: "/journey/vtt/tenboxes_studio.vtt",
    dur: "3:31"
  },
  {
    chapter: 2,
    id: "believer_studio",
    epNum: "Episode 4 · 5:56",
    title: "I'm a Believer",
    desc: "The switch left ON for the whole life of the box: 220 instead of 200, the snowball, and waiting 440 days.",
    poster: "/journey/img/poster_believer_studio.jpg",
    src: "/journey/media/believer_toonbee.mp4",
    vtt: "/journey/vtt/believer_toonbee.vtt",
    dur: "5:56"
  },
  {
    chapter: 2,
    id: "apples_studio",
    epNum: "Episode 5 · 2:45",
    title: "One Hundred Apples",
    desc: "Every 100 coins Bolt makes: 50 to the members, 25 to the helpers' plan, 25 to the barn. No apples, nobody eats. A helper's coins never come from a purchase.",
    poster: "/journey/img/poster_apples_studio.jpg",
    src: "/journey/media/apples_studio.mp4",
    vtt: "/journey/vtt/apples_studio.vtt",
    dur: "2:45"
  },
  {
    chapter: 2,
    id: "wallet_studio",
    epNum: "Episode 6 · 3:44",
    title: "Coins In, Coins Out",
    desc: "USDT on BNB Smart Chain, sending coins to the app, the daily statement line by line, taking coins out: any time, 5 USDT minimum, gas fee only, and the mistakes that lose money.",
    poster: "/journey/img/poster_wallet_studio.jpg",
    src: "/journey/media/wallet_studio.mp4",
    vtt: "/journey/vtt/wallet_studio.vtt",
    dur: "3:44"
  },
  // Chapter 3
  {
    chapter: 3,
    chapterTitle: "Chapter 3 · The plan for helpers",
    chapterLede: "How helpers are rewarded, rule by rule.",
    id: "momentum_studio",
    epNum: "Episode 7 · 3:55",
    title: "The Seven Summits",
    desc: "The seven ranks: Fuji to Everest. Your line, your depth (3 to 21 levels), and the daily caps (1,000 to 7,000 USDT).",
    poster: "/journey/img/poster_momentum_studio.jpg",
    src: "/journey/media/momentum_studio.mp4",
    vtt: "/journey/vtt/momentum_studio.vtt",
    dur: "3:55"
  },
  {
    chapter: 3,
    id: "matrix_studio",
    epNum: "Episode 8 · 3:28",
    title: "Two Coins in a Hundred",
    desc: "The base matrix: 2% of what your friends' contracts earn each day. Not from their deposit; from the daily trading fruit.",
    poster: "/journey/img/poster_matrix_studio.jpg",
    src: "/journey/media/matrix_studio.mp4",
    vtt: "/journey/vtt/matrix_studio.vtt",
    dur: "3:28"
  },
  {
    chapter: 3,
    id: "hills_studio",
    epNum: "Episode 9 · 4:12",
    title: "Line Balance Rule",
    desc: "Why one tall tower cannot carry your rank. Half at Fuji and Kilimanjaro, a third at Matterhorn and Denali, a fifth at Everest.",
    poster: "/journey/img/poster_hills_studio.jpg",
    src: "/journey/media/hills_studio.mp4",
    vtt: "/journey/vtt/hills_studio.vtt",
    dur: "4:12"
  },
  {
    chapter: 3,
    id: "wide_studio",
    epNum: "Episode 10 · 3:40",
    title: "Breakage and Differential",
    desc: "The second reward stream for leaders: picking up unclaimed percentage differences down your lines.",
    poster: "/journey/img/poster_wide_studio.jpg",
    src: "/journey/media/wide_studio.mp4",
    vtt: "/journey/vtt/wide_studio.vtt",
    dur: "3:40"
  },
  {
    chapter: 3,
    id: "gap_studio",
    epNum: "Episode 11 · 3:15",
    title: "The Cap and the Reset",
    desc: "Daily caps protect the DAO treasury so the plan can never overpay.",
    poster: "/journey/img/poster_gap_studio.jpg",
    src: "/journey/media/gap_studio.mp4",
    vtt: "/journey/vtt/gap_studio.vtt",
    dur: "3:15"
  },
  {
    chapter: 3,
    id: "honest_studio",
    epNum: "Episode 12 · 3:50",
    title: "Why the Barn Doesn't Empty",
    desc: "Mathematical sustainability of the 50/25/25 split and the 2x product cap.",
    poster: "/journey/img/poster_honest_studio.jpg",
    src: "/journey/media/honest_studio.mp4",
    vtt: "/journey/vtt/honest_studio.vtt",
    dur: "3:50"
  },
  // Chapter 4
  {
    chapter: 4,
    chapterTitle: "Chapter 4 · Being a helper",
    chapterLede: "What to do, what to say, and how to start.",
    id: "firstday_studio",
    epNum: "Episode 13 · 3:20",
    title: "Your First Day",
    desc: "Setting up your wallet, funding USDT on BSC, and getting your module running.",
    poster: "/journey/img/poster_firstday_studio.jpg",
    src: "/journey/media/firstday_studio.mp4",
    vtt: "/journey/vtt/firstday_studio.vtt",
    dur: "3:20"
  },
  {
    chapter: 4,
    id: "words_studio",
    epNum: "Episode 14 · 3:10",
    title: "What to Say",
    desc: "The Language Card: purchase not investment, result not return, rebuy not reinvest.",
    poster: "/journey/img/poster_words_studio.jpg",
    src: "/journey/media/words_studio.mp4",
    vtt: "/journey/vtt/words_studio.vtt",
    dur: "3:10"
  },
  {
    chapter: 4,
    id: "friend_studio",
    epNum: "Episode 15 · 3:30",
    title: "Telling a Friend",
    desc: "A calm 5-minute walk through the 4-minute cartoon with zero hype.",
    poster: "/journey/img/poster_friend_studio.jpg",
    src: "/journey/media/friend_studio.mp4",
    vtt: "/journey/vtt/friend_studio.vtt",
    dur: "3:30"
  },
  {
    chapter: 4,
    id: "ninety_studio",
    epNum: "Episode 16 · 4:05",
    title: "The First 90 Days",
    desc: "Building two solid lines, checking line balance, and qualifying for Fuji.",
    poster: "/journey/img/poster_ninety_studio.jpg",
    src: "/journey/media/ninety_studio.mp4",
    vtt: "/journey/vtt/ninety_studio.vtt",
    dur: "4:05"
  },
  {
    chapter: 4,
    id: "rules_studio",
    epNum: "Episode 17 · 3:45",
    title: "The Five Objections",
    desc: "Honest, calm answers to common questions with facts from the rules.",
    poster: "/journey/img/poster_rules_studio.jpg",
    src: "/journey/media/rules_studio.mp4",
    vtt: "/journey/vtt/rules_studio.vtt",
    dur: "3:45"
  },
  // Chapter 5
  {
    chapter: 5,
    chapterTitle: "Chapter 5 · Who is behind it",
    chapterLede: "The founders, the seats and the company.",
    id: "founder_studio",
    epNum: "Episode 18 · 4:02",
    title: "Founder Seats",
    desc: "Nora and Bolt: 260 seats, the share, the seat box, the 30-day rule, the permanent NFT.",
    poster: "/journey/img/poster_founder_studio.jpg",
    src: "/journey/media/founder_toonbee.mp4",
    vtt: "/journey/vtt/founder_toonbee.vtt",
    dur: "4:02"
  },
  {
    chapter: 5,
    id: "who_studio",
    epNum: "Episode 19 · 3:18",
    title: "Who Is Delta One",
    desc: "The engine, James and Ricky, custody with more than one key, settlement at 12:00 UTC every day, and the DAO.",
    poster: "/journey/img/poster_who_studio.jpg",
    src: "/journey/media/who_studio.mp4",
    vtt: "/journey/vtt/who_studio.vtt",
    dur: "3:18"
  },
  // Chapter 6
  {
    chapter: 6,
    chapterTitle: "Chapter 6 · The whole presentation",
    chapterLede: "Every rule and every number, once more, in order.",
    id: "pres",
    epNum: "Episode 22 · 10:17",
    title: "The presentation, narrated by Aria",
    desc: "Seventeen slides, every rule and every number.",
    poster: "/journey/img/poster_pres.jpg",
    src: "/journey/media/presentation_narrated.mp4",
    vtt: "/journey/vtt/presentation_narrated.vtt",
    dur: "10:17"
  }
];

export default function JourneyPage() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('d1_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  });
  const [activeEp, setActiveEp] = useState(null);
  const [isPlaying, setIsPlaying] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ccOn, setCcOn] = useState(true);
  const [isChaining, setIsChaining] = useState(false);

  const videoRefs = useRef({});
  const audioRefs = useRef({});
  const location = useLocation();

  useEffect(() => {
    // Check hash anchor e.g. #box_studio
    const hash = (location.hash || '').replace(/^#/, '').split('.')[0];
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [location.hash]);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('d1_lang', newLang);
    } catch (e) {}
  };

  const getDubInfo = (epId) => {
    if (lang === 'en') return null;
    const epDubs = DUBS[epId];
    if (epDubs && epDubs[lang]) {
      return epDubs[lang];
    }
    return null;
  };

  const togglePlay = (epId) => {
    const v = videoRefs.current[epId];
    if (!v) return;

    if (v.paused) {
      // Pause all others
      Object.keys(videoRefs.current).forEach(k => {
        if (k !== epId && videoRefs.current[k]) {
          videoRefs.current[k].pause();
          if (audioRefs.current[k]) audioRefs.current[k].pause();
        }
      });

      setActiveEp(epId);
      const pr = v.play();
      if (pr && pr.catch) pr.catch(() => {});

      const dub = getDubInfo(epId);
      if (dub && dub.a && audioRefs.current[epId]) {
        audioRefs.current[epId].currentTime = v.currentTime;
        audioRefs.current[epId].play().catch(() => {});
      }
      setIsPlaying(prev => ({ ...prev, [epId]: true }));
    } else {
      v.pause();
      if (audioRefs.current[epId]) audioRefs.current[epId].pause();
      setIsPlaying(prev => ({ ...prev, [epId]: false }));
    }
  };

  const handleFullScreen = (epId) => {
    const v = videoRefs.current[epId];
    if (!v) return;

    if (v.requestFullscreen) {
      v.requestFullscreen();
    } else if (v.webkitRequestFullscreen) {
      v.webkitRequestFullscreen(); // Safari
    }
  }

  const handleVideoEnded = (epId) => {
    setIsPlaying(prev => ({ ...prev, [epId]: false }));
    if (!isChaining) return;

    const idx = EPISODES.findIndex(e => e.id === epId);
    if (idx >= 0 && idx < EPISODES.length - 1) {
      const nextEp = EPISODES[idx + 1];
      const nextEl = document.getElementById(nextEp.id);
      if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      togglePlay(nextEp.id);
    } else {
      setIsChaining(false);
    }
  };

  const startJourney = () => {
    setIsChaining(true);
    const first = EPISODES[0];
    const el = document.getElementById(first.id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    togglePlay(first.id);
  };

  // Group episodes by chapter
  const chapters = [
    { num: 1, title: "Chapter 1 · The farm", lede: "The whole plan the way you would tell it to a child: a farm, a tractor, seed boxes and apples." },
    { num: 2, title: "Chapter 2 · The box", lede: "What you actually buy, what it does every day, and how it ends." },
    { num: 3, title: "Chapter 3 · The plan for helpers", lede: "How helpers are rewarded, rule by rule." },
    { num: 4, title: "Chapter 4 · Being a helper", lede: "What to do, what to say, and how to start." },
    { num: 5, title: "Chapter 5 · Who is behind it", lede: "The founders, the seats and the company." },
    { num: 6, title: "Chapter 6 · The whole presentation", lede: "Every rule and every number, once more, in order." },
  ];

  return (
    <div className="min-h-screen bg-d1bg text-d1fg pb-16 font-sans">
      {/* Top Bar */}
      <div className="top sticky top-0 z-40 bg-d1topbar backdrop-blur-md border-b border-d1line">
        <div className="wrap max-w-[1180px] mx-auto px-4 flex items-center justify-between min-h-[64px] gap-3">
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="" className="w-9 h-9 rounded-full" />
            <b className="font-display text-base font-bold text-d1fg">
              Delta One VIP · The Journey
            </b>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs font-semibold text-d1blue-ink hover:underline whitespace-nowrap">
              ← Delta One VIP
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <main className="wrap max-w-[1180px] mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="hero space-y-2 !bg-none">
          <p className="k text-[11px] uppercase tracking-widest font-bold text-d1gold-ink">
            Teach me like I'm five · the journey
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight text-d1fg">
            One short film per idea, in the order you need them.
          </h1>
          <p className="text-sm text-d1muted max-w-3xl leading-relaxed">
            Start at Episode 1 and walk through: the farm, the box, the plan, being a helper, the people behind it, then the whole presentation. 20 of 22 films are ready. Every figure is an illustration at the engine's 0.50% average daily result; days vary from zero to several percent; nothing is guaranteed; most members earn no commission at all.
          </p>

          {/* Language Selector */}
          <div className="langbox flex items-center gap-3 p-3.5 rounded-2xl bg-d1surface border border-d1line shadow-sm flex-wrap max-w-xl">
            <label htmlFor="lang" className="text-xs font-bold font-display text-d1fg">
              Watch in your language
            </label>
            <select
              id="lang"
              value={lang}
              onChange={(e) => handleLangChange(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-d1line bg-d1bg text-d1fg"
            >
              {LANGS.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
            <span className="text-xs text-d1muted w-full">
              {lang === 'en'
                ? 'English audio & subtitles'
                : `${NAMES[lang] || lang} subtitles & dubbed audio where available`}
            </span>
          </div>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={startJourney}
              className="px-5 py-2.5 rounded-full bg-d1blue text-white font-bold text-xs hover:bg-d1blue-ink flex items-center gap-2 shadow-sm transition-colors"
            >
              <span>▶ Play the journey</span>
            </button>
            <span className="text-xs text-d1muted">
              The films on this page, back to back, in order.
            </span>
          </div>
        </div>

        {/* Chapters */}
        {chapters.map((ch) => {
          const chEpisodes = EPISODES.filter(e => e.chapter === ch.num);

          return (
            <section key={ch.num} className="chapter space-y-4 pt-6 border-t border-d1line">
              <div>
                <h2 className="text-xl font-bold font-display text-d1fg">
                  {ch.title}
                </h2>
                <p className="text-xs text-d1muted">{ch.lede}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {chEpisodes.map((ep) => {
                  const dub = getDubInfo(ep.id);
                  const playing = !!isPlaying[ep.id];

                  return (
                    <figure
                      key={ep.id}
                      id={ep.id}
                      className={`ep rounded-2xl border border-d1line bg-d1surface overflow-hidden shadow-card transition-all ${
                        activeEp === ep.id ? 'ring-2 ring-d1gold' : ''
                      }`}
                    >
                      <div className="frame relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                        <video
                          ref={el => videoRefs.current[ep.id] = el}
                          preload="none"
                          poster={ep.poster}
                          playsInline
                          src={ep.src}
                          muted={isMuted || (dub && dub.a)}
                          onEnded={() => handleVideoEnded(ep.id)}
                          className="w-full h-full object-cover"
                        >
                          {ccOn && ep.vtt && (
                            <track kind="subtitles" src={ep.vtt} default />
                          )}
                        </video>

                        {/* Dubbed voice audio sync */}
                        {dub && dub.a && (
                          <audio
                            ref={el => audioRefs.current[ep.id] = el}
                            src={`/journey/${dub.a}`}
                            preload="none"
                          />
                        )}

                        {/* Play button overlay */}
                        {!playing && (
                          <button
                            type="button"
                            onClick={() => togglePlay(ep.id)}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors cursor-pointer"
                            aria-label={`Play ${ep.title}`}
                          >
                            <span className="w-14 h-14 rounded-full bg-d1gold text-[#0B1A33] font-bold text-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform pl-1">
                              ▶
                            </span>
                          </button>
                        )}

                        {/* Video Controls Bar */}
                        <div className="bar !h-auto">
                          <button
                            type="button"
                            onClick={() => togglePlay(ep.id)}
                            className="p-1 hover:text-d1gold"
                          >
                            {playing ? '⏸' : '▶'}
                          </button>
                          <span className="text-[11px] font-mono">{ep.dur}</span>
                          <div className="flex-1" />
                          <button
                            type="button"
                            onClick={() => setCcOn(prev => !prev)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border border-white/40 ${
                              ccOn ? 'bg-d1gold text-black border-transparent' : ''
                            }`}
                          >
                            CC
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsMuted(prev => !prev)}
                            className="p-1 hover:text-d1gold"
                          >
                            {isMuted ? '🔇' : '🔊'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFullScreen(ep.id)}
                            className="p-1 hover:text-d1gold"
                          >
                            {'⛶'}
                          </button>
                        </div>
                      </div>

                      <figcaption className="p-4 space-y-1">
                        <span className="num !text-start">
                          {ep.epNum}
                        </span>
                        <b className="!m-0">
                          {ep.title}
                        </b>
                        <p className="text-xs text-d1muted line-clamp-2 leading-relaxed">
                          {ep.desc}
                        </p>
                        {lang !== 'en' && (
                          <span className="text-[11px] font-semibold text-d1blue-ink block pt-1 !m-0 !border-0 !p-0">
                            {dub && dub.a ? `${LANGS.find(l => l[0] === lang)?.[1]} · subtitles + your device’s voice` : 'Subtitles in your language'}
                          </span>
                        )}
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </section>
          );
        })}

        <footer className="text-center text-xs text-d1muted pt-8 border-t border-d1line">
          Delta One · Studio animation films · Dubbed voices and subtitles are drafts for native-speaker review.
        </footer>
      </main>
    </div>
  );
}

