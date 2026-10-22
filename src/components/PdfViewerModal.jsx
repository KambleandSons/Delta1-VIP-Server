import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function PdfViewerModal({ isOpen, onClose, file, name, title, onDownload }) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('Loading…');
  const [isReading, setIsReading] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const pagesContainerRef = useRef(null);
  const docRef = useRef(null);
  const readingRef = useRef({ on: false, seq: 0, pages: [], i: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    if (!isOpen || !file) {
      stopReading();
      if (docRef.current) {
        docRef.current.destroy?.();
        docRef.current = null;
      }
      return;
    }

    let isCancelled = false;
    setStatus('Loading…');
    if (pagesContainerRef.current) pagesContainerRef.current.innerHTML = '';

    const adjustedFile = theme === 'light' && !file.startsWith('light/') ? `light/${file}` : file;

    const loadPdf = async () => {
      try {
        if (!window.pdfjsLib) {
          setStatus('PDF viewer library is loading or not available.');
          return;
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/lib/pdf.worker.js';

        const response = await fetch('/' + adjustedFile.replace(/^\/+/, ''));
        if (!response.ok) throw new Error('File not found');
        const buffer = await response.arrayBuffer();

        if (isCancelled) return;

        const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false });
        const doc = await loadingTask.promise;
        if (isCancelled) {
          doc.destroy?.();
          return;
        }

        docRef.current = doc;
        setNumPages(doc.numPages);
        setStatus(`${doc.numPages} pages`);

        // Render pages sequentially
        const container = pagesContainerRef.current;
        if (!container) return;

        for (let i = 1; i <= doc.numPages; i++) {
          if (isCancelled) break;
          const page = await doc.getPage(i);
          const vp = page.getViewport({ scale: 1 });
          const maxWidth = Math.min(container.clientWidth - 32, 900) || 800;
          const scale = maxWidth / vp.width;
          const viewport = page.getViewport({ scale: scale * (window.devicePixelRatio || 1) });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = `${maxWidth}px`;
          canvas.style.height = 'auto';
          canvas.className = 'vpage shadow-2xl rounded-sm mb-4 mx-auto block bg-white';
          canvas.dataset.pageNumber = i;
          container.appendChild(canvas);

          const context = canvas.getContext('2d');
          await page.render({ canvasContext: context, viewport }).promise;
        }
      } catch (err) {
        console.error('PDF error:', err);
        if (!isCancelled) {
          setStatus('The file didn’t load. Please try again.');
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
      stopReading();
      if (docRef.current) {
        docRef.current.destroy?.();
        docRef.current = null;
      }
    };
  }, [isOpen, file, theme]);

  const stopReading = () => {
    readingRef.current.on = false;
    readingRef.current.seq++;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsReading(false);
  };

  const startReading = async () => {
    const synth = window.speechSynthesis;
    if (!synth) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isReading) {
      stopReading();
      setStatus('Stopped reading.');
      return;
    }

    if (!docRef.current) return;

    setStatus('Preparing the reading…');
    const doc = docRef.current;
    const pageTexts = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      const str = textContent.items.map(it => it.str).join(' ').replace(/\s+/g, ' ').trim();
      pageTexts.push(str);
    }

    const mySeq = ++readingRef.current.seq;
    readingRef.current.pages = pageTexts;
    readingRef.current.i = 0;
    readingRef.current.on = true;
    setIsReading(true);

    const readNext = () => {
      if (!readingRef.current.on || mySeq !== readingRef.current.seq) return;
      if (readingRef.current.i >= readingRef.current.pages.length) {
        stopReading();
        setStatus('Finished reading.');
        return;
      }

      const text = readingRef.current.pages[readingRef.current.i];
      const pageIdx = readingRef.current.i + 1;
      readingRef.current.i++;

      if (!text) {
        readNext();
        return;
      }

      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = speechRate;
      setStatus(`Reading page ${pageIdx} of ${doc.numPages}`);

      utter.onend = () => readNext();
      utter.onerror = () => readNext();
      synth.speak(utter);
    };

    readNext();
  };

  if (!isOpen) return null;

  return (
    <div
      id="viewer"
      className="fixed inset-0 z-50 bg-[#0B1A33] flex flex-col text-white"
      style={{ display: 'flex' }}
    >
      <div className="pdf-vbar">
        <strong id="vtitle" className="text-sm font-semibold truncate max-w-xs md:max-w-md">
          {title || name}
        </strong>
        <span id="vinfo" className="text-xs text-[#B3C1D8]">
          {status}
        </span>
        <div className="vsp"></div>
        <button
          type="button"
          onClick={startReading}
          className="btn text-xs px-3 py-1.5 rounded-full border border-[#2A3C5E] hover:border-d1blue text-white flex items-center gap-1.5 transition-colors"
        >
          {isReading ? '⏹ Stop reading' : '▶ Read it to me'}
        </button>
        <select
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
          className="bg-[#121F38] text-white text-xs border border-[#2A3C5E] rounded-full px-2 py-1"
          aria-label="Reading speed"
        >
          <option value="0.85">0.85×</option>
          <option value="1">1×</option>
          <option value="1.15">1.15×</option>
          <option value="1.3">1.3×</option>
        </select>
        <button
          type="button"
          onClick={() => {
            if (onDownload) onDownload(file, name);
            else {
              const a = document.createElement('a');
              a.href = '/' + file.replace(/^\/+/, '');
              a.download = name || 'document.pdf';
              a.click();
            }
          }}
          className="btn text-xs px-3 py-1.5 rounded-full border border-[#2A3C5E] hover:border-d1gold text-white transition-colors"
        >
          Download
        </button>
        <button
          type="button"
          onClick={onClose}
          className="btn text-xs px-3 py-1.5 rounded-full border border-[#2A3C5E] hover:bg-red-900/40 text-white font-bold"
          aria-label="Close"
        >
          ✕ Close
        </button>
      </div>

      <div
        id="vpages"
        ref={pagesContainerRef}
        className="vpages flex-1 overflow-auto p-4 flex flex-col items-center bg-[#0B1A33]"
      />
    </div>
  );
}

