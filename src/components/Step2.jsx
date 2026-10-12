import { useApp } from '../context/AppContext';

function DocCard({ doc, onView }) {
  const { lang } = useApp();

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
          {doc.extraDownloads?.map(ed => (
            <button key={ed.file} type="button" className="btn ghost dl" onClick={() => handleDownload(ed.file, ed.name)}>{ed.label}</button>
          ))}
        </div>
        <div className="actions listen-row">
          {!doc.noExplain && doc.explainId && (
            <button type="button" className="btn listen ex" data-id={doc.explainId} data-title={doc.explainTitle}>
              <span className="ic">▶</span> Explain it <span className="tm">{doc.explainDur}</span>
            </button>
          )}
          {!doc.noReadAloud && (
            <button type="button" className={`btn listen rd`} data-file={'/' + doc.file} data-name={doc.name} data-title={doc.title} data-lang="en" data-aria={doc.hasAria ? '1' : undefined}>
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

export default function Step2() {
  const { markStepDone, openViewer } = useApp();

  const docs = [
    {
      id: "s2-Delta_One_7_Summits_to_Success",
      cover: "img/cover_Delta_One_7_Summits_to_Success.jpg",
      coverAlt: "Cover of 7 Summits to Success",
      tag: "Read 1 of 3 · The plan on one page",
      title: "7 Summits to Success",
      plain: "The whole plan as one picture: the 7 Summits to Success, the 2% ladder from 6% to 42%, the line limit and the daily cap for every rank.",
      who: "Everyone", when: "To hand over, pin up or show on a phone.",
      moreDetail: "The whole Momentum Plan as one picture: the 7 Summits to Success from Fuji to Everest with each rank's 2% ladder, the number of levels it unlocks, the maximum any single line may count and the daily cap; then the ranks panel and the payout panel on their own pages. Three pages, made to hand over, pin up or share on a phone.",
      specs: "PDF · 3 pages · 2.0 MB",
      file: "docs/Delta_One_7_Summits_to_Success.pdf",
      name: "Delta_One_7_Summits_to_Success.pdf",
      dlId: "dl-37",
      explainId: "Delta_One_7_Summits_to_Success",
      explainTitle: "7 Summits to Success",
      explainDur: "0:29",
      hasAria: true,
      stId: "st-37",
    },
    {
      id: "s2-Delta_One_Momentum_Plan_Simple_Words",
      cover: "img/cover_Delta_One_Momentum_Plan_Simple_Words.jpg",
      coverAlt: "Cover of The Plan in Simple Words",
      tag: "Read 2 of 3 · Pictures and short sentences",
      title: "The Plan in Simple Words",
      plain: "The plan in pictures and very short sentences. Anyone can read it.",
      who: "Prospects and members", when: "Give it to anyone who finds the other documents hard.",
      moreDetail: "The whole plan for anyone, in any language level: one idea per page, a picture and three or four very short sentences. What you buy, the daily share, 2× and the end, the switch, the Believer, the 100 USDT, friends and levels, the 7 Summits to Success, build wide, stay ahead, payday, six rules, and the warning page.",
      specs: "PDF · 16 pages · 0.4 MB",
      file: "docs/Delta_One_Momentum_Plan_Simple_Words.pdf",
      name: "Delta_One_Momentum_Plan_Simple_Words.pdf",
      dlId: "dl-38",
      explainId: "Delta_One_Momentum_Plan_Simple_Words",
      explainTitle: "The Plan in Simple Words",
      explainDur: "0:24",
      hasAria: true,
      stId: "st-38",
    },
    {
      id: "s2-Delta_One_Module_Key_Facts",
      cover: "img/cover_Delta_One_Module_Key_Facts.jpg",
      coverAlt: "Cover of Key Facts & Risks",
      tag: "Read 3 of 3 · One page · read before you buy",
      title: "Key Facts & Risks",
      plain: "One page: what a module is, what it delivers, what can go wrong.",
      who: "Every prospect", when: "Before anyone buys. Always.",
      moreDetail: "Everything a customer must know before buying a module, on one page, with the main risks.",
      specs: "PDF · 1 page · 0.1 MB",
      file: "docs/Delta_One_Module_Key_Facts.pdf",
      name: "Delta_One_Module_Key_Facts.pdf",
      dlId: "dl-39",
      explainId: "Delta_One_Module_Key_Facts",
      explainTitle: "Key Facts & Risks",
      explainDur: "0:23",
      hasAria: true,
      stId: "st-39",
    },
  ];

  function handleDone() {
    markStepDone(2);
    document.getElementById('step3')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="step s2" id="step2">
      <div className="wrap">
        <div className="step-head">
          <div className="step-num">2</div>
          <div>
            <p className="kicker">Step 2 of 3 · Read</p>
            <h2 className="section-title">Three documents, in this order.</h2>
            <p className="section-lede">
              Every document gives you three choices: <b>Open</b> it and read; press <b>Explain it</b> and Aria explains
              it like a teacher; or press <b>Aria reads it to me</b> and she reads you what matters, page by page,
              while the page follows along. Download what you want to keep.
            </p>
            <div className="goals">
              <p className="goals-t">After this step you can…</p>
              <ul>
                <li>Point to any rank on the one-page plan and read its share (6% to 42%) and its daily cap.</li>
                <li>Explain the switch on day 11: keep rebuying, or send results to the wallet.</li>
                <li>Say the three Key Facts: it is a purchase; nothing is promised; only use money you can afford to lose.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs three">
          {docs.map(doc => (
            <DocCard key={doc.id} doc={doc} onView={openViewer} />
          ))}
        </div>

        <div className="step-foot">
          <p>Read all three? Good. You now know what you buy, what it pays, and what it never promises.</p>
          <button type="button" className="btn next" data-done="2" onClick={handleDone}>
            I read them — go to Step 3 ▸
          </button>
        </div>
      </div>
    </section>
  );
}

