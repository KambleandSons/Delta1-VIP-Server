import { useApp } from '../context/AppContext';

export default function PdfViewer() {
  const { viewer, closeViewer } = useApp();

  if (!viewer.open) return null;

  function handleDownload() {
    if (!viewer.file) return;
    const a = document.createElement('a');
    a.href = '/' + viewer.file;
    a.download = viewer.name || 'document.pdf';
    a.click();
  }

  return (
    <div
      className="viewer on"
      id="viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Document viewer"
    >
      <div className="vbar">
        <h2 id="vtitle">{viewer.title || viewer.name}</h2>
        <span className="vinfo" id="vinfo">PDF Viewer</span>
        <button type="button" className="btn ghost dl" id="vdl" onClick={handleDownload}>
          Download
        </button>
        <button type="button" className="btn ghost" id="vclose" onClick={closeViewer}>
          Close ✕
        </button>
      </div>

      <div className="vpages" style={{ padding: '0', height: '100%', flex: 1, overflow: 'hidden' }}>
        <iframe
          src={`/${viewer.file}#view=FitH`}
          title={viewer.title || 'Document Preview'}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  );
}

