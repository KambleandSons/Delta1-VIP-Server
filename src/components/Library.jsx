import { useApp } from '../context/AppContext';
import {
  NEED_TABLE,
  PLAN_DOCS,
  DIST_DOCS,
  CUSTOMER_DOCS,
  KIT_DOCS,
  FOUNDER_DOCS,
  LEGAL_DOCS,
} from '../data/libraryData';
import SkillShop from './SkillShop';

function LibraryDocCard({ doc, onView }) {
  function handleDownload(file, name) {
    const a = document.createElement('a');
    a.href = '/' + file;
    a.download = name;
    a.click();
  }

  return (
    <article className="doc" id={doc.id}>
      <img className="doc-cover" src={'/' + doc.cover} alt={doc.coverAlt} loading="lazy" width="510" height="660" />
      <div className="doc-body">
        <p className="doc-tag">{doc.tag}</p>
        <h3>{doc.title}</h3>
        <p className="plain">{doc.plain}</p>
        <p className="plain-who"><b>For:</b> {doc.who} &nbsp;·&nbsp; <b>When:</b> {doc.when}</p>
        {doc.moreDetail && (
          <details className="more">
            <summary>More detail</summary>
            <p className="doc-desc">{doc.moreDetail}</p>
          </details>
        )}
        <p className="doc-specs">{doc.specs}</p>
        <div className="actions">
          <button type="button" className="btn primary view" onClick={() => onView(doc.file, doc.name, doc.title)}>
            Open
          </button>
          <button type="button" className="btn ghost dl" id={doc.dlId} onClick={() => handleDownload(doc.file, doc.name)}>
            Download
          </button>
          {doc.extraDownloads?.map(ed => (
            <button key={ed.file} type="button" className="btn ghost dl" onClick={() => handleDownload(ed.file, ed.name)}>
              {ed.label}
            </button>
          ))}
        </div>
        <div className="actions listen-row">
          {!doc.noExplain && doc.explainId && (
            <button type="button" className="btn listen ex" data-id={doc.explainId} data-title={doc.explainTitle}>
              <span className="ic">▶</span> Explain it <span className="tm">{doc.explainDur}</span>
            </button>
          )}
          {!doc.noReadAloud && (
            <button
              type="button"
              className="btn listen rd"
              data-file={'/' + doc.file}
              data-name={doc.name}
              data-title={doc.title}
              data-lang="en"
              data-aria={doc.hasAria ? '1' : undefined}
            >
              <span className="ic">▶</span>{' '}
              {doc.hasAria ? (
                <><span className="l-aria">Aria reads it to me</span><span className="l-plain">Read it to me</span></>
              ) : (
                'Read it to me'
              )}
            </button>
          )}
        </div>
        <p className="status" id={doc.stId} role="status" aria-live="polite"></p>
      </div>
    </article>
  );
}

export default function Library() {
  const { openViewer } = useApp();

  return (
    <div className="library" id="library">
      <div className="wrap">
        <p className="kicker" style={{ color: 'var(--blue-ink)' }}>The library · go as deep as you like</p>
        <h2 className="section-title">Every document, with Aria's explanation and a read-aloud.</h2>
        <p className="section-lede">
          Each card says in one line what the document is, who it is for and when to open it. <b>Explain it</b> is Aria's one-minute explanation; <b>Aria reads it to me</b> is her reading of what matters, page by page; <b>Read it to me</b> reads any other document aloud, word for word.
        </p>

        {/* Section 1: Which document do I need? */}
        <section className="group" id="need">
          <div className="group-head">
            <div>
              <h2>Which document do I need?</h2>
              <p>Find what you want to do on the left. Open the one document on the right.</p>
            </div>
          </div>
          <div style={{ overflow: 'auto' }}>
            <table className="langs need-table">
              <thead>
                <tr>
                  <th>I want to…</th>
                  <th>Open this</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {NEED_TABLE.map((item, idx) => (
                  <tr key={idx}>
                    <td>I want to <b>{item.want}</b></td>
                    <td>{item.doc}</td>
                    <td>
                      {item.file ? (
                        <button
                          type="button"
                          className="btn ghost view"
                          onClick={() => openViewer(item.file, item.name, item.title)}
                        >
                          Open
                        </button>
                      ) : (
                        <a className="btn ghost" href={item.href} target="_blank" rel="noopener">
                          {item.title} ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Skill Shop */}
        <SkillShop />

        {/* Section 3: The plan, in full */}
        <section className="group" id="plan">
          <div className="group-head">
            <img src="/img/k2.jpg" alt="" width="180" height="186" />
            <div>
              <h2>The plan, in full</h2>
              <p>The presentation, the plan on one page, and the three documents that hold every rule.</p>
            </div>
          </div>
          <div className="docs">
            {PLAN_DOCS.map(doc => (
              <LibraryDocCard key={doc.id} doc={doc} onView={openViewer} />
            ))}
          </div>
        </section>

        {/* Section 4: The plan for distributors */}
        <section className="group" id="dist">
          <div className="group-head">
            <img src="/img/rainier.jpg" alt="" width="180" height="186" />
            <div>
              <h2>The plan for distributors</h2>
              <p>The full guide, the one-page cheat sheet, the napkin presentation, the five-minute conversation card and the Believer key facts.</p>
            </div>
          </div>
          <div className="docs">
            {DIST_DOCS.map(doc => (
              <LibraryDocCard key={doc.id} doc={doc} onView={openViewer} />
            ))}
          </div>
        </section>

        {/* Section 5: For your customers */}
        <section className="group" id="members">
          <div className="group-head">
            <img src="/img/kilimanjaro.jpg" alt="" width="180" height="186" />
            <div>
              <h2>For your customers</h2>
              <p>What you hand a prospect or a member: the Key Facts first, then the plan in simple words, the product guide and the FAQ.</p>
            </div>
          </div>
          <div className="docs">
            {CUSTOMER_DOCS.map(doc => (
              <LibraryDocCard key={doc.id} doc={doc} onView={openViewer} />
            ))}
          </div>
        </section>

        {/* Section 6: Your kit, step by step */}
        <section className="group" id="kit">
          <div className="group-head">
            <img src="/img/denali.jpg" alt="" width="180" height="186" />
            <div>
              <h2>Your kit, step by step</h2>
              <p>Eighteen short documents in the order you need them: start with the Kit Index. Each card says in one line what the document is, who it is for and when to use it.</p>
            </div>
          </div>
          <div className="docs">
            {KIT_DOCS.map(doc => (
              <LibraryDocCard key={doc.id} doc={doc} onView={openViewer} />
            ))}
          </div>
        </section>

        {/* Section 7: The founders */}
        <section className="group" id="founders">
          <div className="group-head">
            <img src="/img/fuji.jpg" alt="" width="180" height="186" />
            <div>
              <h2>The founders</h2>
              <p>Who started Delta One, what they built before, and why they built this together.</p>
            </div>
          </div>
          <div className="docs">
            {FOUNDER_DOCS.map(doc => (
              <LibraryDocCard key={doc.id} doc={doc} onView={openViewer} />
            ))}
          </div>
        </section>

        {/* Section 8: Legal and compliance */}
        <section className="group" id="legal">
          <div className="group-head">
            <img src="/img/matterhorn.jpg" alt="" width="180" height="186" />
            <div>
              <h2>Legal and compliance</h2>
              <p>The agreement every distributor signs, and the full rulebook.</p>
            </div>
          </div>
          <div className="docs">
            {LEGAL_DOCS.map(doc => (
              <LibraryDocCard key={doc.id} doc={doc} onView={openViewer} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

