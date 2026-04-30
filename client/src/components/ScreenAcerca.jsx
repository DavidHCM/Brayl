import BlobBg from './BlobBg';
import LogoBlob from './LogoBlob';

function DotCell({ pattern }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 10px)', gap: 5, marginBottom: 16 }} aria-hidden="true">
      {pattern.map((on, i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--rust)', opacity: on ? 0.9 : 0.12 }} />
      ))}
    </div>
  );
}

const STEPS = [
  { dots: [1,0,0,0,0,0], title: 'Escribe o dicta',      body: 'Ingresa tu texto en español mexicano. Puedes escribirlo, pegarlo o dictarlo con tu voz.' },
  { dots: [1,1,0,0,0,0], title: 'Se traduce al braille', body: 'Brayl convierte tu texto al braille mexicano estándar de Grado 1, respetando gramática y puntuación.' },
  { dots: [1,1,0,1,0,0], title: 'Descarga o escucha',    body: 'Obtén un archivo .brl listo para imprimir en impresora braille, o escucha el resultado en voz alta.' },
];

export default function ScreenAcerca({ fs }) {
  return (
    <main id="main" className="main-scroll">
      <BlobBg />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '40px 40px 60px' }}>

        <header style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <LogoBlob size={88} />
          </div>
          <h1 className="t-display" style={{ marginBottom: 20 }}>
            Conectar a través<br />
            <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>del tacto.</em>
          </h1>
          <p className="t-body" style={{ color: 'var(--ink-mid)', maxWidth: 520, margin: '0 auto', fontSize: fs }}>
            Brayl nació de la convicción de que la información no debe tener barreras.
            Acercamos el braille mexicano a cualquier persona, de forma simple y con dignidad.
          </p>
        </header>

        <section aria-labelledby="como-h" style={{ marginBottom: 52 }}>
          <p className="t-label" id="como-h" style={{ textAlign: 'center', marginBottom: 28 }}>Cómo funciona</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {STEPS.map((s, i) => (
              <div key={i} className="card">
                <DotCell pattern={s.dots} />
                <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.title}</p>
                <p className="t-small" style={{ lineHeight: 1.7, fontSize: Math.max(13, fs - 2) }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginBottom: 24, borderLeft: '3px solid var(--rust)', background: 'var(--rust-light)' }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Accesibilidad al centro</h2>
          <p className="t-body" style={{ color: 'var(--ink-mid)', fontSize: fs }}>
            Brayl cumple con los criterios WCAG 2.1 nivel AA. Todos los controles son navegables
            por teclado y compatibles con lectores de pantalla. El modo de alto contraste y el texto
            a voz están disponibles en todo momento, desde cualquier pantalla.
          </p>
        </section>

        <div style={{ textAlign: 'center', padding: '32px 0', opacity: 0.55 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, letterSpacing: 8, color: 'var(--rust)', marginBottom: 10 }}>
            ⠃⠗⠁⠊⠇⠇⠑⠀⠑⠝⠀⠑⠎⠏⠁⠻⠕⠇
          </p>
          <p className="t-small">braille en español</p>
        </div>
      </div>
    </main>
  );
}
