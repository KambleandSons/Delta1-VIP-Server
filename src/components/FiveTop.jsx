const FILMS = {
  seed: { src: '/media/seed_farm_cartoon.mp4', poster: '/img/poster_seed_farm.jpg' },
  believer_studio: { src: '/media/believer_toonbee.mp4', poster: '/img/poster_believer_toonbee.jpg' },
  momentum_studio: { src: '/media/momentum_toonbee.mp4', poster: '/img/poster_momentum_toonbee.jpg' },
  pres: { src: '/media/presentation_narrated.mp4', poster: '/img/poster_presentation.jpg' },
  founder_studio: { src: '/media/founder_toonbee.mp4', poster: '/img/poster_founder_toonbee.jpg' },
};

export default function FiveTop() {
  function playFilm(key) {
    const f = FILMS[key];
    if (!f) return;
    const v = document.createElement('video');
    v.src = f.src;
    v.controls = true;
    v.autoplay = true;
    v.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;background:#000;z-index:999;';
    document.body.appendChild(v);
    v.addEventListener('ended', () => v.remove());
    v.addEventListener('click', (e) => {
      if (e.target === v) {
        // click outside or dismiss
      }
    });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        v.remove();
        document.removeEventListener('keydown', onKey);
      }
    };
    document.addEventListener('keydown', onKey);
  }

  return (
    <section className="five-top" id="five-top" aria-label="Teach me like I'm five">
      <div className="wrap">
        <p className="kicker">Teach me like I'm five · the films</p>
        <h2>Every film, simplest first. Tap one and it plays.</h2>
        <p className="section-lede">
          The plan the way you would tell it to a child, then the whole presentation, then the founder seats. Start at Level 1. Every film and every document here is free — the 99 USDT a month is for the back office: your assistant, the live agent, your dashboard and your team's tools.
        </p>
        <div className="level">
          <p className="level-k">Level 1 · Start here, farm level</p>
          <div className="tiles5">
            <button type="button" className="tile5" data-play="seed" aria-label="Play The Seed Farm" onClick={() => playFilm('seed')}>
              <img src="/img/poster_seed_farm.jpg" alt="" loading="lazy" width="640" height="360" />
              <span className="tc"><b>The Seed Farm</b><span className="tl">2:52</span></span>
            </button>
            <button type="button" className="tile5" data-play="believer_studio" aria-label="Play I'm a Believer" onClick={() => playFilm('believer_studio')}>
              <img src="/img/poster_believer_toonbee.jpg" alt="" loading="lazy" width="640" height="360" />
              <span className="tc"><b>I'm a Believer</b><span className="tl">6:03</span></span>
            </button>
            <button type="button" className="tile5" data-play="momentum_studio" aria-label="Play The Momentum Plan, the film" onClick={() => playFilm('momentum_studio')}>
              <img src="/img/poster_momentum_toonbee.jpg" alt="" loading="lazy" width="640" height="360" />
              <span className="tc"><b>The Momentum Plan, the film</b><span className="tl">4:53</span></span>
            </button>
          </div>
        </div>
        <div className="level">
          <p className="level-k">Level 2 · The whole presentation</p>
          <div className="tiles5">
            <button type="button" className="tile5" data-play="pres" aria-label="Play The Momentum Plan presentation" onClick={() => playFilm('pres')}>
              <img src="/img/poster_presentation.jpg" alt="" loading="lazy" width="640" height="360" />
              <span className="tc"><b>The Momentum Plan presentation</b><span className="tl">10:18</span></span>
            </button>
          </div>
        </div>
        <div className="level">
          <p className="level-k">Level 3 · Founder seats</p>
          <div className="tiles5">
            <button type="button" className="tile5" data-play="founder_studio" aria-label="Play Founder Seats, the film" onClick={() => playFilm('founder_studio')}>
              <img src="/img/poster_founder_toonbee.jpg" alt="" loading="lazy" width="640" height="360" />
              <span className="tc"><b>Founder Seats, the film</b><span className="tl">4:01</span></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
