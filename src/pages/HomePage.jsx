import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PdfViewerModal from "../components/PdfViewerModal";
import AriaWalkthrough from "../components/AriaWalkthrough";
import AskAriaDrawer from "../components/AskAriaDrawer";
import CheckpointSection from "../components/CheckpointSection";
import { useTheme } from "../context/ThemeContext";
import {
  setLanguage,
  getCurrentLanguage,
  startI18nObserver,
  stopI18nObserver,
} from "../utils/i18n";

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState(() => getCurrentLanguage());
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [isAriaChatOpen, setIsAriaChatOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [stepsDone, setStepsDone] = useState({ 1: false, 2: false, 3: false });
  const [plan, setPlan] = useState("free");

  const [pdfModal, setPdfModal] = useState({
    isOpen: false,
    file: "",
    name: "",
    title: "",
  });

  const { theme } = useTheme();

  useEffect(() => {
    // Initialize language from localStorage or default
    const lang = getCurrentLanguage();
    setLanguage(lang);
    startI18nObserver(document.body);

    return () => {
      stopI18nObserver();
    };
  }, []);

  const handleLangChange = (code) => {
    setCurrentLang(code);
    setLanguage(code);
  };

  // Handle click delegation on container to replicate exact native interactions
  const handleContainerClick = (e) => {
    // 1. Check if clicked Open PDF button
    const viewBtn = e.target.closest(".view, [data-file].view");
    if (viewBtn) {
      e.preventDefault();
      const file = viewBtn.getAttribute("data-file");
      const name =
        viewBtn.getAttribute("data-name") ||
        (file ? file.split("/").pop() : "document.pdf");
      const title = viewBtn.getAttribute("data-title") || name;
      if (file) {
        setPdfModal({
          isOpen: true,
          file,
          name,
          title,
        });
      }
      return;
    }

    // 2. Check if clicked Download button
    const dlBtn = e.target.closest(".dl, [data-file].dl");
    if (dlBtn) {
      e.preventDefault();
      const file = dlBtn.getAttribute("data-file");
      const name =
        dlBtn.getAttribute("data-name") ||
        (file ? file.split("/").pop() : "document.pdf");
      if (file) {
        const adjusted =
          theme === "light" && !file.startsWith("light/")
            ? "light/" + file
            : file;
        const a = document.createElement("a");
        a.href = "/" + adjusted.replace(/^\/+/, "");
        a.download = name;
        a.click();
      }
      return;
    }

    // 3. Check if clicked Explain it or Read it
    const exBtn = e.target.closest(".ex, .rd");
    if (exBtn) {
      e.preventDefault();
      const title = exBtn.getAttribute("data-title") || "Aria";
      const file = exBtn.getAttribute("data-file");
      if (file) {
        setPdfModal({
          isOpen: true,
          file,
          name: file.split("/").pop(),
          title,
        });
      }
      return;
    }

    // 4. Reel prev / next scroll buttons
    const reelPrev = e.target.closest(".reel-btn.prev");
    if (reelPrev) {
      e.preventDefault();
      const wrap = reelPrev.closest(".reel-wrap");
      const reel = wrap && wrap.querySelector(".reel");
      if (reel) reel.scrollBy({ left: -340, behavior: "smooth" });
      return;
    }
    const reelNext = e.target.closest(".reel-btn.next");
    if (reelNext) {
      e.preventDefault();
      const wrap = reelNext.closest(".reel-wrap");
      const reel = wrap && wrap.querySelector(".reel");
      if (reel) reel.scrollBy({ left: 340, behavior: "smooth" });
      return;
    }

    // 5. Done chips
    const chipDone = e.target.closest("[data-done]");
    if (chipDone) {
      const step = chipDone.getAttribute("data-done");
      if (step) {
        setStepsDone((prev) => ({ ...prev, [step]: true }));
        chipDone.classList.add("is-done");
      }
      const go = chipDone.getAttribute("data-go");
      if (go) {
        const target = document.querySelector(go);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // 6. Aria walkthrough trigger
    const wtStart = e.target.closest(".wt-start");
    if (wtStart) {
      e.preventDefault();
      setIsWalkthroughOpen(true);
      return;
    }

    // 7. Ask Aria trigger
    const askOpen = e.target.closest("#ask-open, .ask-fab, [data-ask]");
    if (askOpen) {
      e.preventDefault();
      setIsAriaChatOpen(true);
      return;
    }

    // 8. Upgrade triggers
    const upBtn = e.target.closest('[data-upgrade], [href="#upgrade"]');
    if (upBtn) {
      e.preventDefault();
      setIsUpsellOpen(true);
      return;
    }
  };

  return (
    <div className="home-page" onClick={handleContainerClick}>
      {/* Top Header */}
      <Header
        onStartWalkthrough={() => setIsWalkthroughOpen(true)}
        onOpenAriaChat={() => setIsAriaChatOpen(true)}
        currentLang={currentLang}
        onLangChange={handleLangChange}
        onUpgradeClick={() => setIsUpsellOpen(true)}
        plan={plan}
        stepsDone={stepsDone}
      />

      {/* Exact Body from delta_one_vip/index.html */}
      <header className="hero" id="start">
        <div className="wrap hero-top">
          <div>
            <p className="eyebrow">Delta One VIP · Your classroom</p>
            <h1 className="text-black">
              The Momentum Plan, <em>in the order you need it</em>.
            </h1>
            <p className="hero-lede">
              Customers first: what you buy, what it pays, what it never
              promises. Distributors next: the plan, the words, your kit. Pick
              your door.
            </p>
            <p id="lang-note"></p>
            <p className="ready-badge">
              ✓ You have done all three: watched, read, tried. The library below
              goes as deep as you like.
            </p>
          </div>
          <img
            className="hero-art"
            src="/img/hero_plan.jpg"
            alt="7 Summits to Success — the Momentum Plan on one page"
            width="1200"
            height="954"
          />
        </div>
        <div className="wrap hero-doors">
          <div className="who">
            <a className="who-card member" href="#members" data-go="#members">
              <span className="ic">🙋</span>
              <span>
                <b>I'm a customer, or thinking about it</b>
                <span className="tl">
                  6 short films · 5 documents · the calculator · about 35
                  minutes
                </span>
              </span>
              <span className="go">▸</span>
            </a>
            <a
              className="who-card dist"
              href="#distributors"
              data-go="#distributors"
            >
              <span className="ic">🧭</span>
              <span>
                <b>I'm a distributor</b>
                <span className="tl">
                  The plan films · the library shelf by shelf · the planner ·
                  the checkpoint
                </span>
              </span>
              <span className="go">▸</span>
            </a>
          </div>
          <div className="hero-acts">
            <button
              type="button"
              className="btn ghost wt-start !border-[var(--line)] !border-[2px] !rounded-[12px] !px-[22px] !py-0"
            >
              <span className="ic">▶</span>&nbsp; Aria, my teacher, walks me
              through · 3:00
            </button>
            <span className="hero-note">
              Every figure is an illustration at the engine's 0.50% average
              daily result. Nothing is guaranteed; most members earn no
              commission at all.
            </span>
          </div>
          <div className="review-due" id="review-due" hidden>
            <b>Your 2-minute review is ready.</b>{" "}
            <span>Three quick questions keep the plan fresh.</span>{" "}
            <a href="#review" className="btn primary" data-go="#review">
              Do the review
            </a>
          </div>
          <div className="plan-strip free-el" id="plan-strip-free">
            <span className="ps-tag">Delta One Training · free</span>
            <span className="ps-t">
              You have the whole classroom: the films, the checkpoint, the
              reviews and every document, for your customers and for you as a
              distributor, in 20 languages. <b>Delta One VIP</b> adds your
              personal assistant, a live agent on Zoom 24/7, a concierge, your
              own progress dashboard, your team's view, your contacts and
              messages, and the Skill Shop.
            </span>
            <a className="btn gold" href="#upgrade" data-upgrade="hero">
              Go VIP · 99 USDT/month
            </a>
          </div>
          {/* <div className="plan-strip vip-el" id="plan-strip-vip">
            <span className="ps-tag vip">Delta One VIP</span>
            <span className="ps-t">
              Your progress on this page is saved to your dashboard, so your
              sponsor can help you exactly where you are: which film, which
              page, which checkpoint.
            </span>
            <a className="btn primary" href="#" data-dashboard="hero">
              Open my dashboard ↗
            </a>
          </div> */}
        </div>
        <div className="mtn" aria-hidden="true"></div>
      </header>

      <section className="zone members step s1" id="members">
        <div className="wrap">
          <div className="zone-head">
            <span className="zone-ic">🙋</span>
            <div>
              <p className="kicker !max-w-auto">
                For customers · members, and anyone thinking about a module
              </p>
              <h2 className="section-title">
                What you buy, what it pays, what it never promises.
              </h2>
              <p className="section-lede">
                Three short things, in this order: watch, read, try. About
                twenty minutes. Every figure is an illustration at the engine's
                average daily result; nothing is guaranteed.
              </p>
            </div>
          </div>

          <div className="block" id="watch">
            <div className="block-head">
              <h3>
                <span className="bn n1">1</span>
                <span className="bt">Watch · the farm and the box</span>
              </h3>
              <p>
                Start with <b>The Seed Farm</b>, then the box films. Each one
                opens on the journey page, in a new tab, and the page remembers
                where you were.
              </p>
              <button
                type="button"
                className="chip"
                data-done="1"
                data-go="#read"
              >
                ✓ I watched one
              </button>
            </div>
            <div className="reel-wrap">
              <button
                type="button"
                className="reel-btn prev"
                aria-label="Scroll back"
              >
                ‹
              </button>
              <div className="reel">
                <div className="reel-ch">
                  <span className="ck">Chapter 1</span>
                  <b>The farm</b>
                  <span className="cl">
                    The whole plan the way you would tell it to a child: a farm,
                    a tractor, seed boxes and apples.
                  </span>
                </div>
                <a
                  className="tile5"
                  href="/journey#seed_studio"
                  rel="noopener"
                  aria-label="Play The Seed Farm"
                >
                  <img
                    src="/img/poster_seed_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 1 · 4:09</span>
                    <b>The Seed Farm</b>
                    <span className="ln">
                      Tracto plants only the good seeds. Maya&#x27;s seed box,
                      100 apples shared, rain days, the switch, seven hills.
                    </span>
                  </span>
                </a>
                <div className="reel-ch">
                  <span className="ck">Chapter 2</span>
                  <b>The box</b>
                  <span className="cl">
                    What you actually buy, what it does every day, and how it
                    ends.
                  </span>
                </div>
                <a
                  className="tile5"
                  href="/journey#box_studio"
                  rel="noopener"
                  aria-label="Play Maya Buys a Box"
                >
                  <img
                    src="/img/poster_box_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 2 · 3:56</span>
                    <b>Maya Buys a Box</b>
                    <span className="ln">
                      A module: 1,000 USDT or more, not refundable, Bolt trades
                      inside it, coins come from trades. Some days are rain
                      days. The box gives at most two boxes&#x27; worth, then it
                      ends.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#tenboxes_studio"
                  rel="noopener"
                  aria-label="Play Ten Little Boxes and a Switch"
                >
                  <img
                    src="/img/poster_tenboxes_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 3 · 3:31</span>
                    <b>Ten Little Boxes and a Switch</b>
                    <span className="ln">
                      Days 1 to 10 every result buys a tiny box. Day 11 the
                      switch: ON rebuys, OFF goes to the wallet. Price back
                      around day 200, two boxes&#x27; worth around day 400.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#believer_studio"
                  rel="noopener"
                  aria-label="Play I&#x27;m a Believer"
                >
                  <img
                    src="/img/poster_believer_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 4 · 5:56</span>
                    <b>I&#x27;m a Believer</b>
                    <span className="ln">
                      The switch left ON for the whole life of the box: 220
                      instead of 200, the snowball, and waiting 440 days.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#apples_studio"
                  rel="noopener"
                  aria-label="Play One Hundred Apples"
                >
                  <img
                    src="/img/poster_apples_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 5 · 2:45</span>
                    <b>One Hundred Apples</b>
                    <span className="ln">
                      Every 100 coins Bolt makes: 50 to the members, 25 to the
                      helpers&#x27; plan, 25 to the barn. No apples, nobody
                      eats. A helper&#x27;s coins never come from a purchase.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#wallet_studio"
                  rel="noopener"
                  aria-label="Play Coins In, Coins Out"
                >
                  <img
                    src="/img/poster_wallet_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 6 · 3:44</span>
                    <b>Coins In, Coins Out</b>
                    <span className="ln">
                      USDT on BNB Smart Chain, sending coins to the app, the
                      daily statement line by line, taking coins out: any time,
                      5 USDT minimum, gas fee only, and the mistakes that lose
                      money.
                    </span>
                  </span>
                </a>
              </div>
              <button
                type="button"
                className="reel-btn next"
                aria-label="Scroll forward"
              >
                ›
              </button>
            </div>
          </div>

          <div className="block" id="read">
            <div className="block-head">
              <h3>
                <span className="bn n2">2</span>
                <span className="bt">Read · five documents, in this order</span>
              </h3>
              <p>
                Every row gives you three choices: <b>Open</b> it and read;{" "}
                <b>Explain it</b>, and Aria explains it like a teacher; or{" "}
                <b>Aria reads it to me</b>, page by page, while the page follows
                along.
              </p>
              <button
                type="button"
                className="chip"
                data-done="2"
                data-go="#try"
              >
                ✓ I read them
              </button>
            </div>
            <div className="rows">
              <article className="doc row" id="doc-Delta_One_Module_Key_Facts">
                <img
                  className="row-cover"
                  src="/img/cover_Delta_One_Module_Key_Facts.jpg"
                  alt="Cover of Key Facts &amp; Risks"
                  loading="lazy"
                  width="510"
                  height="660"
                />
                <div className="row-body">
                  <div className="row-title">
                    <h3>Key Facts & Risks</h3>
                    <p className="doc-tag">
                      Read 1 of 5 · One page · read before you buy
                    </p>
                  </div>
                  <p className="plain">
                    One page: what a module is, what it delivers, what can go
                    wrong.
                  </p>
                  <p className="plain-who">
                    <b>For:</b> Every prospect &nbsp;·&nbsp; <b>When:</b> Before
                    anyone buys. Always.
                  </p>
                  <details className="more">
                    <summary>More detail · PDF, 1 page, 0.1 MB</summary>
                    <p className="doc-desc">
                      Everything a customer must know before buying a module, on
                      one page, with the main risks.
                    </p>
                  </details>
                </div>
                <div className="row-act actions">
                  <button
                    type="button"
                    className="btn primary sm view"
                    data-file="docs/Delta_One_Module_Key_Facts.pdf"
                    data-name="Delta_One_Module_Key_Facts.pdf"
                    data-title="Key Facts &amp; Risks"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm dl"
                    id="dl-32"
                    data-file="docs/Delta_One_Module_Key_Facts.pdf"
                    data-name="Delta_One_Module_Key_Facts.pdf"
                    aria-label="Download Key Facts &amp; Risks"
                    title="Download"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn listen sm ex"
                    data-id="Delta_One_Module_Key_Facts"
                    data-title="Key Facts &amp; Risks"
                  >
                    <span className="ic">▶</span> Explain it{" "}
                    <span className="tm">0:23</span>
                  </button>
                  <button
                    type="button"
                    className="btn listen sm rd"
                    data-file="docs/Delta_One_Module_Key_Facts.pdf"
                    data-name="Delta_One_Module_Key_Facts.pdf"
                    data-title="Key Facts &amp; Risks"
                    data-lang="en"
                    data-aria="1"
                  >
                    <span className="ic">▶</span>{" "}
                    <span className="l-aria">Aria reads it to me</span>
                    <span className="l-plain">Read it to me</span>
                  </button>
                </div>
                <p
                  className="status"
                  id="st-32"
                  role="status"
                  aria-live="polite"
                ></p>
              </article>
              <article
                className="doc row"
                id="doc-Delta_One_Momentum_Plan_Simple_Words"
              >
                <img
                  className="row-cover"
                  src="/img/cover_Delta_One_Momentum_Plan_Simple_Words.jpg"
                  alt="Cover of The Plan in Simple Words"
                  loading="lazy"
                  width="510"
                  height="660"
                />
                <div className="row-body">
                  <div className="row-title">
                    <h3>The Plan in Simple Words</h3>
                    <p className="doc-tag">
                      Read 2 of 5 · Pictures and short sentences
                    </p>
                  </div>
                  <p className="plain">
                    The plan in pictures and very short sentences. Anyone can
                    read it.
                  </p>
                  <p className="plain-who">
                    <b>For:</b> Prospects and members &nbsp;·&nbsp; <b>When:</b>{" "}
                    Give it to anyone who finds the other documents hard.
                  </p>
                  <details className="more">
                    <summary>More detail · PDF, 16 pages, 0.4 MB</summary>
                    <p className="doc-desc">
                      The whole plan for anyone, in any language level: one idea
                      per page, a picture and three or four very short
                      sentences. What you buy, the daily share, 2× and the end,
                      the switch, the Believer, the 100 USDT, friends and
                      levels, the 7 Summits to Success, build wide, stay ahead,
                      payday, six rules, and the warning page.
                    </p>
                  </details>
                </div>
                <div className="row-act actions">
                  <button
                    type="button"
                    className="btn primary sm view"
                    data-file="docs/Delta_One_Momentum_Plan_Simple_Words.pdf"
                    data-name="Delta_One_Momentum_Plan_Simple_Words.pdf"
                    data-title="The Plan in Simple Words"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm dl"
                    id="dl-33"
                    data-file="docs/Delta_One_Momentum_Plan_Simple_Words.pdf"
                    data-name="Delta_One_Momentum_Plan_Simple_Words.pdf"
                    aria-label="Download The Plan in Simple Words"
                    title="Download"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn listen sm ex"
                    data-id="Delta_One_Momentum_Plan_Simple_Words"
                    data-title="The Plan in Simple Words"
                  >
                    <span className="ic">▶</span> Explain it{" "}
                    <span className="tm">0:24</span>
                  </button>
                  <button
                    type="button"
                    className="btn listen sm rd"
                    data-file="docs/Delta_One_Momentum_Plan_Simple_Words.pdf"
                    data-name="Delta_One_Momentum_Plan_Simple_Words.pdf"
                    data-title="The Plan in Simple Words"
                    data-lang="en"
                    data-aria="1"
                  >
                    <span className="ic">▶</span>{" "}
                    <span className="l-aria">Aria reads it to me</span>
                    <span className="l-plain">Read it to me</span>
                  </button>
                </div>
                <p
                  className="status"
                  id="st-33"
                  role="status"
                  aria-live="polite"
                ></p>
              </article>
              <article
                className="doc row"
                id="doc-Delta_One_Module_Product_Guide"
              >
                <img
                  className="row-cover"
                  src="/img/cover_Delta_One_Module_Product_Guide.jpg"
                  alt="Cover of Module Product Guide"
                  loading="lazy"
                  width="510"
                  height="660"
                />
                <div className="row-body">
                  <div className="row-title">
                    <h3>Module Product Guide</h3>
                    <p className="doc-tag">Read 3 of 5 · For your customers</p>
                  </div>
                  <p className="plain">
                    Everything about a module, in order, with pictures: a day,
                    the first 11 days, the switch, the end at 2×.
                  </p>
                  <p className="plain-who">
                    <b>For:</b> Members &nbsp;·&nbsp; <b>When:</b> After they
                    have read the Key Facts and want the detail.
                  </p>
                  <details className="more">
                    <summary>More detail · PDF, 9 pages, 0.4 MB</summary>
                    <p className="doc-desc">
                      What a module is, how a day works, the first eleven days
                      and the auto-rebuy, how long a module runs, what different
                      sizes deliver, the app wallet and withdrawals, the risks,
                      and every rule in one place.
                    </p>
                  </details>
                </div>
                <div className="row-act actions">
                  <button
                    type="button"
                    className="btn primary sm view"
                    data-file="docs/Delta_One_Module_Product_Guide.pdf"
                    data-name="Delta_One_Module_Product_Guide.pdf"
                    data-title="Module Product Guide"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm dl"
                    id="dl-34"
                    data-file="docs/Delta_One_Module_Product_Guide.pdf"
                    data-name="Delta_One_Module_Product_Guide.pdf"
                    aria-label="Download Module Product Guide"
                    title="Download"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn listen sm ex"
                    data-id="Delta_One_Module_Product_Guide"
                    data-title="Module Product Guide"
                  >
                    <span className="ic">▶</span> Explain it{" "}
                    <span className="tm">0:26</span>
                  </button>
                  <button
                    type="button"
                    className="btn listen sm rd"
                    data-file="docs/Delta_One_Module_Product_Guide.pdf"
                    data-name="Delta_One_Module_Product_Guide.pdf"
                    data-title="Module Product Guide"
                    data-lang="en"
                    data-aria="1"
                  >
                    <span className="ic">▶</span>{" "}
                    <span className="l-aria">Aria reads it to me</span>
                    <span className="l-plain">Read it to me</span>
                  </button>
                </div>
                <p
                  className="status"
                  id="st-34"
                  role="status"
                  aria-live="polite"
                ></p>
              </article>
              <article className="doc row" id="doc-Delta_One_Module_FAQ">
                <img
                  className="row-cover"
                  src="/img/cover_Delta_One_Module_FAQ.jpg"
                  alt="Cover of Member FAQ"
                  loading="lazy"
                  width="510"
                  height="660"
                />
                <div className="row-body">
                  <div className="row-title">
                    <h3>Member FAQ</h3>
                    <p className="doc-tag">Read 4 of 5 · Plain answers</p>
                  </div>
                  <p className="plain">
                    The questions members ask, with short answers.
                  </p>
                  <p className="plain-who">
                    <b>For:</b> Members &nbsp;·&nbsp; <b>When:</b> When a member
                    asks you something you are not sure about.
                  </p>
                  <details className="more">
                    <summary>More detail · PDF, 4 pages, 0.4 MB</summary>
                    <p className="doc-desc">
                      Answers to the questions customers ask about results, the
                      first eleven days, the 2× maximum, their money,
                      commissions and risk.
                    </p>
                  </details>
                </div>
                <div className="row-act actions">
                  <button
                    type="button"
                    className="btn primary sm view"
                    data-file="docs/Delta_One_Module_FAQ.pdf"
                    data-name="Delta_One_Module_FAQ.pdf"
                    data-title="Member FAQ"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm dl"
                    id="dl-35"
                    data-file="docs/Delta_One_Module_FAQ.pdf"
                    data-name="Delta_One_Module_FAQ.pdf"
                    aria-label="Download Member FAQ"
                    title="Download"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn listen sm ex"
                    data-id="Delta_One_Module_FAQ"
                    data-title="Member FAQ"
                  >
                    <span className="ic">▶</span> Explain it{" "}
                    <span className="tm">0:24</span>
                  </button>
                  <button
                    type="button"
                    className="btn listen sm rd"
                    data-file="docs/Delta_One_Module_FAQ.pdf"
                    data-name="Delta_One_Module_FAQ.pdf"
                    data-title="Member FAQ"
                    data-lang="en"
                    data-aria="1"
                  >
                    <span className="ic">▶</span>{" "}
                    <span className="l-aria">Aria reads it to me</span>
                    <span className="l-plain">Read it to me</span>
                  </button>
                </div>
                <p
                  className="status"
                  id="st-35"
                  role="status"
                  aria-live="polite"
                ></p>
              </article>
              <article
                className="doc row"
                id="doc-Delta_One_Believer_Illustration"
              >
                <img
                  className="row-cover"
                  src="/img/cover_Delta_One_Believer_Illustration.jpg"
                  alt="Cover of The Believer"
                  loading="lazy"
                  width="510"
                  height="660"
                />
                <div className="row-body">
                  <div className="row-title">
                    <h3>The Believer</h3>
                    <p className="doc-tag">
                      Read 5 of 5 · Auto-Rebuy for a module's whole life
                    </p>
                  </div>
                  <p className="plain">
                    What happens if you leave Auto-Rebuy on for a module's whole
                    life: 220% instead of 200%.
                  </p>
                  <p className="plain-who">
                    <b>For:</b> Members who ask about the Believer &nbsp;·&nbsp;{" "}
                    <b>When:</b> Day 11, when the switch unlocks.
                  </p>
                  <details className="more">
                    <summary>More detail · PDF, 7 pages, 0.4 MB</summary>
                    <p className="doc-desc">
                      What a Believer is and what one 10,000 USDT module kept on
                      Auto-Rebuy delivers at the average: the fleet of rebuy
                      modules by day 440, the harvest when the switch unlocks,
                      longer horizons, other sizes, lower averages and the
                      rules.
                    </p>
                  </details>
                </div>
                <div className="row-act actions">
                  <button
                    type="button"
                    className="btn primary sm view"
                    data-file="docs/Delta_One_Believer_Illustration.pdf"
                    data-name="Delta_One_Believer_Illustration.pdf"
                    data-title="The Believer"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm dl"
                    id="dl-36"
                    data-file="docs/Delta_One_Believer_Illustration.pdf"
                    data-name="Delta_One_Believer_Illustration.pdf"
                    aria-label="Download The Believer"
                    title="Download"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn listen sm ex"
                    data-id="Delta_One_Believer_Illustration"
                    data-title="The Believer"
                  >
                    <span className="ic">▶</span> Explain it{" "}
                    <span className="tm">0:26</span>
                  </button>
                  <button
                    type="button"
                    className="btn listen sm rd"
                    data-file="docs/Delta_One_Believer_Illustration.pdf"
                    data-name="Delta_One_Believer_Illustration.pdf"
                    data-title="The Believer"
                    data-lang="en"
                  >
                    <span className="ic">▶</span> Read it to me
                  </button>
                </div>
                <p
                  className="status"
                  id="st-36"
                  role="status"
                  aria-live="polite"
                ></p>
              </article>
            </div>
            <div className="langline">
              <span className="ll">
                The Plan in Simple Words and the Key Facts are also in 19
                languages:
              </span>{" "}
              <a className="btn ghost sm !flex !justify-center !items-center" href="/languages" rel="noopener">
                Open the languages page ↗
              </a>
            </div>
          </div>

          <div className="block" id="try">
            <div className="block-head">
              <h3>
                <span className="bn n3">3</span>
                <span className="bt">Try · the calculator</span>
              </h3>
              <p>
                Enter a module size and an average daily result, choose the
                switch and the Believer, and see day by day what the module
                delivers at that average. It opens in a new tab and waits for
                you.
              </p>
              <button
                type="button"
                className="chip"
                data-done="3"
                data-go="#wallet"
              >
                ✓ I tried it
              </button>
            </div>
            <div className="strip">
              <a
                className="strip-card"
                href="/tools/calculator"
                target="_blank"
                rel="noopener"
                data-tool="calculator"
              >
                <span className="ic">🧮</span>
                <span>
                  <b>Module Calculator ↗</b>
                  <span className="tl">
                    When the price comes back, when 2× arrives, and the rebuy
                    modules on the way.
                  </span>
                </span>
              </a>
              <button type="button" className="strip-card" id="ask-open">
                <span className="ic">💬</span>
                <span>
                  <b>Ask Aria a question</b>
                  <span className="tl">
                    In your own words. Answers come from the plan's published
                    rules.
                  </span>
                </span>
              </button>
              <a className="strip-card" href="#help" data-go="#help">
                <span className="ic">🙋</span>
                <span>
                  <b>Talk to a person</b>
                  <span className="tl">
                    Zoom and live chat, further down the page.
                  </span>
                </span>
              </a>
            </div>
          </div>

          <div className="block" id="wallet">
            <div className="block-head">
              <h3>
                <span className="bn n4">4</span>
                <span className="bt">Set up · your wallet</span>
              </h3>
              <p>
                Before your first purchase you need a wallet, some USDT and a
                little BNB for fees. Short phone videos show every screen: start
                with the two basics, then pick <b>one</b> wallet and follow its
                five lessons, ending in your Delta One app. Each opens in a new
                tab; choose your language there.
              </p>
              <button type="button" className="chip" data-go="#distributors">
                ✓ My wallet is ready
              </button>
            </div>
            <div className="strip">
              <a
                className="strip-card"
                href="/wallets#g1"
                target="_blank"
                rel="noopener"
                data-tool="wallet-guides"
              >
                <span className="ic">💡</span>
                <span>
                  <b>Crypto in 60 seconds ↗</b>
                  <span className="tl">
                    A wallet, your 12-word secret phrase, USDT, BNB Smart Chain
                    and gas. Start here · 1:05
                  </span>
                </span>
              </a>
              <a
                className="strip-card"
                href="/wallets#g2"
                target="_blank"
                rel="noopener"
                data-tool="wallet-guides"
              >
                <span className="ic">🛡️</span>
                <span>
                  <b>Stay safe ↗</b>
                  <span className="tl">
                    Official app stores only, your 12 words on paper, the right
                    network, the exact amount · 1:06
                  </span>
                </span>
              </a>
              <a
                className="strip-card"
                href="/wallets#tp1"
                target="_blank"
                rel="noopener"
                data-tool="wallet-guides"
              >
                <span className="ic">👛</span>
                <span>
                  <b>TokenPocket · 5 lessons ↗</b>
                  <span className="tl">
                    Create, back up, add USDT, get BNB for fees, send to your
                    Delta One app · 5:34
                  </span>
                </span>
              </a>
              <a
                className="strip-card"
                href="/wallets#mm1"
                target="_blank"
                rel="noopener"
                data-tool="wallet-guides"
              >
                <span className="ic">👛</span>
                <span>
                  <b>MetaMask · 5 lessons ↗</b>
                  <span className="tl">
                    Create, back up, add USDT, get BNB for fees, send to your
                    Delta One app · 5:37
                  </span>
                </span>
              </a>
              <a
                className="strip-card"
                href="/wallets#tw1"
                target="_blank"
                rel="noopener"
                data-tool="wallet-guides"
              >
                <span className="ic">👛</span>
                <span>
                  <b>Trust Wallet · 5 lessons ↗</b>
                  <span className="tl">
                    Create, back up, add USDT, get BNB for fees, send to your
                    Delta One app · 6:00
                  </span>
                </span>
              </a>
            </div>
            <p className="langline">
              <span className="ll">
                In 20 languages, with the real Delta One app screens. Your
                secret phrase is yours alone: Delta One will never ask for it.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="zone dist step s2" id="distributors">
        <div className="wrap">
          <div className="zone-head">
            <span className="zone-ic">🧭</span>
            <div>
              <p className="kicker">For distributors</p>
              <h2 className="section-title">
                The plan, the words, your kit — and the checkpoint.
              </h2>
              <p className="section-lede">
                Watch the plan films, read the library shelf by shelf, plan your
                first ninety days, then check yourself. Most members earn no
                commission at all; say so in every conversation.
              </p>
            </div>
          </div>

          <div className="block" id="dist-watch">
            <div className="block-head">
              <h3>
                <span className="bt">
                  Watch · the plan, being a helper, the people behind it, the
                  whole presentation
                </span>
              </h3>
              <p>
                20 of 22 films are ready; the rest are in production and go live
                here the day they land.
              </p>
              <a
                className="btn primary sm !flex !justify-center !items-center"
                id="play-journey"
                href="/journey"
                rel="noopener"
              >
                ▶ Play the whole journey ↗
              </a>
            </div>
            <div className="reel-wrap">
              <button
                type="button"
                className="reel-btn prev"
                aria-label="Scroll back"
              >
                ‹
              </button>
              <div className="reel">
                <div className="reel-ch">
                  <span className="ck">Chapter 3</span>
                  <b>The plan</b>
                  <span className="cl">
                    How helpers are rewarded, rule by rule.
                  </span>
                </div>
                <a
                  className="tile5"
                  href="/journey#momentum_studio"
                  rel="noopener"
                  aria-label="Play The Momentum Plan"
                >
                  <img
                    src="/img/poster_momentum_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 7 · 4:53</span>
                    <b>The Momentum Plan</b>
                    <span className="ln">
                      Maya, Sam and Bolt: the whole plan in five minutes.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#matrix_studio"
                  rel="noopener"
                  aria-label="Play Two Coins in a Hundred"
                >
                  <img
                    src="/img/poster_matrix_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 8 · 2:14</span>
                    <b>Two Coins in a Hundred</b>
                    <span className="ln">
                      The base matrix: 2 of every 100 coins a contract earns, to
                      each qualified helper above it, level by level, 3 levels
                      at Fuji to 21 at Everest, with a daily cap per rank.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#hills_studio"
                  rel="noopener"
                  aria-label="Play Seven Hills"
                >
                  <img
                    src="/img/poster_hills_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 9 · 3:01</span>
                    <b>Seven Hills</b>
                    <span className="ln">
                      Fuji to Everest: your own box, your enrollees, your
                      team&#x27;s volume, the levels you are paid on, 6% to 42%,
                      and the daily cap. Only active boxes count; ranks are
                      checked every day.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#wide_studio"
                  rel="noopener"
                  aria-label="Play Plant Wide, Not Tall"
                >
                  <img
                    src="/img/poster_wide_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 10 · 2:18</span>
                    <b>Plant Wide, Not Tall</b>
                    <span className="ln">
                      The line balance rule: one line counts for at most half, a
                      third, a quarter or a fifth. 13,500 with 10,000 in one
                      line is Kilimanjaro, not Matterhorn.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#gap_studio"
                  rel="noopener"
                  aria-label="Play The Leader&#x27;s Gap"
                >
                  <img
                    src="/img/poster_gap_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 11 · 2:27</span>
                    <b>The Leader&#x27;s Gap</b>
                    <span className="ln">
                      The breakage differential: the gap between your
                      rank&#x27;s share and the highest share already claimed
                      below you. No cap, no depth limit, never more than 42 in
                      all.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#honest_studio"
                  rel="noopener"
                  aria-label="Play What Most Helpers Earn"
                >
                  <img
                    src="/img/poster_honest_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 12 · 2:00</span>
                    <b>What Most Helpers Earn</b>
                    <span className="ln">
                      Four helpers, four months: 18, 324, 243 and 990 USDT. Most
                      members earn no commission at all. Nothing is guaranteed.
                    </span>
                  </span>
                </a>
                <div className="reel-ch">
                  <span className="ck">Chapter 4</span>
                  <b>Being a helper</b>
                  <span className="cl">
                    Your first day, your words, your first conversation, your
                    first 90 days, and the rules.
                  </span>
                </div>
                <a
                  className="tile5"
                  href="/journey#firstday_studio"
                  target="_blank"
                  rel="noopener"
                  aria-label="Play Your First Day"
                >
                  <img
                    src="/img/poster_firstday_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 13 · 4:05</span>
                    <b>Your First Day</b>
                    <span className="ln">
                      Account, identity check, wallet, your own box, the first
                      eleven days, your tools: the checklist as a story.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#words_studio"
                  target="_blank"
                  rel="noopener"
                  aria-label="Play Say It Right"
                >
                  <img
                    src="/img/poster_words_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 14 · 3:48</span>
                    <b>Say It Right</b>
                    <span className="ln">
                      Purchase, not investment. Result, not return. Rebuy, not
                      reinvest. Rewards, not income. Five sentences you can
                      always say.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#friend_studio"
                  target="_blank"
                  rel="noopener"
                  aria-label="Play Telling a Friend"
                >
                  <img
                    src="/img/poster_friend_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 15 · 3:07</span>
                    <b>Telling a Friend</b>
                    <span className="ln">
                      The five-minute conversation: what you say, what you never
                      promise, the question you ask, and what you send next.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#ninety_studio"
                  target="_blank"
                  rel="noopener"
                  aria-label="Play The First 90 Days"
                >
                  <img
                    src="/img/poster_ninety_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 16 · 3:46</span>
                    <b>The First 90 Days</b>
                    <span className="ln">
                      Day 0, 1, 11, 200, 400 and 440 for a member; your list of
                      50, your lines, and what you say on each day.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#rules_studio"
                  target="_blank"
                  rel="noopener"
                  aria-label="Play The Rules of the Road"
                >
                  <img
                    src="/img/poster_rules_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 17 · 4:16</span>
                    <b>The Rules of the Road</b>
                    <span className="ln">
                      No promises, no income claims, no pictures of money. What
                      you may say, what you may never say, and what gets a
                      helper removed.
                    </span>
                  </span>
                </a>
                <div className="reel-ch">
                  <span className="ck">Chapter 5</span>
                  <b>Who is behind it</b>
                  <span className="cl">
                    The founders, the seats and the company.
                  </span>
                </div>
                <a
                  className="tile5"
                  href="/journey#founder_studio"
                  target="_blank"
                  rel="noopener"
                  aria-label="Play Founder Seats"
                >
                  <img
                    src="/img/poster_founder_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 18 · 4:02</span>
                    <b>Founder Seats</b>
                    <span className="ln">
                      Nora and Bolt: 260 seats, the share, the seat box, the
                      30-day rule, the permanent NFT.
                    </span>
                  </span>
                </a>
                <a
                  className="tile5"
                  href="/journey#who_studio"
                  target="_blank"
                  rel="noopener"
                  aria-label="Play Who Is Delta One"
                >
                  <img
                    src="/img/poster_who_studio.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 19 · 3:18</span>
                    <b>Who Is Delta One</b>
                    <span className="ln">
                      The engine, James and Ricky, custody with more than one
                      key, settlement at 12:00 UTC every day, and the DAO.
                    </span>
                  </span>
                </a>
                <div className="reel-ch">
                  <span className="ck">Chapter 6</span>
                  <b>The whole presentation</b>
                  <span className="cl">
                    Every rule and every number, once more, in order.
                  </span>
                </div>
                <div
                  className="tile5 soon"
                  aria-label="The presentation, built from blocks · part 1, film in production"
                >
                  <span className="soon-art">
                    <span>Film in production</span>
                  </span>
                  <span className="tc">
                    <span className="ep">Episode 20 · coming</span>
                    <b>The presentation, built from blocks · part 1</b>
                    <span className="ln">
                      The engine, the module, the split, the average, one
                      module&#x27;s life, the two ways the plan pays, the ranks,
                      the line rule.
                    </span>
                  </span>
                </div>
                <div
                  className="tile5 soon"
                  aria-label="The presentation, built from blocks · part 2, film in production"
                >
                  <span className="soon-art">
                    <span>Film in production</span>
                  </span>
                  <span className="tc">
                    <span className="ep">Episode 21 · coming</span>
                    <b>The presentation, built from blocks · part 2</b>
                    <span className="ln">
                      The base matrix in numbers, the differential with a worked
                      example, the four scenarios, the Believer, the six rules,
                      the fine print.
                    </span>
                  </span>
                </div>
                <a
                  className="tile5"
                  href="/journey#pres"
                  target="_blank"
                  rel="noopener"
                  aria-label="Play The presentation, narrated by Aria"
                >
                  <img
                    src="/img/poster_pres.jpg"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                  <span className="tc">
                    <span className="ep">Episode 22 · 10:17</span>
                    <b>The presentation, narrated by Aria</b>
                    <span className="ln">
                      Seventeen slides, every rule and every number.
                    </span>
                  </span>
                </a>
              </div>
              <button
                type="button"
                className="reel-btn next"
                aria-label="Scroll forward"
              >
                ›
              </button>
            </div>
          </div>

          <div className="block library" id="library">
            <div className="block-head">
              <h3>
                <span className="bt">Read · the library, shelf by shelf</span>
              </h3>
              <p>
                Every document is here once. Open a shelf, and every row says in
                one line what the document is, who it is for and when to use it.
              </p>
            </div>

            <details className="shelf group" id="plan" open>
              <summary>
                <span className="sh-t">
                  <h2>The plan, in full</h2>
                  <span className="cnt">6 documents</span>
                </span>
                <span className="sh-s">
                  The one-pager, the guides and the two rules every rank depends
                  on. Start with 7 Summits to Success.
                </span>
              </summary>
              <div className="rows">
                <article
                  className="doc row"
                  id="doc-Delta_One_7_Summits_to_Success"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_7_Summits_to_Success.jpg"
                    alt="Cover of 7 Summits to Success"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>7 Summits to Success</h3>
                      <p className="doc-tag">The plan on one page</p>
                    </div>
                    <p className="plain">
                      The whole plan as one picture: the 7 Summits to Success,
                      the 2% ladder from 6% to 42%, the line limit and the daily
                      cap for every rank.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Everyone &nbsp;·&nbsp; <b>When:</b> To hand
                      over, pin up or show on a phone.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 3 pages, 2.0 MB</summary>
                      <p className="doc-desc">
                        The whole Momentum Plan as one picture: the 7 Summits to
                        Success from Fuji to Everest with each rank's 2% ladder,
                        the number of levels it unlocks, the maximum any single
                        line may count and the daily cap; then the ranks panel
                        and the payout panel on their own pages. Three pages,
                        made to hand over, pin up or share on a phone.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_7_Summits_to_Success.pdf"
                      data-name="Delta_One_7_Summits_to_Success.pdf"
                      data-title="7 Summits to Success"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-1"
                      data-file="docs/Delta_One_7_Summits_to_Success.pdf"
                      data-name="Delta_One_7_Summits_to_Success.pdf"
                      aria-label="Download 7 Summits to Success"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_7_Summits_to_Success"
                      data-title="7 Summits to Success"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:29</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_7_Summits_to_Success.pdf"
                      data-name="Delta_One_7_Summits_to_Success.pdf"
                      data-title="7 Summits to Success"
                      data-lang="en"
                      data-aria="1"
                    >
                      <span className="ic">▶</span>{" "}
                      <span className="l-aria">Aria reads it to me</span>
                      <span className="l-plain">Read it to me</span>
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-1"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Momentum_Plan_Guide"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Momentum_Plan_Guide.jpg"
                    alt="Cover of Momentum Plan Guide"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Momentum Plan Guide</h3>
                      <p className="doc-tag">
                        The plan · 2% per level + differential
                      </p>
                    </div>
                    <p className="plain">
                      The complete plan with every rule and every number. The
                      reference.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors and partners &nbsp;·&nbsp;{" "}
                      <b>When:</b> When you need the exact rule.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 15 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        The full Momentum Plan: every rank and what it takes to
                        reach it, worked examples for a 1,000 USDT and a 10,000
                        USDT module, what 1 million USDT of team volume pays,
                        what it takes to earn 10,000 USDT, 100,000 USDT or 1
                        million USDT a month, and timing.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Momentum_Plan_Guide.pdf"
                      data-name="Delta_One_Momentum_Plan_Guide.pdf"
                      data-title="Momentum Plan Guide"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-2"
                      data-file="docs/Delta_One_Momentum_Plan_Guide.pdf"
                      data-name="Delta_One_Momentum_Plan_Guide.pdf"
                      aria-label="Download Momentum Plan Guide"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Momentum_Plan_Guide"
                      data-title="Momentum Plan Guide"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:26</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Momentum_Plan_Guide.pdf"
                      data-name="Delta_One_Momentum_Plan_Guide.pdf"
                      data-title="Momentum Plan Guide"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-2"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Momentum_Plan_Distributor_Guide"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Momentum_Plan_Distributor_Guide.jpg"
                    alt="Cover of Distributor Guide"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Distributor Guide</h3>
                      <p className="doc-tag">Every rule and scenario</p>
                    </div>
                    <p className="plain">
                      The plan written for a distributor: every rule with the
                      reason behind it, four worked examples, the rewards
                      disclosure.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> Your
                      second day. Read it twice.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 15 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        The complete Momentum Plan for your team: key terms,
                        ranks and the line balance rule, the base matrix, daily
                        caps, the breakage differential, four fully worked
                        scenarios, a worksheet and the rewards disclosure.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Momentum_Plan_Distributor_Guide.pdf"
                      data-name="Delta_One_Momentum_Plan_Distributor_Guide.pdf"
                      data-title="Distributor Guide"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-3"
                      data-file="docs/Delta_One_Momentum_Plan_Distributor_Guide.pdf"
                      data-name="Delta_One_Momentum_Plan_Distributor_Guide.pdf"
                      aria-label="Download Distributor Guide"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Momentum_Plan_Distributor_Guide"
                      data-title="Distributor Guide"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:26</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Momentum_Plan_Distributor_Guide.pdf"
                      data-name="Delta_One_Momentum_Plan_Distributor_Guide.pdf"
                      data-title="Distributor Guide"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-3"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Line_Balance_Rule"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Line_Balance_Rule.jpg"
                    alt="Cover of Line Balance Rule"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Line Balance Rule</h3>
                      <p className="doc-tag">Rank qualification</p>
                    </div>
                    <p className="plain">
                      One rule, one page: no single line can be more than half,
                      a third, a quarter or a fifth of your rank volume.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors and leaders &nbsp;·&nbsp;{" "}
                      <b>When:</b> When someone asks why their rank did not
                      move.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 1 page, 0.1 MB</summary>
                      <p className="doc-desc">
                        The one-page rule every rank is qualified on: no single
                        line can count for more than 50%, one third, 25% or 20%
                        of a rank's qualifying volume, with a worked example.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Line_Balance_Rule.pdf"
                      data-name="Delta_One_Line_Balance_Rule.pdf"
                      data-title="Line Balance Rule"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-4"
                      data-file="docs/Delta_One_Line_Balance_Rule.pdf"
                      data-name="Delta_One_Line_Balance_Rule.pdf"
                      aria-label="Download Line Balance Rule"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Line_Balance_Rule"
                      data-title="Line Balance Rule"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:23</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Line_Balance_Rule.pdf"
                      data-name="Delta_One_Line_Balance_Rule.pdf"
                      data-title="Line Balance Rule"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-4"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Momentum_Plan_Breakage_Differential"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Momentum_Plan_Breakage_Differential.jpg"
                    alt="Cover of Breakage Differential"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Breakage Differential</h3>
                      <p className="doc-tag">How leaders are paid</p>
                    </div>
                    <p className="plain">
                      How leaders are paid: the gap between your rank's
                      percentage and the percentages below you.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Leaders &nbsp;·&nbsp; <b>When:</b> When you
                      reach Kilimanjaro and want to understand your leader pay.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 11 pages, 0.4 MB</summary>
                      <p className="doc-desc">
                        How the breakage differential works: rank entitlements
                        from 6% to 42%, one contract level by level, why you
                        must stay ahead, why new lines pay more, and what each
                        rewards goal takes.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Momentum_Plan_Breakage_Differential.pdf"
                      data-name="Delta_One_Momentum_Plan_Breakage_Differential.pdf"
                      data-title="Breakage Differential"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-5"
                      data-file="docs/Delta_One_Momentum_Plan_Breakage_Differential.pdf"
                      data-name="Delta_One_Momentum_Plan_Breakage_Differential.pdf"
                      aria-label="Download Breakage Differential"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Momentum_Plan_Breakage_Differential"
                      data-title="Breakage Differential"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:27</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Momentum_Plan_Breakage_Differential.pdf"
                      data-name="Delta_One_Momentum_Plan_Breakage_Differential.pdf"
                      data-title="Breakage Differential"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-5"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Momentum_Plan_Presentation"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Momentum_Plan_Presentation.jpg"
                    alt="Cover of Momentum Plan Presentation"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Momentum Plan Presentation</h3>
                      <p className="doc-tag">
                        17 slides · Aria reads them to you
                      </p>
                    </div>
                    <p className="plain">
                      The 17 slides that explain the whole plan. Aria reads them
                      to you.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Everyone &nbsp;·&nbsp; <b>When:</b> Your first
                      hour. Then every time you present.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 17 pages, 8.0 MB</summary>
                      <p className="doc-desc">
                        The seventeen slides of the Momentum Plan with Aria's
                        narration attached to every page (paperclip icon). The
                        speaker edition adds sales notes.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Momentum_Plan_Presentation.pdf"
                      data-name="Delta_One_Momentum_Plan_Presentation.pdf"
                      data-title="Momentum Plan Presentation"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-6"
                      data-file="docs/Delta_One_Momentum_Plan_Presentation.pdf"
                      data-name="Delta_One_Momentum_Plan_Presentation.pdf"
                      aria-label="Download Momentum Plan Presentation"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      data-file="docs/Delta_One_Momentum_Plan_Presentation_Speaker_Edition.pdf"
                      data-name="Delta_One_Momentum_Plan_Presentation_Speaker_Edition.pdf"
                    >
                      Speaker edition + audio
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Momentum_Plan_Presentation"
                      data-title="Momentum Plan Presentation"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:25</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Momentum_Plan_Presentation.pdf"
                      data-name="Delta_One_Momentum_Plan_Presentation.pdf"
                      data-title="Momentum Plan Presentation"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-6"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
              </div>
            </details>
            <details className="shelf group" id="say" open>
              <summary>
                <span className="sh-t">
                  <h2>What to say</h2>
                  <span className="cnt">4 documents</span>
                </span>
                <span className="sh-s">
                  The plan across a table: one page, four sketches, five
                  minutes, and the Believer choice.
                </span>
              </summary>
              <div className="rows">
                <article
                  className="doc row"
                  id="doc-Delta_One_Momentum_Plan_Cheat_Sheet"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Momentum_Plan_Cheat_Sheet.jpg"
                    alt="Cover of Cheat Sheet"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Cheat Sheet</h3>
                      <p className="doc-tag">The plan on one page</p>
                    </div>
                    <p className="plain">
                      The whole plan on one page: ranks, the three ways a
                      contract pays, five rules.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> Keep
                      it next to you when you talk.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 1 page, 0.1 MB</summary>
                      <p className="doc-desc">
                        Rank table, the three ways each contract pays, five
                        rules to remember and the quick math — on a single page.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Momentum_Plan_Cheat_Sheet.pdf"
                      data-name="Delta_One_Momentum_Plan_Cheat_Sheet.pdf"
                      data-title="Cheat Sheet"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-7"
                      data-file="docs/Delta_One_Momentum_Plan_Cheat_Sheet.pdf"
                      data-name="Delta_One_Momentum_Plan_Cheat_Sheet.pdf"
                      aria-label="Download Cheat Sheet"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Momentum_Plan_Cheat_Sheet"
                      data-title="Cheat Sheet"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:22</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Momentum_Plan_Cheat_Sheet.pdf"
                      data-name="Delta_One_Momentum_Plan_Cheat_Sheet.pdf"
                      data-title="Cheat Sheet"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-7"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Momentum_Plan_Napkin"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Momentum_Plan_Napkin.jpg"
                    alt="Cover of Napkin Presentation"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Napkin Presentation</h3>
                      <p className="doc-tag">Four sketches</p>
                    </div>
                    <p className="plain">
                      The plan in four sketches, the way you would draw it over
                      coffee.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> A
                      five-minute explanation to a friend.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 1 page, 0.1 MB</summary>
                      <p className="doc-desc">
                        The plan drawn the way you would explain it over coffee:
                        buy a module, the 100 USDT split, balanced lines, paid
                        two ways.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Momentum_Plan_Napkin.pdf"
                      data-name="Delta_One_Momentum_Plan_Napkin.pdf"
                      data-title="Napkin Presentation"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-8"
                      data-file="docs/Delta_One_Momentum_Plan_Napkin.pdf"
                      data-name="Delta_One_Momentum_Plan_Napkin.pdf"
                      aria-label="Download Napkin Presentation"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Momentum_Plan_Napkin"
                      data-title="Napkin Presentation"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:25</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Momentum_Plan_Napkin.pdf"
                      data-name="Delta_One_Momentum_Plan_Napkin.pdf"
                      data-title="Napkin Presentation"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-8"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Five_Minute_Conversation_Card"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Five_Minute_Conversation_Card.jpg"
                    alt="Cover of Five-Minute Conversation"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Five-Minute Conversation</h3>
                      <p className="doc-tag">
                        One card · what to say, minute by minute
                      </p>
                    </div>
                    <p className="plain">
                      The five-minute conversation on one card: five lines to
                      say, the house words, what to send next.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> Before
                      your first conversation, and in your pocket after that.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 1 page, 0.1 MB</summary>
                      <p className="doc-desc">
                        The five-minute conversation on one card: the five lines
                        to say, the house words and the words never to use, what
                        to send next, and the three things you never do.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Five_Minute_Conversation_Card.pdf"
                      data-name="Delta_One_Five_Minute_Conversation_Card.pdf"
                      data-title="Five-Minute Conversation"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-9"
                      data-file="docs/Delta_One_Five_Minute_Conversation_Card.pdf"
                      data-name="Delta_One_Five_Minute_Conversation_Card.pdf"
                      aria-label="Download Five-Minute Conversation"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Five_Minute_Conversation_Card.pdf"
                      data-name="Delta_One_Five_Minute_Conversation_Card.pdf"
                      data-title="Five-Minute Conversation"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-9"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Believer_Key_Facts"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Believer_Key_Facts.jpg"
                    alt="Cover of Believer Key Facts"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Believer Key Facts</h3>
                      <p className="doc-tag">One page · the Believer choice</p>
                    </div>
                    <p className="plain">
                      One page: what a Believer is, the binding switch, the
                      snowball, and a 1,000 USDT module three ways.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Members who ask about the Believer
                      &nbsp;·&nbsp; <b>When:</b> Before anyone chooses Believer.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 1 page, 0.1 MB</summary>
                      <p className="doc-desc">
                        What a Believer is, what 220% changes, the binding
                        switch, the snowball, and a 1,000 USDT module three ways
                        at the average, with the risks.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Believer_Key_Facts.pdf"
                      data-name="Delta_One_Believer_Key_Facts.pdf"
                      data-title="Believer Key Facts"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-10"
                      data-file="docs/Delta_One_Believer_Key_Facts.pdf"
                      data-name="Delta_One_Believer_Key_Facts.pdf"
                      aria-label="Download Believer Key Facts"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Believer_Key_Facts.pdf"
                      data-name="Delta_One_Believer_Key_Facts.pdf"
                      data-title="Believer Key Facts"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-10"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
              </div>
            </details>
            <details className="shelf group" id="kit">
              <summary>
                <span className="sh-t">
                  <h2>Your kit, step by step</h2>
                  <span className="cnt">18 documents</span>
                </span>
                <span className="sh-s">
                  Eighteen short documents in the order a new distributor needs
                  them. Start with the Kit Index.
                </span>
              </summary>
              <div className="rows">
                <article
                  className="doc row"
                  id="doc-Delta_One_Which_Document_Do_I_Need"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Which_Document_Do_I_Need.jpg"
                    alt="Cover of Which document do I need?"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Which document do I need?</h3>
                      <p className="doc-tag">
                        Start here · every document in one line
                      </p>
                    </div>
                    <p className="plain">
                      Every document in one line: what it is, who it is for,
                      when to open it.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Everyone &nbsp;·&nbsp; <b>When:</b> First.
                      Then whenever you are lost.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 7 pages, 0.6 MB</summary>
                      <p className="doc-desc">
                        Every document in one line: what it is, who it is for
                        and when to open it, plus the 'I want to… open this'
                        table. Read this first.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Which_Document_Do_I_Need.pdf"
                      data-name="Delta_One_Which_Document_Do_I_Need.pdf"
                      data-title="Which document do I need?"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-11"
                      data-file="docs/Delta_One_Which_Document_Do_I_Need.pdf"
                      data-name="Delta_One_Which_Document_Do_I_Need.pdf"
                      aria-label="Download Which document do I need?"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Which_Document_Do_I_Need"
                      data-title="Which document do I need?"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:21</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Which_Document_Do_I_Need.pdf"
                      data-name="Delta_One_Which_Document_Do_I_Need.pdf"
                      data-title="Which document do I need?"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-11"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Distributor_Kit_Index"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Distributor_Kit_Index.jpg"
                    alt="Cover of The Distributor Kit Index"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>The Distributor Kit Index</h3>
                      <p className="doc-tag">
                        Start here · who gets what, in which order
                      </p>
                    </div>
                    <p className="plain">
                      The map of the kit: every document, in the order a new
                      person needs it, and a five-day training plan.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> New distributors &nbsp;·&nbsp; <b>When:</b>{" "}
                      Your very first document.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 5 pages, 0.6 MB</summary>
                      <p className="doc-desc">
                        Every document in the kit in journey order (steps 0 to
                        9), who gets what and what never to hand them, and the
                        five-day training path for a new distributor's first
                        week.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Distributor_Kit_Index.pdf"
                      data-name="Delta_One_Distributor_Kit_Index.pdf"
                      data-title="The Distributor Kit Index"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-12"
                      data-file="docs/Delta_One_Distributor_Kit_Index.pdf"
                      data-name="Delta_One_Distributor_Kit_Index.pdf"
                      aria-label="Download The Distributor Kit Index"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Distributor_Kit_Index"
                      data-title="The Distributor Kit Index"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:21</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Distributor_Kit_Index.pdf"
                      data-name="Delta_One_Distributor_Kit_Index.pdf"
                      data-title="The Distributor Kit Index"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-12"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Rewards_Disclosure_Statement"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Rewards_Disclosure_Statement.jpg"
                    alt="Cover of Rewards Disclosure Statement"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Rewards Disclosure Statement</h3>
                      <p className="doc-tag">0 · Before anything</p>
                    </div>
                    <p className="plain">
                      What members in the model earn, rank by rank. Most members
                      earn no commission at all.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Every prospect &nbsp;·&nbsp; <b>When:</b> Hand
                      it over with the Key Facts.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 3 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        What members in the model earn, rank by rank, including
                        the most important line: most members earn no commission
                        at all. Goes to every prospect with the Key Facts.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Rewards_Disclosure_Statement.pdf"
                      data-name="Delta_One_Rewards_Disclosure_Statement.pdf"
                      data-title="Rewards Disclosure Statement"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-13"
                      data-file="docs/Delta_One_Rewards_Disclosure_Statement.pdf"
                      data-name="Delta_One_Rewards_Disclosure_Statement.pdf"
                      aria-label="Download Rewards Disclosure Statement"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Rewards_Disclosure_Statement"
                      data-title="Rewards Disclosure Statement"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:20</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Rewards_Disclosure_Statement.pdf"
                      data-name="Delta_One_Rewards_Disclosure_Statement.pdf"
                      data-title="Rewards Disclosure Statement"
                      data-lang="en"
                      data-aria="1"
                    >
                      <span className="ic">▶</span>{" "}
                      <span className="l-aria">Aria reads it to me</span>
                      <span className="l-plain">Read it to me</span>
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-13"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article className="doc row" id="doc-Delta_One_Language_Card">
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Language_Card.jpg"
                    alt="Cover of The Language Card"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>The Language Card</h3>
                      <p className="doc-tag">0 · What we say and never say</p>
                    </div>
                    <p className="plain">
                      The words we use and the words we never use, and five
                      sentences you can always say.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> Read
                      it before your first conversation and once a week after.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 3 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        Purchase not investment, result not return, rebuy not
                        reinvest: the words, the five sentences a distributor
                        can always use, and the claims that are never made.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Language_Card.pdf"
                      data-name="Delta_One_Language_Card.pdf"
                      data-title="The Language Card"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-14"
                      data-file="docs/Delta_One_Language_Card.pdf"
                      data-name="Delta_One_Language_Card.pdf"
                      aria-label="Download The Language Card"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Language_Card"
                      data-title="The Language Card"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:21</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Language_Card.pdf"
                      data-name="Delta_One_Language_Card.pdf"
                      data-title="The Language Card"
                      data-lang="en"
                      data-aria="1"
                    >
                      <span className="ic">▶</span>{" "}
                      <span className="l-aria">Aria reads it to me</span>
                      <span className="l-plain">Read it to me</span>
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-14"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article className="doc row" id="doc-Delta_One_Rank_Roadmap">
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Rank_Roadmap.jpg"
                    alt="Cover of The Rank Roadmap"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>The Rank Roadmap</h3>
                      <p className="doc-tag">2 · Seven ranks, one page each</p>
                    </div>
                    <p className="plain">
                      Seven ranks, one page each: what it takes, what a team
                      looks like, what it pays.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> When
                      you set your next goal.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 8 pages, 0.7 MB</summary>
                      <p className="doc-desc">
                        For each rank: the requirements, the shape of
                        organization that holds it under the line balance rule,
                        and what the smallest qualifying organization pays at
                        the average, computed from the plan's reference code.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Rank_Roadmap.pdf"
                      data-name="Delta_One_Rank_Roadmap.pdf"
                      data-title="The Rank Roadmap"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-15"
                      data-file="docs/Delta_One_Rank_Roadmap.pdf"
                      data-name="Delta_One_Rank_Roadmap.pdf"
                      aria-label="Download The Rank Roadmap"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Rank_Roadmap"
                      data-title="The Rank Roadmap"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:17</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Rank_Roadmap.pdf"
                      data-name="Delta_One_Rank_Roadmap.pdf"
                      data-title="The Rank Roadmap"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-15"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Getting_Started_Checklist"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Getting_Started_Checklist.jpg"
                    alt="Cover of Getting Started Checklist"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Getting Started Checklist</h3>
                      <p className="doc-tag">3 · Account, wallet, own module</p>
                    </div>
                    <p className="plain">
                      Tick boxes: account, identity check, wallet, your own
                      module, the first 11 days, your tools.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> New members and distributors &nbsp;·&nbsp;{" "}
                      <b>When:</b> Your first day, with your sponsor.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 3 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        Account and identity check, the wallet, the own module,
                        the first eleven days and the Auto-Rebuy decision on day
                        11, the tools and the first conversations, as a
                        checklist with a sponsor.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Getting_Started_Checklist.pdf"
                      data-name="Delta_One_Getting_Started_Checklist.pdf"
                      data-title="Getting Started Checklist"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-16"
                      data-file="docs/Delta_One_Getting_Started_Checklist.pdf"
                      data-name="Delta_One_Getting_Started_Checklist.pdf"
                      aria-label="Download Getting Started Checklist"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Getting_Started_Checklist"
                      data-title="Getting Started Checklist"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:17</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Getting_Started_Checklist.pdf"
                      data-name="Delta_One_Getting_Started_Checklist.pdf"
                      data-title="Getting Started Checklist"
                      data-lang="en"
                      data-aria="1"
                    >
                      <span className="ic">▶</span>{" "}
                      <span className="l-aria">Aria reads it to me</span>
                      <span className="l-plain">Read it to me</span>
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-16"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_USDT_and_Wallet_Guide"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_USDT_and_Wallet_Guide.jpg"
                    alt="Cover of USDT &amp; Wallet Guide"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>USDT & Wallet Guide</h3>
                      <p className="doc-tag">
                        3 · Getting, sending and withdrawing USDT
                      </p>
                    </div>
                    <p className="plain">
                      How to get USDT, send it to the app and take money out,
                      and the mistakes that lose money.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Everyone who has never used USDT &nbsp;·&nbsp;{" "}
                      <b>When:</b> Before the first purchase and before the
                      first withdrawal.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 4 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        USDT on BNB Smart Chain (BEP-20) explained for a
                        first-time user: buying it, sending it to the app, the
                        network choice, gas, the 5 USDT minimum withdrawal, and
                        the mistakes that lose money.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_USDT_and_Wallet_Guide.pdf"
                      data-name="Delta_One_USDT_and_Wallet_Guide.pdf"
                      data-title="USDT &amp; Wallet Guide"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-17"
                      data-file="docs/Delta_One_USDT_and_Wallet_Guide.pdf"
                      data-name="Delta_One_USDT_and_Wallet_Guide.pdf"
                      aria-label="Download USDT &amp; Wallet Guide"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_USDT_and_Wallet_Guide"
                      data-title="USDT &amp; Wallet Guide"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:26</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_USDT_and_Wallet_Guide.pdf"
                      data-name="Delta_One_USDT_and_Wallet_Guide.pdf"
                      data-title="USDT &amp; Wallet Guide"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-17"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_First_90_Days_Workbook"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_First_90_Days_Workbook.jpg"
                    alt="Cover of First 90 Days Workbook"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>First 90 Days Workbook</h3>
                      <p className="doc-tag">4 · The planner on paper</p>
                    </div>
                    <p className="plain">
                      Your first 90 days on paper: dates, goals, lines, your
                      list of 50.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> New distributors &nbsp;·&nbsp; <b>When:</b>{" "}
                      Day 1. Fill it in with a pen.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 7 pages, 0.6 MB</summary>
                      <p className="doc-desc">
                        The Fast Start planner as a printed workbook: dates,
                        goals, the lines you will open, the list of 50, the
                        first ten conversations and the day-11, day-30 and
                        day-90 reviews.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_First_90_Days_Workbook.pdf"
                      data-name="Delta_One_First_90_Days_Workbook.pdf"
                      data-title="First 90 Days Workbook"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-18"
                      data-file="docs/Delta_One_First_90_Days_Workbook.pdf"
                      data-name="Delta_One_First_90_Days_Workbook.pdf"
                      aria-label="Download First 90 Days Workbook"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_First_90_Days_Workbook"
                      data-title="First 90 Days Workbook"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:21</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_First_90_Days_Workbook.pdf"
                      data-name="Delta_One_First_90_Days_Workbook.pdf"
                      data-title="First 90 Days Workbook"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-18"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Member_Journey_Calendar"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Member_Journey_Calendar.jpg"
                    alt="Cover of Member Journey Calendar"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Member Journey Calendar</h3>
                      <p className="doc-tag">4 · Day 0, 1, 11, 200, 400, 440</p>
                    </div>
                    <p className="plain">
                      What happens to a member's module on day 0, 1, 11, 200,
                      400 and 440, and what you say on each day.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> Keep
                      it with your member list.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 3 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        What happens to a member's module on each important day
                        and what the distributor says and sends at each one.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Member_Journey_Calendar.pdf"
                      data-name="Delta_One_Member_Journey_Calendar.pdf"
                      data-title="Member Journey Calendar"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-19"
                      data-file="docs/Delta_One_Member_Journey_Calendar.pdf"
                      data-name="Delta_One_Member_Journey_Calendar.pdf"
                      aria-label="Download Member Journey Calendar"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Member_Journey_Calendar"
                      data-title="Member Journey Calendar"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:19</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Member_Journey_Calendar.pdf"
                      data-name="Delta_One_Member_Journey_Calendar.pdf"
                      data-title="Member Journey Calendar"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-19"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Prospect_Conversation_Guide"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Prospect_Conversation_Guide.jpg"
                    alt="Cover of Prospect Conversation Guide"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Prospect Conversation Guide</h3>
                      <p className="doc-tag">
                        5 · Nine moves, seventeen questions
                      </p>
                    </div>
                    <p className="plain">
                      How a good conversation goes: nine steps, seventeen
                      questions, ten objections, ten comparisons that stay
                      inside the rules.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> Before
                      your first ten conversations.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 7 pages, 0.7 MB</summary>
                      <p className="doc-desc">
                        How a compliant conversation runs: nine moves from
                        opening to the Key Facts, seventeen questions, ten
                        objections with honest answers, ten analogies that stay
                        inside the rules.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Prospect_Conversation_Guide.pdf"
                      data-name="Delta_One_Prospect_Conversation_Guide.pdf"
                      data-title="Prospect Conversation Guide"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-20"
                      data-file="docs/Delta_One_Prospect_Conversation_Guide.pdf"
                      data-name="Delta_One_Prospect_Conversation_Guide.pdf"
                      aria-label="Download Prospect Conversation Guide"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Prospect_Conversation_Guide"
                      data-title="Prospect Conversation Guide"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:19</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Prospect_Conversation_Guide.pdf"
                      data-name="Delta_One_Prospect_Conversation_Guide.pdf"
                      data-title="Prospect Conversation Guide"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-20"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Follow_Up_Messages"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Follow_Up_Messages.jpg"
                    alt="Cover of Follow-up Messages"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Follow-up Messages</h3>
                      <p className="doc-tag">5 · Ten compliant messages</p>
                    </div>
                    <p className="plain">
                      Ten messages you can send as they are, from first contact
                      to day 11.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> Copy,
                      paste, send.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 4 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        Ten messages a distributor can send as they are, from
                        the first contact to day 11, each one checked against
                        the Language Card.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Follow_Up_Messages.pdf"
                      data-name="Delta_One_Follow_Up_Messages.pdf"
                      data-title="Follow-up Messages"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-21"
                      data-file="docs/Delta_One_Follow_Up_Messages.pdf"
                      data-name="Delta_One_Follow_Up_Messages.pdf"
                      aria-label="Download Follow-up Messages"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Follow_Up_Messages"
                      data-title="Follow-up Messages"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:15</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Follow_Up_Messages.pdf"
                      data-name="Delta_One_Follow_Up_Messages.pdf"
                      data-title="Follow-up Messages"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-21"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_New_Member_Welcome_Pack"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_New_Member_Welcome_Pack.jpg"
                    alt="Cover of New Member Welcome Pack"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>New Member Welcome Pack</h3>
                      <p className="doc-tag">6 · What to send and when</p>
                    </div>
                    <p className="plain">
                      What to send a new member and when: day 0, 1, 11 and 200.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> The
                      day someone buys.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 3 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        The welcome sequence for a new member: the documents to
                        send on day 0, 1, 11 and 200, and the words to send them
                        with.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_New_Member_Welcome_Pack.pdf"
                      data-name="Delta_One_New_Member_Welcome_Pack.pdf"
                      data-title="New Member Welcome Pack"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-22"
                      data-file="docs/Delta_One_New_Member_Welcome_Pack.pdf"
                      data-name="Delta_One_New_Member_Welcome_Pack.pdf"
                      aria-label="Download New Member Welcome Pack"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_New_Member_Welcome_Pack"
                      data-title="New Member Welcome Pack"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:17</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_New_Member_Welcome_Pack.pdf"
                      data-name="Delta_One_New_Member_Welcome_Pack.pdf"
                      data-title="New Member Welcome Pack"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-22"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Reading_Your_Statement"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Reading_Your_Statement.jpg"
                    alt="Cover of Reading Your Daily Statement"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Reading Your Daily Statement</h3>
                      <p className="doc-tag">
                        6 · Every line of the 12:00 UTC statement
                      </p>
                    </div>
                    <p className="plain">
                      The daily statement, line by line, so you can explain
                      every number.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Members and distributors &nbsp;·&nbsp;{" "}
                      <b>When:</b> The first time you open your statement.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 3 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        The daily settlement statement line by line: the day's
                        result, the rebuy modules, the switch, the app wallet,
                        commissions by level and the differential, and what to
                        check.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Reading_Your_Statement.pdf"
                      data-name="Delta_One_Reading_Your_Statement.pdf"
                      data-title="Reading Your Daily Statement"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-23"
                      data-file="docs/Delta_One_Reading_Your_Statement.pdf"
                      data-name="Delta_One_Reading_Your_Statement.pdf"
                      aria-label="Download Reading Your Daily Statement"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Reading_Your_Statement"
                      data-title="Reading Your Daily Statement"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:21</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Reading_Your_Statement.pdf"
                      data-name="Delta_One_Reading_Your_Statement.pdf"
                      data-title="Reading Your Daily Statement"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-23"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Leaders_One_Pager"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Leaders_One_Pager.jpg"
                    alt="Cover of The Leader&#x27;s One-Pager"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>The Leader's One-Pager</h3>
                      <p className="doc-tag">7 · Open new lines, stay ahead</p>
                    </div>
                    <p className="plain">
                      Three habits of a leader: open new lines, stay ahead, keep
                      your leaders active.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Leaders &nbsp;·&nbsp; <b>When:</b> When your
                      first distributor reaches a rank.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 3 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        The three habits of a leader in this plan: open new
                        lines, stay ahead of the people below you, and keep your
                        leaders active, each with the arithmetic behind it.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Leaders_One_Pager.pdf"
                      data-name="Delta_One_Leaders_One_Pager.pdf"
                      data-title="The Leader&#x27;s One-Pager"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-24"
                      data-file="docs/Delta_One_Leaders_One_Pager.pdf"
                      data-name="Delta_One_Leaders_One_Pager.pdf"
                      aria-label="Download The Leader&#x27;s One-Pager"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Leaders_One_Pager"
                      data-title="The Leader&#x27;s One-Pager"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:17</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Leaders_One_Pager.pdf"
                      data-name="Delta_One_Leaders_One_Pager.pdf"
                      data-title="The Leader&#x27;s One-Pager"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-24"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article className="doc row" id="doc-Delta_One_About_Delta_One">
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_About_Delta_One.jpg"
                    alt="Cover of About Delta One"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>About Delta One</h3>
                      <p className="doc-tag">9 · The company</p>
                    </div>
                    <p className="plain">
                      Who Delta One is: the engine, the founders, custody,
                      settlement at 12:00 UTC.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Prospects &nbsp;·&nbsp; <b>When:</b> When
                      someone asks 'who are these people?'
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 3 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        The engine, the founders, custody, settlement at 12:00
                        UTC and how the company is paid: one document a prospect
                        can read to know who they are dealing with.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_About_Delta_One.pdf"
                      data-name="Delta_One_About_Delta_One.pdf"
                      data-title="About Delta One"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-25"
                      data-file="docs/Delta_One_About_Delta_One.pdf"
                      data-name="Delta_One_About_Delta_One.pdf"
                      aria-label="Download About Delta One"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_About_Delta_One"
                      data-title="About Delta One"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:21</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_About_Delta_One.pdf"
                      data-name="Delta_One_About_Delta_One.pdf"
                      data-title="About Delta One"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-25"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Distributor_Policies_and_Procedures"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Distributor_Policies_and_Procedures.jpg"
                    alt="Cover of Distributor Policies &amp; Procedures"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Distributor Policies & Procedures</h3>
                      <p className="doc-tag">Rules · draft for legal review</p>
                    </div>
                    <p className="plain">
                      The rules every distributor agrees to: claims,
                      advertising, members, money, complaints, leaving. Draft
                      for legal.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> Before
                      you sign. Then when you are unsure if something is
                      allowed.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 6 pages, 0.6 MB</summary>
                      <p className="doc-desc">
                        Claims and advertising, members and their money,
                        complaints, inactivity and leaving: the rules every
                        distributor agrees to. A draft for counsel; not in force
                        until approved.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Distributor_Policies_and_Procedures.pdf"
                      data-name="Delta_One_Distributor_Policies_and_Procedures.pdf"
                      data-title="Distributor Policies &amp; Procedures"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-26"
                      data-file="docs/Delta_One_Distributor_Policies_and_Procedures.pdf"
                      data-name="Delta_One_Distributor_Policies_and_Procedures.pdf"
                      aria-label="Download Distributor Policies &amp; Procedures"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Distributor_Policies_and_Procedures"
                      data-title="Distributor Policies &amp; Procedures"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:17</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Distributor_Policies_and_Procedures.pdf"
                      data-name="Delta_One_Distributor_Policies_and_Procedures.pdf"
                      data-title="Distributor Policies &amp; Procedures"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-26"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Distributor_Agreement"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Distributor_Agreement.jpg"
                    alt="Cover of Distributor Agreement"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Distributor Agreement</h3>
                      <p className="doc-tag">Rules · draft for legal review</p>
                    </div>
                    <p className="plain">
                      The agreement between you and Delta One. Draft for legal.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Distributors &nbsp;·&nbsp; <b>When:</b> Before
                      you sign.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 4 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        Appointment, independent status, commission,
                        obligations, term and ending. A draft for counsel with
                        the issuing entity and governing law to be filled in.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Distributor_Agreement.pdf"
                      data-name="Delta_One_Distributor_Agreement.pdf"
                      data-title="Distributor Agreement"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-27"
                      data-file="docs/Delta_One_Distributor_Agreement.pdf"
                      data-name="Delta_One_Distributor_Agreement.pdf"
                      aria-label="Download Distributor Agreement"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Distributor_Agreement"
                      data-title="Distributor Agreement"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:17</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Distributor_Agreement.pdf"
                      data-name="Delta_One_Distributor_Agreement.pdf"
                      data-title="Distributor Agreement"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-27"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Privacy_and_KYC_Note"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Privacy_and_KYC_Note.jpg"
                    alt="Cover of Privacy &amp; KYC Note"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Privacy & KYC Note</h3>
                      <p className="doc-tag">Rules · draft for legal review</p>
                    </div>
                    <p className="plain">
                      What is collected for the identity check, why, and who
                      sees it.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Members &nbsp;·&nbsp; <b>When:</b> When a
                      member asks why they need to send an ID.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 3 pages, 0.5 MB</summary>
                      <p className="doc-desc">
                        What is collected for the identity check and the
                        account, why, who sees it and how long it is kept, in
                        plain words.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Privacy_and_KYC_Note.pdf"
                      data-name="Delta_One_Privacy_and_KYC_Note.pdf"
                      data-title="Privacy &amp; KYC Note"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-28"
                      data-file="docs/Delta_One_Privacy_and_KYC_Note.pdf"
                      data-name="Delta_One_Privacy_and_KYC_Note.pdf"
                      aria-label="Download Privacy &amp; KYC Note"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Privacy_and_KYC_Note"
                      data-title="Privacy &amp; KYC Note"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:13</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Privacy_and_KYC_Note.pdf"
                      data-name="Delta_One_Privacy_and_KYC_Note.pdf"
                      data-title="Privacy &amp; KYC Note"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-28"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
              </div>
            </details>
            <details className="shelf group" id="team">
              <summary>
                <span className="sh-t">
                  <h2>The founders</h2>
                  <span className="cnt">3 documents</span>
                </span>
                <span className="sh-s">
                  James Pack and Ricky Lundell: profiles you can share, and the
                  story of the partnership.
                </span>
              </summary>
              <div className="rows">
                <article
                  className="doc row"
                  id="doc-Delta_One_Founder_Profile_James_Pack"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Founder_Profile_James_Pack.jpg"
                    alt="Cover of James Pack"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>James Pack</h3>
                      <p className="doc-tag">Founder · profile</p>
                    </div>
                    <p className="plain">Who James Pack is.</p>
                    <p className="plain-who">
                      <b>For:</b> Everyone &nbsp;·&nbsp; <b>When:</b> When
                      someone asks about the founders.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 5 pages, 0.8 MB</summary>
                      <p className="doc-desc">
                        Forty years of entrepreneurial leadership and the
                        co-founding of ASEA: career, accolades, his words, and
                        the profile card to share.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Founder_Profile_James_Pack.pdf"
                      data-name="Delta_One_Founder_Profile_James_Pack.pdf"
                      data-title="James Pack"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-29"
                      data-file="docs/Delta_One_Founder_Profile_James_Pack.pdf"
                      data-name="Delta_One_Founder_Profile_James_Pack.pdf"
                      aria-label="Download James Pack"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Founder_Profile_James_Pack"
                      data-title="James Pack"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:16</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Founder_Profile_James_Pack.pdf"
                      data-name="Delta_One_Founder_Profile_James_Pack.pdf"
                      data-title="James Pack"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-29"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Founder_Profile_Ricky_Lundell"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Founder_Profile_Ricky_Lundell.jpg"
                    alt="Cover of Ricky Lundell"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>Ricky Lundell</h3>
                      <p className="doc-tag">President · profile</p>
                    </div>
                    <p className="plain">Who Ricky Lundell is.</p>
                    <p className="plain-who">
                      <b>For:</b> Everyone &nbsp;·&nbsp; <b>When:</b> When
                      someone asks about the founders.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 5 pages, 0.9 MB</summary>
                      <p className="doc-desc">
                        Multiple-time world champion, head coach to UFC world
                        champions, trainer of 2,000+ special operations
                        personnel: career, accolades, his words, and the profile
                        card.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Founder_Profile_Ricky_Lundell.pdf"
                      data-name="Delta_One_Founder_Profile_Ricky_Lundell.pdf"
                      data-title="Ricky Lundell"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-30"
                      data-file="docs/Delta_One_Founder_Profile_Ricky_Lundell.pdf"
                      data-name="Delta_One_Founder_Profile_Ricky_Lundell.pdf"
                      aria-label="Download Ricky Lundell"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Founder_Profile_Ricky_Lundell"
                      data-title="Ricky Lundell"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:17</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Founder_Profile_Ricky_Lundell.pdf"
                      data-name="Delta_One_Founder_Profile_Ricky_Lundell.pdf"
                      data-title="Ricky Lundell"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-30"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
                <article
                  className="doc row"
                  id="doc-Delta_One_Founders_The_Partnership"
                >
                  <img
                    className="row-cover"
                    src="/img/cover_Delta_One_Founders_The_Partnership.jpg"
                    alt="Cover of The Partnership"
                    loading="lazy"
                    width="510"
                    height="660"
                  />
                  <div className="row-body">
                    <div className="row-title">
                      <h3>The Partnership</h3>
                      <p className="doc-tag">Two founders, one standard</p>
                    </div>
                    <p className="plain">
                      How the two founders work together and what standard they
                      hold.
                    </p>
                    <p className="plain-who">
                      <b>For:</b> Everyone &nbsp;·&nbsp; <b>When:</b> When
                      someone asks about the founders.
                    </p>
                    <details className="more">
                      <summary>More detail · PDF, 4 pages, 0.4 MB</summary>
                      <p className="doc-desc">
                        What each founder brings, how Delta One is governed, and
                        why it matters to a distributor.
                      </p>
                    </details>
                  </div>
                  <div className="row-act actions">
                    <button
                      type="button"
                      className="btn primary sm view"
                      data-file="docs/Delta_One_Founders_The_Partnership.pdf"
                      data-name="Delta_One_Founders_The_Partnership.pdf"
                      data-title="The Partnership"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm dl"
                      id="dl-31"
                      data-file="docs/Delta_One_Founders_The_Partnership.pdf"
                      data-name="Delta_One_Founders_The_Partnership.pdf"
                      aria-label="Download The Partnership"
                      title="Download"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn listen sm ex"
                      data-id="Delta_One_Founders_The_Partnership"
                      data-title="The Partnership"
                    >
                      <span className="ic">▶</span> Explain it{" "}
                      <span className="tm">0:13</span>
                    </button>
                    <button
                      type="button"
                      className="btn listen sm rd"
                      data-file="docs/Delta_One_Founders_The_Partnership.pdf"
                      data-name="Delta_One_Founders_The_Partnership.pdf"
                      data-title="The Partnership"
                      data-lang="en"
                    >
                      <span className="ic">▶</span> Read it to me
                    </button>
                  </div>
                  <p
                    className="status"
                    id="st-31"
                    role="status"
                    aria-live="polite"
                  ></p>
                </article>
              </div>
            </details>
            <details className="shelf group" id="courses">
              <summary>
                <span className="sh-t">
                  <h2>The Skill Shop · learn from the greats</h2>
                  <span className="cnt">10 courses · VIP</span>
                </span>
                <span className="sh-s">
                  Selling, networking, speaking and leading, taught by Aria in
                  the tradition of the great teachers. Six lessons each, an
                  exercise with every lesson.
                </span>
              </summary>
              <div className="vip-lock">
                <div className="vip-lock-card">
                  <p className="doc-tag">Delta One VIP · 99 USDT a month</p>
                  <h3>
                    The Skill Shop: The Honest Close, People First, Speak So
                    They Listen, The Networker's Garden and six more courses
                  </h3>
                  <p>
                    Part of Delta One VIP, with your personal assistant, a live
                    agent on Zoom 24/7, a concierge, your dashboard, your team's
                    view and your contacts. Pay in USDT like a module, or from
                    your rewards in the back office.
                  </p>
                  <a
                    className="btn gold"
                    href="#upgrade"
                    data-upgrade="lib-courses"
                  >
                    Go VIP · 99 USDT/month
                  </a>
                </div>
              </div>
              <div className="docs courses-grid" id="courses-grid"></div>
              <div className="course-panel" id="course-panel" hidden></div>
              <p className="doc-specs" style={{ marginTop: "14px" }}>
                Original courses written for Delta One VIP, taught by Aria,
                drawing on the published ideas of the teachers named. Nothing is
                quoted; nothing is affiliated with, licensed by or endorsed by
                them or their companies. Every figure about the plan is an
                illustration at the engine's average daily result; results and
                rewards are not guaranteed, and most members earn no commission
                at all.
              </p>
            </details>
          </div>

          <div className="block" id="tools">
            <div className="block-head">
              <h3>
                <span className="bt">Do · plan your first ninety days</span>
              </h3>
              <p>
                Your first three days, first week, first month and day 90 as
                dated tasks, with rank goals and a team calculator. Then work
                through the Getting Started Checklist and the Language Card from
                your kit with your sponsor.
              </p>
            </div>
            <div className="strip">
              <a
                className="strip-card"
                href="/tools/faststart"
                target="_blank"
                rel="noopener"
                data-tool="planner"
              >
                <span className="ic">🗓️</span>
                <span>
                  <b>Fast Start 90-day planner ↗</b>
                  <span className="tl">
                    Your goals and ticks go into your training record.
                  </span>
                </span>
              </a>
              <a
                className="strip-card"
                href="#doc-Delta_One_Getting_Started_Checklist"
                data-go="#doc-Delta_One_Getting_Started_Checklist"
              >
                <span className="ic">☑️</span>
                <span>
                  <b>Getting Started Checklist</b>
                  <span className="tl">
                    Account, wallet, your own module — in your kit, step 3.
                  </span>
                </span>
              </a>
              <a
                className="strip-card"
                href="#doc-Delta_One_Language_Card"
                data-go="#doc-Delta_One_Language_Card"
              >
                <span className="ic">🗣️</span>
                <span>
                  <b>The Language Card</b>
                  <span className="tl">
                    Purchase, not investment. Result, not return. Rebuy, not
                    reinvest.
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Checkpoint Zone */}
      <CheckpointSection />

      {/*  Delta One VIP configuration (one place; see README.md):
     zoom / chat  — the live Zoom room and the live support chat (VIP members only)
     plan         — "free" (Delta One Training) or "vip" (Delta One VIP, 99 USDT a month): set by your server when the page is served
     demo         — true shows a Free | VIP switch in the top bar for testing; set false in production
     pro          — the member's dashboard (Delta One VIP Pro); upgrade — your checkout page for the VIP subscription (USDT)
     track        — { endpoint, memberId, token }: where the training record is sent (POST, JSON); null keeps it on the device only
     presence     — a URL (GET → { online: true|false, agents: n, zoom: true|false }) or a function: is a live person available? Polled every 30 s.
                    When nobody is free, Aria (the AI agent) answers at once; the Zoom and chat boxes say so and open Aria instead.
     handoff(req) — optional: called when a member presses "Talk to a person" / "Ask for a person" with { q, transcript, human }; else chat opens
     ask(input, opts) — optional: your own AI endpoint for Aria (a text prompt; opts.history has the turns; opts.onText streams; returns { text })  */}

      <section className="support" id="support">
        <div className="wrap">
          <p className="kicker" style={{ color: "var(--blue-ink)" }}>
            Need help right now?
          </p>
          <h2 className="section-title">Three ways to get an answer.</h2>
          <div className="sup-grid">
            {/* <a
              className="sup-box zoom"
              id="zoom-box"
              href="https://deltavip24.com"
              target="_blank"
              rel="noopener"
            >
              <span className="live">
                <span className="dot"></span>
                <span className="lt">LIVE · 24/7</span>
              </span>
              <svg className="cam" viewBox="0 0 96 64" aria-hidden="true">
                <rect x="4" y="10" width="60" height="44" rx="12" fill="#fff" />
                <path d="M66 26 90 14v36L66 38z" fill="#fff" />
                <circle cx="34" cy="32" r="11" fill="#1F6FEB" />
                <circle cx="34" cy="32" r="5" fill="#fff" />
              </svg>
              <span className="sup-t">Speak to an agent now on Zoom</span>
              <span className="sup-s">
                An agent is live around the clock. One click opens the room — no
                account needed.
              </span>
              <span className="sup-s zoom-off" id="zoom-off" hidden>
                No agent is on Zoom at this moment — Aria answers now.
              </span>
              <span className="btn gold big">Join the live Zoom ↗</span>
              <span className="sup-url">deltavip24.com</span>
            </a> */}
            <div className="sup-box ask">
              <span className="sup-t">
                Do you have any questions about Delta One?
              </span>
              <span className="sup-s">
                Ask in your own words. The answer comes from the plan's
                published rules, in plain language.
              </span>
              <form className="ask-form" id="ask-form">
                <label className="sr" htmlFor="ask-q">
                  Your question
                </label>
                <input
                  id="ask-q"
                  type="text"
                  maxLength="300"
                  placeholder="For example: what happens on day 11?"
                  autoComplete="off"
                />
                <button type="submit" className="btn primary" id="ask-btn">
                  Ask
                </button>
              </form>
              <div className="ask-out" id="ask-out" hidden></div>
              <p className="ask-note" id="ask-note">
                Answers are illustrations at the engine's average daily result;
                nothing here is a promise. For anything personal, ask your
                sponsor or an agent.
              </p>
            </div>
            {/* <a
              className="sup-box chat"
              id="chat-box"
              href="https://deltavip24.com"
              target="_blank"
              rel="noopener"
            >
              <svg className="bubble" viewBox="0 0 64 64" aria-hidden="true">
                <path
                  d="M12 10h40a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H30l-14 10V48h-4a8 8 0 0 1-8-8V18a8 8 0 0 1 8-8z"
                  fill="#fff"
                />
                <circle cx="22" cy="29" r="3.5" fill="#0FB5A4" />
                <circle cx="32" cy="29" r="3.5" fill="#0FB5A4" />
                <circle cx="42" cy="29" r="3.5" fill="#0FB5A4" />
              </svg>
              <span className="sup-t">
                Live chat with Delta One VIP support
              </span>
              <span className="sup-s">
                Type to a real person. Open it in a new tab and keep learning
                here.
              </span>
              <span className="sup-s chat-off" id="chat-off" hidden>
                No person is free at this moment — Aria answers now.
              </span>
              <span className="btn primary">Open the live chat ↗</span>
            </a> */}
            <div className="sup-box upgrade free-el">
              <span className="live">
                <span className="dot"></span>
                <span className="lt">LIVE · 24/7 · VIP</span>
              </span>
              <span className="sup-t">
                A live agent on Zoom and a concierge on chat, at any hour
              </span>
              <span className="sup-s">
                Delta One VIP members speak to a real person around the clock,
                and Aria, their personal assistant, knows exactly where they are
                on the page. 99 USDT a month, paid in USDT like a module.
              </span>
              <a
                className="btn gold big"
                href="#upgrade"
                data-upgrade="support"
              >
                Go VIP · 99 USDT/month
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* PDF Modal Viewer */}
      <PdfViewerModal
        isOpen={pdfModal.isOpen}
        file={pdfModal.file}
        name={pdfModal.name}
        title={pdfModal.title}
        onClose={() => setPdfModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Aria Walkthrough Drawer */}
      <AriaWalkthrough
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
      />

      {/* Ask Aria Chat Drawer */}
      <AskAriaDrawer
        isOpen={isAriaChatOpen}
        onClose={() => setIsAriaChatOpen(false)}
      />

      {/* VIP Upsell Modal */}
      {isUpsellOpen && (
        <div
          className="upsell"
          id="vip-upsell"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upsell-t"
        >
          <div className="upsell-in">
            <button
              type="button"
              className="ask-x upsell-x"
              id="upsell-x"
              aria-label="Close"
              onClick={() => setIsUpsellOpen(false)}
            >
              ✕
            </button>
            <p className="doc-tag">Delta One VIP · 99 USDT a month</p>
            <h2 id="upsell-t">
              Every document stays free. VIP adds the people and the tools to
              build a team.
            </h2>
            <ul className="upsell-list">
              <li>
                <b>Your personal assistant.</b> Aria knows where you are on the
                page, answers in your language and drafts your follow-ups.
              </li>
              <li>
                <b>A live agent on Zoom, 24/7.</b> A real person at any hour,
                one click away.
              </li>
              <li>
                <b>A concierge on chat.</b> Type to a person who sorts things
                out for you.
              </li>
              <li>
                <b>Your dashboard, and your team's.</b> Your own progress, and
                exactly where each person you sponsored is: which film, which
                page, which checkpoint, which climbing style.
              </li>
              <li>
                <b>Your contacts and your messages.</b> A contact list,
                follow-up reminders and one-tap messages on SMS, WhatsApp,
                Telegram, LINE, Viber, Messenger, Zalo, KakaoTalk and WeChat.
              </li>
              <li>
                <b>Your own landing page</b> with your referral link and a QR
                code.
              </li>
              <li>
                <b>The full climbing-style profile</b> — and the test to share
                with the people you talk to.
              </li>
              <li>
                <b>The Skill Shop.</b> Ten courses taught by Aria in the
                tradition of the great teachers of selling, speaking and
                leading.
              </li>
            </ul>
            <div className="actions">
              <a
                className="btn gold big !px-[24px] !py-0 !flex !items-center"
                id="upsell-go"
                href="#upgrade"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "Coming Soon !",
                  );
                  setIsUpsellOpen(false);
                }}
              >
                Go VIP · 99 USDT/month
              </a>
              <button
                type="button"
                className="btn ghost"
                id="upsell-later"
                onClick={() => setIsUpsellOpen(false)}
              >
                Not now
              </button>
              <span className="status" id="upsell-note"></span>
            </div>
            <p className="ask-note">
              Paid monthly in USDT, the same way you purchase a module — or from
              your rewards in the back office. Your training record stays with
              you. Draft for legal and compliance review.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
