// Ícones em SVG usados no app. Todos herdam a cor do texto (currentColor).

const Svg = ({ size = 24, stroke = 2.2, children, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

export const IconeInicio = () => (
  <Svg>
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </Svg>
);

export const IconeRadar = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 12 18.5 5.5" />
  </Svg>
);

export const IconePlano = () => (
  <Svg>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Svg>
);

export const IconeAssistente = () => (
  <Svg>
    <path d="M4 5h16v11H9l-5 4z" />
  </Svg>
);

export const IconeTray = () => (
  <Svg>
    <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />
  </Svg>
);

export const IconeCheck = () => (
  <Svg size={22} stroke={3.2}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const IconeSacola = () => (
  <Svg size={22} stroke={2.4} style={{ color: "var(--navy)" }}>
    <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);

export const IconeCadeado = () => (
  <Svg size={22}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);
