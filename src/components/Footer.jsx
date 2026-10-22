

export default function Footer({ onResetProgress, onExportProgress }) {
  return (
    <>
      <section className="bg-d1surface border-t border-d1line py-12 px-6">
        <div className="wrap max-w-[1160px] mx-auto space-y-10">
          <div className="notes block p-6 rounded-2xl bg-d1bg border border-d1line">
            <h2 className="text-xl font-bold font-display mb-2 text-d1fg">
              Before you share anything
            </h2>
            <p className="text-sm text-d1muted leading-relaxed">
              Every figure on this site and in every document is a hypothetical illustration at the engine's average daily result. Individual days vary and can be zero; results and rewards are not guaranteed. A module is a software purchase whose price is not refundable and can be lost; only purchase with money you can afford to lose. <b className="text-d1fg">Most members earn no commission at all.</b> Settlement is daily at 12:00 UTC. Every document is a draft for legal and compliance review; nothing here is legal, tax or financial advice.
            </p>
          </div>

          <div className="helpgrid grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="tool p-5 rounded-xl border border-d1line bg-d1surface !h-full">
              <h3 className="font-bold text-sm font-display mb-2 text-d1fg">
                Stuck? Ask your sponsor.
              </h3>
              <p className="text-xs text-d1muted leading-relaxed">
                Your sponsor walked this page before you. Send them the question and the document it came from.
              </p>
            </article>

            <article className="tool p-5 rounded-xl border border-d1line bg-d1surface !h-full">
              <h3 className="font-bold text-sm font-display mb-2 text-d1fg">
                Sponsors: teach this in 45 minutes
              </h3>
              <p className="text-xs text-d1muted leading-relaxed">
                0–10 min: watch The Seed Farm together. 10–25: the Key Facts and the plan on one page, press Read it to me. 25–35: the Getting Started Checklist, box by box. 35–40: the checkpoint. 40–45: your new member says it in their own words. Then set the day-1 review.
              </p>
            </article>

            <article className="tool p-5 rounded-xl border border-d1line bg-d1surface flex flex-col justify-between !h-full">
              <div>
                <h3 className="font-bold text-sm font-display mb-2 text-d1fg">
                  Say it right
                </h3>
                <p className="text-xs text-d1muted leading-relaxed mb-3">
                  Purchase, not investment. Result, not return. Rebuy, not reinvest. Rewards, not income. The Language Card in your kit has the rest.
                </p>
              </div>
              <a
                href="#doc-Delta_One_Language_Card"
                className="btn ghost sm text-xs inline-flex items-center self-start text-d1blue-ink hover:underline"
              >
                Go to the Language Card →
              </a>
            </article>

            <article className="tool p-5 rounded-xl border border-d1line bg-d1surface flex flex-col justify-between !h-full" id="privacy">
              <div>
                <h3 className="font-bold text-sm font-display mb-2 text-d1fg">
                  What this page remembers, and who sees it
                </h3>
                <p className="text-xs text-d1muted leading-relaxed mb-3">
                  Your three check marks, where you are in each film, which documents you opened, your checkpoint score, and your climbing style are your <b>training record</b>. It lives on this device and on your sponsor's dashboard.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={onExportProgress}
                  className="px-2.5 py-1 text-[11px] rounded-full border border-d1line bg-d1bg hover:border-d1blue text-d1fg transition-colors"
                >
                  Export record
                </button>
                <button
                  type="button"
                  onClick={onResetProgress}
                  className="px-2.5 py-1 text-[11px] rounded-full border border-d1line bg-d1bg hover:border-red-500 text-red-500 transition-colors"
                >
                  Reset progress
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer className="py-6 px-6 bg-d1bg border-t border-d1line text-center text-xs text-d1muted">
        <div className="wrap max-w-[1160px] mx-auto">
          <p>Delta One VIP · The Momentum Plan · October 2026 · Draft for legal and compliance review.</p>
        </div>
      </footer>
    </>
  );
}
