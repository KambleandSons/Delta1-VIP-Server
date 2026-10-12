import { useState } from 'react';
import { useApp } from '../context/AppContext';

const FILMS_MAP = {
  pres: { src: '/media/presentation_narrated.mp4', poster: '/img/poster_presentation.jpg' },
  momentum_studio: { src: '/media/momentum_toonbee.mp4', poster: '/img/poster_momentum_toonbee.jpg' },
  believer_studio: { src: '/media/believer_toonbee.mp4', poster: '/img/poster_believer_toonbee.jpg' },
  founder_studio: { src: '/media/founder_toonbee.mp4', poster: '/img/poster_founder_toonbee.jpg' },
  seed: { src: '/media/seed_farm_cartoon.mp4', poster: '/img/poster_seed_farm.jpg' },
};

export default function Step1() {
  const { markStepDone } = useApp();
  const [activePane, setActivePane] = useState('audio');

  function handleDone() {
    markStepDone(1);
    document.getElementById('step2')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="step s1" id="step1">
      <div className="wrap">
        <div className="step-head">
          <div className="step-num">1</div>
          <div>
            <p className="kicker">Step 1 of 3 · Watch</p>
            <h2 className="section-title">See the whole plan in one sitting.</h2>
            <p className="section-lede">
              Three doors, one plan. Listen to Aria read it, walk through it as a film series,
              or have it told at farm level. Pick the door that fits you today; the other two will still
              be here tomorrow.
            </p>
            <div className="goals">
              <p className="goals-t">After this step you can…</p>
              <ul>
                <li>Say in one sentence what a module is: a software purchase that can give back up to 2× its price.</li>
                <li>Say how introducing a friend pays you: 2% of what their contract earns each day, level by level.</li>
                <li>Name the seven mountains, from Fuji to Everest.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="doors" role="tablist" aria-label="How do you want to learn?">
          {[
            { key: 'audio', icon: '🎧', label: 'Watch me', sub: 'Aria reads the whole plan · 10 min' },
            { key: 'walk', icon: '🎬', label: 'Walk me through', sub: 'The plan as a film series · play them in a row' },
            { key: 'five', icon: '🧒', label: "Teach me like I'm five", sub: 'Farm level · short and simple' },
          ].map(d => (
            <button
              key={d.key}
              type="button"
              className={`door${activePane === d.key ? ' is-on' : ''}`}
              role="tab"
              data-door={d.key}
              aria-selected={activePane === d.key}
              onClick={() => setActivePane(d.key)}
            >
              <span className="ic">{d.icon}</span>
              <span><b>{d.label}</b><span className="tl">{d.sub}</span></span>
            </button>
          ))}
        </div>

        {/* Audio pane */}
        <div className="door-pane" data-pane="audio" hidden={activePane !== 'audio' || undefined}>
          <p className="section-lede">
            Sit back and listen. Aria reads every slide of the presentation, every rule and every number.
            Ten minutes, one sitting.
          </p>
          <div className="films n1">
            <article className="film main" data-film="pres">
              <video
                className="player"
                controls
                preload="metadata"
                playsInline
                poster="/img/poster_presentation.jpg"
                width="1920"
                height="1080"
              >
                <source src="/media/presentation_narrated.mp4" type="video/mp4" />
              </video>
              <div className="film-cap">
                <h3>The Momentum Plan presentation</h3>
                <p>Seventeen slides, every rule and every number, narrated by Aria. The same slides are in the library as a PDF with her audio attached.</p>
                <span className="film-len">10:18</span>
              </div>
            </article>
          </div>
        </div>

        {/* Walk pane */}
        <div className="door-pane" data-pane="walk" hidden={activePane !== 'walk' || undefined}>
          <p className="section-lede">
            The same plan as animated films, one after the other: the presentation built from blocks,
            then the Momentum Plan, the Believer and the Founder Seats. Press Play the series and they run back to back.
          </p>
          <p className="series">
            <button type="button" className="btn primary play-series">▶ Play the series</button>
            <span>3 films, back to back. Each one starts when the one before it ends.</span>
          </p>
          <div className="films n3">
            <article className="film main" data-film="momentum_studio">
              <video className="player" controls preload="metadata" playsInline poster="/img/poster_momentum_toonbee.jpg" width="1920" height="1080">
                <source src="/media/momentum_toonbee.mp4" type="video/mp4" />
              </video>
              <div className="film-cap">
                <h3>The Momentum Plan, the film</h3>
                <p>Maya, Sam and Bolt the engine, in a 3D studio-animation style: the whole plan in five minutes.</p>
                <span className="film-len">4:53</span>
              </div>
            </article>
            <article className="film" data-film="believer_studio">
              <video className="player" controls preload="metadata" playsInline poster="/img/poster_believer_toonbee.jpg" width="1920" height="1080">
                <source src="/media/believer_toonbee.mp4" type="video/mp4" />
              </video>
              <div className="film-cap">
                <h3>I'm a Believer</h3>
                <p>What a Believer is, told gently, in a 3D studio-animation style: Maya, Bolt the engine, the golden box, the switch, and waiting 440 days.</p>
                <span className="film-len">6:03</span>
              </div>
            </article>
            <article className="film" data-film="founder_studio">
              <video className="player" controls preload="metadata" playsInline poster="/img/poster_founder_toonbee.jpg" width="1920" height="1080">
                <source src="/media/founder_toonbee.mp4" type="video/mp4" />
              </video>
              <div className="film-cap">
                <h3>Founder Seats, the film</h3>
                <p>Only if you will talk about founder seats: Nora and Bolt, in a 3D studio-animation style.</p>
                <span className="film-len">4:01</span>
              </div>
            </article>
          </div>
        </div>

        {/* Five pane */}
        <div className="door-pane" data-pane="five" hidden={activePane !== 'five' || undefined}>
          <p className="section-lede">
            The plan the way you would tell it to a child: a farm, a tractor, seed boxes and apples.
            Then the Believer story. If you can retell these, you understand the plan.
          </p>
          <p className="series">
            <button type="button" className="btn primary play-series">▶ Play the series</button>
            <span>2 films, back to back. Each one starts when the one before it ends.</span>
          </p>
          <div className="films n2">
            <article className="film main" data-film="seed">
              <video className="player" controls preload="metadata" playsInline poster="/img/poster_seed_farm.jpg" width="1920" height="1080">
                <source src="/media/seed_farm_cartoon.mp4" type="video/mp4" />
              </video>
              <div className="film-cap">
                <h3>The Seed Farm</h3>
                <p>For little kids and for anyone: the plan at farm level. Tracto the tractor, Maya and Sam.</p>
                <span className="film-len">2:52</span>
              </div>
            </article>
            <article className="film" data-film="believer_studio">
              <video className="player" controls preload="metadata" playsInline poster="/img/poster_believer_toonbee.jpg" width="1920" height="1080">
                <source src="/media/believer_toonbee.mp4" type="video/mp4" />
              </video>
              <div className="film-cap">
                <h3>I'm a Believer</h3>
                <p>What a Believer is, told gently, in a 3D studio-animation style: Maya, Bolt the engine, the golden box, the switch, and waiting 440 days.</p>
                <span className="film-len">6:03</span>
              </div>
            </article>
          </div>
        </div>

        <div className="step-foot">
          <p>Watched one film? Well done — that is Step 1. The next door opens onto three documents.</p>
          <button type="button" className="btn next" data-done="1" onClick={handleDone}>
            I watched it — go to Step 2 ▸
          </button>
        </div>
      </div>
    </section>
  );
}

