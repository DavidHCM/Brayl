export default function BlobBg() {
  return (
    <div className="blob-bg" aria-hidden="true">
      <div className="blob" style={{ width: 520, height: 520, top: -200, right: -100, background: 'var(--rust-light)', animationDelay: '0s' }} />
      <div className="blob" style={{ width: 340, height: 340, bottom: -80, left: -50, background: 'oklch(92% 0.022 80)', animationDelay: '-4s' }} />
    </div>
  );
}
