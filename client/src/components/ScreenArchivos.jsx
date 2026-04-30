import { useState, useRef } from 'react';
import BlobBg from './BlobBg';
import BraylLoader from './BraylLoader';
import { IconUp, IconFile, IconDl, IconCheck, IconAlert } from './Icons';
import { uploadFile, downloadText } from '../api';

function formatDate(d) {
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export default function ScreenArchivos({ fs }) {
  const [drag, setDrag]       = useState(false);
  const [processing, setProc] = useState(false);
  const [error, setError]     = useState('');
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setProc(true); setError('');
    try {
      const data = await uploadFile(file);
      setHistory(prev => [{
        id: Date.now(),
        name: file.name,
        date: formatDate(new Date()),
        size: formatSize(file.size),
        braille: data.braille,
        originalText: data.originalText,
      }, ...prev]);
    } catch (e) {
      setError(e.message);
    } finally {
      setProc(false);
    }
  };

  const handleDl = (item, ext) => {
    const base = item.name.replace(/\.(docx|pdf)$/i, '');
    const content = ext === 'brl'
      ? item.braille
      : `Texto original:\n${item.originalText}\n\nBraille (Grado 1):\n${item.braille}`;
    downloadText(content, `${base}.${ext}`);
  };

  return (
    <main id="main" className="main-scroll">
      <BlobBg />
      <div className="layout-md">

        <header style={{ marginBottom: 36 }}>
          <p className="t-label" style={{ marginBottom: 10 }}>Documentos</p>
          <h1 className="t-heading">Traduce archivos completos</h1>
          <p className="t-body" style={{ marginTop: 8, color: 'var(--ink-mid)', fontSize: fs }}>
            Sube un documento Word o PDF y te regresamos el contenido traducido al braille mexicano estándar.
          </p>
        </header>

        <div
          className={`upload-zone${drag ? ' drag' : ''}`}
          style={{ marginBottom: 24 }}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Zona de carga. Arrastra un archivo aquí o presiona Enter para seleccionar"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".docx,.pdf"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
            aria-hidden="true"
          />
          <div className="anim-float" style={{ color: 'var(--rust)', marginBottom: 16 }}>
            <IconUp s={44} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            {drag ? 'Suelta el archivo aquí' : 'Arrastra tu archivo aquí'}
          </p>
          <p className="t-small" style={{ marginBottom: 22 }}>Formatos: .docx · .pdf — hasta 10 MB</p>
          <button
            className="btn-primary"
            onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            Seleccionar archivo
          </button>
        </div>

        {processing && (
          <div className="card anim-fade-up" style={{ marginBottom: 16 }}>
            <BraylLoader label="Procesando documento…" />
          </div>
        )}

        {error && !processing && (
          <div className="card anim-fade-up" style={{ marginBottom: 16, borderLeft: '3px solid var(--rust)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconAlert s={18} />
            <p style={{ fontSize: 14, color: 'var(--rust)' }}>{error}</p>
          </div>
        )}

        {history.length > 0 && (
          <section aria-labelledby="hist-title">
            <h2 id="hist-title" style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-mid)', marginBottom: 14 }}>
              Conversiones de esta sesión
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map(item => (
                <div key={item.id} className="card history-row anim-fade-up">
                  <IconFile s={20} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p className="t-small">{item.date} · {item.size}</p>
                  </div>
                  <span className="tag"><IconCheck s={11} /> Listo</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn-ghost"
                      onClick={() => handleDl(item, 'brl')}
                      aria-label={`Descargar ${item.name} en braille BRL`}
                    >
                      <IconDl s={13} /> .brl
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => handleDl(item, 'txt')}
                      aria-label={`Descargar ${item.name} en texto`}
                    >
                      <IconDl s={13} /> .txt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
