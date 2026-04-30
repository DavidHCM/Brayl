import { useState, useRef, useCallback } from 'react';
import BlobBg from './BlobBg';
import BraylLoader from './BraylLoader';
import { IconMic, IconStop, IconVol, IconCopy, IconDl, IconCheck, IconFile } from './Icons';
import { translateText, downloadText } from '../api';

export default function ScreenTraducir({ fs, setScreen }) {
  const [text, setText]       = useState('');
  const [output, setOutput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [listening, setListening] = useState(false);
  const [copied, setCopied]   = useState(false);
  const recRef = useRef(null);

  const doTranslate = useCallback(async () => {
    if (!text.trim()) return;
    setLoading(true); setOutput(''); setError('');
    try {
      const data = await translateText(text);
      setOutput(data.braille);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [text]);

  const toggleDictar = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Tu navegador no soporta dictado por voz. Prueba en Chrome o Edge.');
      return;
    }
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.lang = 'es-MX'; r.continuous = true; r.interimResults = true;
    r.onresult = e => setText(Array.from(e.results).map(x => x[0].transcript).join(''));
    r.onend = () => setListening(false);
    r.start(); recRef.current = r; setListening(true);
  };

  const handleSpeak = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-MX'; u.rate = 0.88;
    window.speechSynthesis.speak(u);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleDl = (ext) => {
    const content = ext === 'brl'
      ? output
      : `Texto original:\n${text}\n\nBraille (Grado 1):\n${output}`;
    downloadText(content, `brayl.${ext}`);
  };

  return (
    <main id="main" className="main-scroll">
      <BlobBg />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1020, margin: '0 auto', padding: '40px 40px 60px' }}>

        <header style={{ marginBottom: 36 }}>
          <p className="t-label" style={{ marginBottom: 10 }}>Español Mexicano → Braille Mexicano · Grado 1</p>
          <h1 className="t-display">
            Tu texto,{' '}
            <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>en braille.</em>
          </h1>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

          {/* INPUT */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="tx-in" className="t-label">Texto en español</label>
              <span className="t-small" aria-live="polite">{text.length} / 2000</span>
            </div>

            <textarea
              id="tx-in"
              className="brayl-ta"
              style={{ minHeight: 200, fontSize: fs }}
              placeholder="Escribe o pega tu texto aquí…"
              maxLength={2000}
              value={text}
              onChange={e => setText(e.target.value)}
              aria-label="Texto en español para traducir al braille"
            />

            <div className="sep" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className={`btn-ghost${listening ? ' active' : ''}`}
                onClick={toggleDictar}
                aria-pressed={listening}
                aria-label={listening ? 'Detener dictado por voz' : 'Iniciar dictado por voz'}
                style={listening ? { animation: 'listening-ring 1.2s ease-out infinite' } : {}}
              >
                {listening ? <IconStop s={15} /> : <IconMic s={15} />}
                {listening ? 'Detener dictado' : 'Dictar'}
              </button>
              <button
                className="btn-primary"
                onClick={doTranslate}
                disabled={!text.trim() || loading}
                aria-label="Traducir texto al braille"
              >
                Traducir
              </button>
            </div>
          </div>

          {/* OUTPUT */}
          <div
            className="card"
            style={{
              display: 'flex', flexDirection: 'column', gap: 14,
              background: output ? 'var(--rust-light)' : 'var(--surface)',
              transition: 'background 0.4s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="t-label">Braille Mexicano</span>
              {output && <span className="tag"><IconCheck s={11} /> Listo</span>}
            </div>

            <div style={{ flex: 1, minHeight: 200, display: 'flex', alignItems: (loading || error) ? 'center' : 'flex-start', justifyContent: (loading || error) ? 'center' : 'flex-start' }}>
              {loading ? (
                <BraylLoader />
              ) : error ? (
                <p style={{ color: 'var(--rust)', fontSize: 14, fontStyle: 'italic', textAlign: 'center' }}>{error}</p>
              ) : output ? (
                <p
                  className="braille-out anim-fade-up"
                  aria-label={`Resultado en braille para: ${text}`}
                  style={{ fontSize: Math.max(22, fs * 1.4) }}
                >
                  {output}
                </p>
              ) : (
                <div aria-hidden="true" style={{ opacity: 0.18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[80, 58, 70].map((w, i) => (
                    <div key={i} style={{ height: 3, borderRadius: 2, background: 'var(--rust)', width: `${w}%` }} />
                  ))}
                </div>
              )}
            </div>

            {output && (
              <>
                <div className="sep" />
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  <button className="btn-ghost" onClick={handleSpeak} aria-label="Escuchar texto en voz alta">
                    <IconVol /> Escuchar
                  </button>
                  <button className="btn-ghost" onClick={handleCopy} aria-label="Copiar braille al portapapeles">
                    {copied ? <IconCheck /> : <IconCopy />} {copied ? 'Copiado' : 'Copiar'}
                  </button>
                  <button className="btn-ghost" onClick={() => handleDl('brl')} aria-label="Descargar archivo BRL">
                    <IconDl /> .brl
                  </button>
                  <button className="btn-ghost" onClick={() => handleDl('txt')} aria-label="Descargar archivo de texto">
                    <IconDl /> .txt
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 18, padding: '18px 26px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}
          onClick={() => setScreen('archivos')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setScreen('archivos')}
          aria-label="Ir a la sección de archivos"
        >
          <IconFile s={22} />
          <div>
            <p style={{ fontWeight: 700, fontSize: 15 }}>¿Tienes un documento?</p>
            <p className="t-small">Traduce archivos Word o PDF completos en la sección <strong>Archivos</strong></p>
          </div>
        </div>
      </div>
    </main>
  );
}
