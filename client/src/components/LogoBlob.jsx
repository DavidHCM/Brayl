export default function LogoBlob({ size = 44 }) {
  const r = size * 0.115;
  const cx1 = size * 0.34, cx2 = size * 0.66;
  const cy1 = size * 0.22, cy2 = size * 0.50, cy3 = size * 0.78;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true">
      <circle cx={cx1} cy={cy1} r={r} fill="var(--rust)" opacity="0.95"/>
      <circle cx={cx2} cy={cy1} r={r} fill="var(--rust)" opacity="0.95"/>
      <circle cx={cx1} cy={cy2} r={r} fill="var(--rust)" opacity="0.95"/>
      <circle cx={cx2} cy={cy2} r={r} fill="var(--rust)" opacity="0.22"/>
      <circle cx={cx1} cy={cy3} r={r} fill="var(--rust)" opacity="0.22"/>
      <circle cx={cx2} cy={cy3} r={r} fill="var(--rust)" opacity="0.95"/>
    </svg>
  );
}
