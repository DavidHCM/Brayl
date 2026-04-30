import LogoBlob from './LogoBlob';
import { IconContrast, IconVol } from './Icons';

const TABS = [
  { id: 'traducir', label: 'Traducir' },
  { id: 'archivos', label: 'Archivos' },
  { id: 'acerca',   label: 'Acerca de' },
];

const SCREEN_MSGS = {
  traducir: 'Pantalla de traducción de texto al braille',
  archivos: 'Pantalla de archivos y documentos',
  acerca:   'Acerca de Brayl',
};

export default function Nav({ screen, setScreen, fs, setFs, hc, setHc }) {
  const readScreen = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(SCREEN_MSGS[screen]);
    u.lang = 'es-MX';
    window.speechSynthesis.speak(u);
  };

  return (
    <nav className="nav" aria-label="Navegación principal">
      <a
        href="#"
        className="logo-lockup"
        aria-label="Brayl — inicio"
        onClick={e => { e.preventDefault(); setScreen('traducir'); }}
      >
        <LogoBlob size={40} />
        <div>
          <div className="logo-name">Bra<em>yl</em></div>
          <div className="logo-sub">braille mexicano</div>
        </div>
      </a>

      <ul className="nav-tabs" role="tablist" aria-label="Secciones de la aplicación">
        {TABS.map(t => (
          <li key={t.id} role="presentation">
            <button
              role="tab"
              className="nav-tab"
              aria-current={screen === t.id ? 'page' : undefined}
              aria-selected={screen === t.id}
              onClick={() => setScreen(t.id)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="a11y-group" aria-label="Opciones de accesibilidad">
        <button
          className={`a11y-btn${hc ? ' on' : ''}`}
          onClick={() => setHc(!hc)}
          aria-pressed={hc}
          aria-label={hc ? 'Desactivar modo de alto contraste' : 'Activar modo de alto contraste'}
          title="Alto contraste"
        >
          <IconContrast s={15} />
        </button>
        <button
          className="a11y-btn"
          onClick={() => setFs(f => Math.min(f + 2, 24))}
          aria-label="Aumentar tamaño de texto"
          title="Texto más grande"
        >A+</button>
        <button
          className="a11y-btn"
          onClick={() => setFs(f => Math.max(f - 2, 14))}
          aria-label="Reducir tamaño de texto"
          title="Texto más pequeño"
        >A−</button>
        <button
          className="a11y-btn"
          onClick={readScreen}
          aria-label="Leer pantalla actual en voz alta"
          title="Leer en voz alta"
        >
          <IconVol s={15} />
        </button>
      </div>
    </nav>
  );
}
