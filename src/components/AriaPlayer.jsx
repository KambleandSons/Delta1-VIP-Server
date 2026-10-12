import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

const WALK_STEPS = [
  { id: "v01", title: "Welcome to Delta One VIP", cap: "Welcome to Delta One. I am Aria, your teacher, and I will walk you through this classroom in three minutes.", site: "#start", src: "/walk/v01.mp3" },
  { id: "v02", title: "Step 1: Watch", cap: "Step 1 is the films. Watch Maya and Sam, or the cartoon at farm level, or the full presentation.", site: "#step1", src: "/walk/v02.mp3" },
  { id: "v03", title: "Step 2: Read", cap: "Step 2 is three documents in order: 7 Summits to Success, The Plan in Simple Words, and the Key Facts.", site: "#step2", src: "/walk/v03.mp3" },
  { id: "v04", title: "Step 3: Do", cap: "Step 3 is action: get set up with your sponsor, check the language card, and try the live calculator.", site: "#step3", src: "/walk/v04.mp3" },
  { id: "v05", title: "The Checkpoint", cap: "Six quick questions to make sure the key ideas stuck. When you can answer them, you know the plan.", site: "#check", src: "/walk/v05.mp3" },
  { id: "v06", title: "Say it in your own words", cap: "If you can teach it, you know it. Write your explanation in three sentences, then compare with the model answer.", site: "#teach", src: "/walk/v06.mp3" },
  { id: "v07", title: "The Library", cap: "The library goes as deep as you like: every rule, every guide, and the Skill Shop.", site: "#library", src: "/walk/v07.mp3" },
  { id: "v08", title: "We are with you", cap: "An agent is live on Zoom around the clock, and I am here in the bottom corner whenever you have a question.", site: "#support", src: "/walk/v08.mp3" },
];

export default function AriaPlayer() {
  const { player, closePlayer } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const audioRef = useRef(null);

  // When player opens, reset to step 0 and play
  useEffect(() => {
    if (player.open) {
      document.body.classList.add('wt-on');
      setCurrentStep(0);
      setIsPlaying(true);
      scrollToStep(0);
    } else {
      document.body.classList.remove('wt-on');
      setIsPlaying(false);
    }
  }, [player.open]);

  function scrollToStep(idx) {
    const s = WALK_STEPS[idx];
    if (s && s.site) {
      document.querySelector(s.site)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handlePlayPause() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  function handleNext() {
    if (currentStep + 1 < WALK_STEPS.length) {
      const next = currentStep + 1;
      setCurrentStep(next);
      scrollToStep(next);
      setIsPlaying(true);
    } else {
      handleClose();
    }
  }

  function handlePrev() {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      scrollToStep(prev);
      setIsPlaying(true);
    }
  }

  function handleClose() {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    closePlayer();
  }

  if (!player.open) return null;

  const cur = WALK_STEPS[currentStep] || WALK_STEPS[0];
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="wt" id="wt">
      <div className="wt-in">
        <img className="wt-av" src="/img/host.svg" alt="" />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="wt-top">
            <span className="wt-step" id="wt-step">{currentStep + 1} / {WALK_STEPS.length}</span>
            <span className="wt-title" id="wt-title">{cur.title}</span>
            <span className="wt-time" id="wt-time">0:0{Math.floor(currentTime)} / 0:15</span>
          </div>
          <p className="wt-cap" id="wt-cap">{cur.cap}</p>
          <div className="wt-bar">
            <div id="wt-fill" style={{ width: `${progressPct}%` }}></div>
          </div>
        </div>
        <div className="wt-ctl">
          <button type="button" id="wt-prev" aria-label="Previous step" onClick={handlePrev}>
            <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
          </button>
          <button type="button" id="wt-play" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={handlePlayPause}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button type="button" id="wt-next" aria-label="Next step" onClick={handleNext}>
            <svg viewBox="0 0 24 24"><path d="m6 18 8.5-6L6 6zm9-12v12h2V6z" /></svg>
          </button>
          <button type="button" id="wt-x" aria-label="Close walkthrough" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={cur.src}
        autoPlay={isPlaying}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 15)}
        onEnded={handleNext}
      />
    </div>
  );
}

