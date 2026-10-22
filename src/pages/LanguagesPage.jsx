import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import PdfViewerModal from '../components/PdfViewerModal';
import { useTheme } from '../context/ThemeContext';

const LANGUAGES = [
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "zh-Hans", name: "Simplified Chinese", native: "简体中文" },
  { code: "zh-Hant", name: "Traditional Chinese", native: "繁體中文" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "fr", name: "French", native: "Français" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "hu", name: "Hungarian", native: "Magyar" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "uk", name: "Ukrainian", native: "Українська" },
  { code: "af", name: "Afrikaans", native: "Afrikaans" },
  { code: "ms", name: "Bahasa Melayu", native: "Bahasa Melayu" },
  { code: "id", name: "Bahasa Indonesia", native: "Bahasa Indonesia" },
  { code: "th", name: "Thai", native: "ไทย" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "en", name: "English", native: "English (Reference)" }
];

export default function LanguagesPage() {
  const [viewerState, setViewerState] = useState({
    isOpen: false,
    file: '',
    name: '',
    title: ''
  });
  const { theme } = useTheme();

  const handleOpenPdf = (file, name, title) => {
    setViewerState({
      isOpen: true,
      file,
      name,
      title
    });
  };

  const handleCloseViewer = () => {
    setViewerState(prev => ({ ...prev, isOpen: false }));
  };

  const handleDownload = (file, name) => {
    const adjusted = theme === 'light' && !file.startsWith('light/') ? `light/${file}` : file;
    const a = document.createElement('a');
    a.href = '/' + adjusted.replace(/^\/+/, '');
    a.download = name;
    a.click();
  };

  return (
    <div className="min-h-screen bg-d1bg text-d1fg pb-16 font-sans">
      {/* Top Bar */}
      <div className="bg-[#0B1A33] text-white px-6 py-3 flex items-center justify-between border-b border-[#2A3C5E]">
        <Link to="/" className="text-white hover:text-d1gold text-sm font-semibold flex items-center gap-2 transition-colors">
          ← Back to Delta One VIP
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#A9BAD6] hidden sm:inline">20 Languages</span>
          <ThemeToggle />
        </div>
      </div>

      <main className="wrap max-w-[1040px] mx-auto px-6 py-10 space-y-6">
        <div>
          <p className="kick text-xs uppercase tracking-widest font-bold text-d1gold-ink mb-1">
            Delta One · The Momentum Plan · 20 languages
          </p>
          <h1 className="text-3xl md:text-5xl font-bold font-display leading-tight bg-gradient-to-r from-[#8C9BB0] via-[#C9962E] to-[#8A5E00] dark:from-[#DCEEFF] dark:via-[#8FC2FF] dark:to-[#FFC93C] bg-clip-text text-transparent">
            The two documents everyone reads first, in your language.
          </h1>
          <p className="text-sm text-d1muted max-w-3xl mt-3 leading-relaxed">
            <b>The Plan in Simple Words</b> (one idea per page, with a picture) and <b>Module Key Facts</b> (what a module is, what it delivers, what can go wrong — on one page), translated into 20 languages. The light/dark switch at the top chooses the matching edition.
          </p>
        </div>

        <div className="note p-4 rounded-xl border-l-4 border-d1gold bg-d1surface border border-d1line text-xs text-d1muted leading-relaxed">
          Every translation is a machine draft until a native speaker and compliance have reviewed it. The English documents are the reference; where a translation and the English text differ, the English text applies. Every figure is an illustration at the engine's 0.50% average daily result — not a guarantee. Most members earn no commission at all.
        </div>

        {/* Languages Table */}
        <div className="overflow-x-auto rounded-2xl border border-d1line bg-d1surface shadow-card">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-d1bg border-b-2 border-d1gold text-d1muted">
                <th className="p-4 uppercase font-semibold tracking-wider">Language</th>
                <th className="p-4 uppercase font-semibold tracking-wider">The Plan in Simple Words</th>
                <th className="p-4 uppercase font-semibold tracking-wider">Module Key Facts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-d1line">
              {LANGUAGES.map((lang) => {
                const isEnglish = lang.code === 'en';
                const simpleWordsFile = isEnglish
                  ? 'docs/Delta_One_Momentum_Plan_Simple_Words.pdf'
                  : `docs/i18n/Delta_One_Momentum_Plan_Simple_Words_${lang.code}.pdf`;
                const simpleWordsName = `Delta_One_Momentum_Plan_Simple_Words_${lang.code}.pdf`;

                const keyFactsFile = isEnglish
                  ? 'docs/Delta_One_Module_Key_Facts.pdf'
                  : `docs/i18n/Delta_One_Module_Key_Facts_${lang.code}.pdf`;
                const keyFactsName = `Delta_One_Module_Key_Facts_${lang.code}.pdf`;

                return (
                  <tr key={lang.code} className="hover:bg-d1bg transition-colors">
                    <td className="p-4 font-semibold text-d1fg">
                      <div>{lang.name}</div>
                      <span className="text-[11px] text-d1muted font-normal">{lang.native}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleOpenPdf(simpleWordsFile, simpleWordsName, `The Plan in Simple Words · ${lang.name}`)}
                          className="px-3.5 py-1.5 rounded-full bg-d1blue text-white font-semibold text-xs hover:bg-d1blue-ink transition-colors"
                        >
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(simpleWordsFile, simpleWordsName)}
                          className="px-3.5 py-1.5 rounded-full border border-d1line bg-transparent text-d1fg font-semibold text-xs hover:border-d1blue transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleOpenPdf(keyFactsFile, keyFactsName, `Module Key Facts · ${lang.name}`)}
                          className="px-3.5 py-1.5 rounded-full bg-d1blue text-white font-semibold text-xs hover:bg-d1blue-ink transition-colors"
                        >
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(keyFactsFile, keyFactsName)}
                          className="px-3.5 py-1.5 rounded-full border border-d1line bg-transparent text-d1fg font-semibold text-xs hover:border-d1blue transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* PDF Modal */}
      <PdfViewerModal
        isOpen={viewerState.isOpen}
        file={viewerState.file}
        name={viewerState.name}
        title={viewerState.title}
        onClose={handleCloseViewer}
      />
    </div>
  );
}
