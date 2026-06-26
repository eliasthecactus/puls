interface Props {
  size?: number;
  showText?: boolean;
}

export function PulsLogo({ size = 32, showText = true }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="10" fill="url(#logo-grad)" />
        {/* Pulse / ECG line */}
        <polyline
          points="5,20 11,20 14,12 17,28 21,16 24,24 27,20 35,20"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7c3aed" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span className="text-white font-black tracking-wider" style={{ fontSize: size * 0.55 }}>
          PULS
        </span>
      )}
    </div>
  );
}
