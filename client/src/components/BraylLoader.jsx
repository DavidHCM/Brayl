import LogoBlob from './LogoBlob';

export default function BraylLoader({ label = 'Traduciendo al braille…' }) {
  return (
    <div role="status" aria-live="polite" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '28px 0' }}>
      <div style={{ position: 'relative', width: 72, height: 72 }}>
        <div style={{
          width: 72, height: 72,
          background: 'var(--rust)', opacity: 0.12,
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          animation: 'morph 3s ease-in-out infinite, breathe 2s ease-in-out infinite',
          transformOrigin: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LogoBlob size={48} />
        </div>
      </div>
      <p style={{ fontSize: 14, color: 'var(--ink-soft)', fontStyle: 'italic' }}>{label}</p>
    </div>
  );
}
