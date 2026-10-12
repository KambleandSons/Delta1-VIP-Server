import { useApp } from '../context/AppContext';

function DocCard({ doc, onView }) {
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
          <button type="button" className="btn primary view" onClick={() => onView(doc.file, doc.name, doc.title)}>Open</button>
          <button type="button" className="btn ghost dl" id={doc.dlId} onClick={() => handleDownload(doc.file, doc.name)}>Download</button>
        </div>
        <div className="actions listen-row">
          {doc.explainId && (
            <button type="button" className="btn listen ex" data-id={doc.explainId} data-title={doc.explainTitle}>
              <span className="ic">▶</span> Explain it <span className="tm">{doc.explainDur}</span>
            </button>
          )}
          <button type="button" className="btn listen rd" data-file={'/' + doc.file} data-name={doc.name} data-title={doc.title} data-lang="en" data-aria={doc.hasAria ? '1' : undefined}>
            <span className="ic">▶</span>{' '}
            {doc.hasAria ? (
              <><span className="l-aria">Aria reads it to me</span><span className="l-plain">Read it to me</span></>
            ) : 'Read it to me'}
          </button>
        </div>
        <p className="status" id={doc.stId} role="status" aria-live="polite"></p>
      </div>
    </article>
  );
}

export default function Step3() {
  const { markStepDone, openViewer } = useApp();

  const docs = [
    {
      id: "s3-Delta_One_Getting_Started_Checklist",
      cover: "img/cover_Delta_One_Getting_Started_Checklist.jpg",
      coverAlt: "Cover of Getting Started Checklist",
      tag: "Do 1 · 3 · Account, wallet, own module",
      title: "Getting Started Checklist",
      plain: "Tick boxes: account, identity check, wallet, your own module, the first 11 days, your tools.",
      who: "New members and distributors", when: "Your first day, with your sponsor.",
      moreDetail: "Account and identity check, the wallet, the own module, the first eleven days and the Auto-Rebuy decision on day 11, the tools and the first conversations, as a checklist with a sponsor.",
      specs: "PDF · 3 pages · 0.5 MB",
      file: "docs/Delta_One_Getting_Started_Checklist.pdf",
      name: "Delta_One_Getting_Started_Checklist.pdf",
      dlId: "dl-40",
      explainId: "Delta_One_Getting_Started_Checklist",
      explainTitle: "Getting Started Checklist",
      explainDur: "0:17",
      hasAria: true,
      stId: "st-40",
    },
    {
      id: "s3-Delta_One_Language_Card",
      cover: "img/cover_Delta_One_Language_Card.jpg",
      coverAlt: "Cover of The Language Card",
      tag: "Do 2 · 0 · What we say and never say",
      title: "The Language Card",
      plain: "The words we use and the words we never use, and five sentences you can always say.",
      who: "Distributors", when: "Read it before your first conversation and once a week after.",
      moreDetail: "Purchase not investment, result not return, rebuy not reinvest: the words, the five sentences a distributor can always use, and the claims that are never made.",
      specs: "PDF · 3 pages · 0.5 MB",
      file: "docs/Delta_One_Language_Card.pdf",
      name: "Delta_One_Language_Card.pdf",
      dlId: "dl-41",
      explainId: "Delta_One_Language_Card",
      explainTitle: "The Language Card",
      explainDur: "0:21",
      hasAria: true,
      stId: "st-41",
    },
  ];

  function handleDone() {
    markStepDone(3);
    document.getElementById('check')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="step s3" id="step3">
      <div className="wrap">
        <div className="step-head">
          <div className="step-num">3</div>
          <div>
            <p className="kicker">Step 3 of 3 · Do</p>
            <h2 className="section-title">Set up, plan, and say it right.</h2>
            <p className="section-lede">
              Now you use what you learned. Two documents to work through with your sponsor, and two live tools
              that open in a new tab and wait for you to come back.
            </p>
            <div className="goals">
              <p className="goals-t">After this step you can…</p>
              <ul>
                <li>Set up an account, a wallet and your own module, with your sponsor, in the right order.</li>
                <li>Use the right words: purchase, not investment; result, not return; rebuy, not reinvest; rewards, not income.</li>
                <li>Run the calculator for one module and read what it shows, day by day.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs">
          {docs.map(doc => (
            <DocCard key={doc.id} doc={doc} onView={openViewer} />
          ))}
        </div>

        <div className="tools">
          <article className="tool">
            <p className="doc-tag">Do 3 · Live tool</p>
            <h3>Module Calculator</h3>
            <p>Enter a module size and an average daily result, choose the switch and the Believer, and see day by day what the module delivers at that average — when the price comes back, when 2× arrives, and the rebuy modules on the way.</p>
            <div className="actions">
              <a className="btn primary" href="https://claude.ai/artifact/NKEVoUd5Jogv1QRKWhWNnw" target="_blank" rel="noopener" data-tool="calculator">
                Open the calculator ↗
              </a>
            </div>
          </article>
          <article className="tool">
            <p className="doc-tag">Do 4 · Live tool</p>
            <h3>Fast Start 90-day planner</h3>
            <p>Your first three days, first week, first month and day 90 as dated tasks, with rank goals and a team calculator. Your goals and ticks go into your training record.</p>
            <div className="actions">
              <a className="btn primary" href="tools/faststart/index.html" target="_blank" rel="noopener" data-tool="planner">
                Open the planner ↗
              </a>
            </div>
          </article>
        </div>

        <div className="step-foot">
          <p>Done? Then check yourself: six small questions, like a quiz in class. You will know whether the plan stuck.</p>
          <button type="button" className="btn next" data-done="3" onClick={handleDone}>
            Done — check yourself ▸
          </button>
        </div>
      </div>
    </section>
  );
}

