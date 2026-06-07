import React from 'react';
import styles from './TypeBadge.module.css';

// Map Spanish type names to English tokens for design system compliance
const typeTranslation: Record<string, string> = {
  fuego: 'fire',
  agua: 'water',
  planta: 'grass',
  electrico: 'electric',
  eléctrico: 'electric',
  veneno: 'poison',
  normal: 'normal',
  hielo: 'ice',
  lucha: 'fighting',
  tierra: 'ground',
  volador: 'flying',
  psiquico: 'psychic',
  psíquico: 'psychic',
  bicho: 'bug',
  roca: 'rock',
  fantasma: 'ghost',
  dragon: 'dragon',
  dragón: 'dragon',
  acero: 'steel',
  siniestro: 'dark',
  hada: 'fairy',
  
  // English fallbacks
  fire: 'fire',
  water: 'water',
  grass: 'grass',
  electric: 'electric',
  poison: 'poison',
  ice: 'ice',
  fighting: 'fighting',
  ground: 'ground',
  flying: 'flying',
  psychic: 'psychic',
  bug: 'bug',
  rock: 'rock',
  ghost: 'ghost',
  steel: 'steel',
  dark: 'dark',
  fairy: 'fairy',
};

// SVG paths for all 18 types as defined in the Kanto Retro-Sleek system
const typeSvgs: Record<string, React.ReactNode> = {
  fire: (
    <>
      <path d="M12 2c0 0 5 4.5 5 9.5c0 3.5-2.2 6.5-5 6.5s-5-3-5-6.5c0-5 5-9.5 5-9.5Z" fill="currentColor" />
      <path d="M12 11c0 0 2 1.5 2 3.5c0 1.5-1 2.5-2 2.5s-2-1-2-2.5c0-2 2-3.5 2-3.5Z" fill="#ffffff" opacity="0.8" />
    </>
  ),
  water: (
    <>
      <path d="M12 3c0 0 7 7 7 11.5a7 7 0 1 1-14 0c0-4.5 7-7 7-7Z" fill="currentColor" />
      <path d="M12 9c0 0 4 4 4 6.5c0 2-1.5 3.5-4 3.5s-4-1.5-4-3.5c0-2.5 4-6.5 4-6.5Z" fill="#ffffff" opacity="0.8" />
    </>
  ),
  grass: (
    <>
      <path d="M2 12c0 0 7-7 14-7s6 5 6 5s-7 7-14 7s-6-5-6-5Z" fill="currentColor" />
      <path d="M2 12h20M12 5c0 3-2 6-5 7M16 12c0-3-2-5-5-7" stroke="#ffffff" stroke-width="2" />
    </>
  ),
  electric: <path d="M13 2L4 14h8l-1 8l9-12h-8l1-8Z" fill="currentColor" />,
  poison: (
    <>
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <path d="M9 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm6 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8 14h8v2H8v-2Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
    </>
  ),
  normal: (
    <>
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <circle cx="12" cy="12" r="4" stroke="#ffffff" stroke-width="2" />
    </>
  ),
  ice: (
    <>
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <path d="M12 5v14M5 12h14M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
    </>
  ),
  fighting: (
    <>
      <rect x="6" y="8" width="12" height="10" rx="2" fill="currentColor" />
      <circle cx="8" cy="6" r="1.5" fill="currentColor" />
      <circle cx="11" cy="5" r="1.5" fill="currentColor" />
      <circle cx="14" cy="5" r="1.5" fill="currentColor" />
      <circle cx="17" cy="6" r="1.5" fill="currentColor" />
      <path d="M9 11h6v4H9v-4Z" stroke="#ffffff" stroke-width="2" />
    </>
  ),
  ground: (
    <>
      <path d="M12 3l9 14H3l9-14Z" fill="currentColor" />
      <path d="M7 14h10M10 10h4" stroke="#ffffff" stroke-width="2" />
    </>
  ),
  flying: (
    <>
      <path d="M4 10c4 0 8 3 12 1s5-7 5-7s-3 6-7 7s-10-1-10-1Z" fill="currentColor" />
      <path d="M3 15c4 0 7 2 11 1s4-5 4-5s-3 4-7 5s-8-1-8-1Z" fill="currentColor" opacity="0.7" />
    </>
  ),
  psychic: (
    <>
      <path d="M1 12s4-7 11-7s11 7 11 7s-4 7-11 7s-11-7-11-7Z" fill="currentColor" />
      <circle cx="12" cy="12" r="4" fill="#ffffff" stroke="currentColor" stroke-width="1.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  bug: (
    <>
      <rect x="8" y="8" width="8" height="10" rx="4" fill="currentColor" />
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <path d="M9 4s2 2 3 2M15 4s-2 2-3 2M6 10h2M6 13h2M6 16h2M16 10h2M16 13h2M16 16h2" stroke="currentColor" stroke-width="2" />
    </>
  ),
  rock: (
    <>
      <path d="M12 3l8 5v8l-8 5l-8-5V8l8-5Z" fill="currentColor" />
      <path d="M12 3v18M4 8l16 8M4 16l16-8" stroke="#ffffff" stroke-width="2" opacity="0.3" />
    </>
  ),
  ghost: (
    <>
      <path d="M12 3a7 7 0 0 0-7 7v11l3.5-2l3.5 2l3.5-2l3.5 2V10a7 7 0 0 0-7-7Z" fill="currentColor" />
      <circle cx="9.5" cy="10.5" r="1.5" fill="#ffffff" />
      <circle cx="14.5" cy="10.5" r="1.5" fill="#ffffff" />
    </>
  ),
  dragon: (
    <>
      <path d="M12 3l9 4l-4 14l-5-4l-5 4l-4-14l9-4Z" fill="currentColor" />
      <path d="M12 7l4 4H8l4-4ZM12 11v6" stroke="#ffffff" stroke-width="2" />
    </>
  ),
  steel: (
    <>
      <rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor" />
      <circle cx="12" cy="12" r="4" fill="#ffffff" />
      <path d="M4 12h16" stroke="currentColor" stroke-width="2" />
    </>
  ),
  dark: <path d="M12 3a9 9 0 1 0 9 9c0-.7-.1-1.3-.2-2a7 7 0 0 1-6.8-7c0-.7.1-1.3.2-2c-.7-.1-1.4-.2-2.2-.2Z" fill="currentColor" />,
  fairy: (
    <>
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <path d="M12 7l1.5 3.5L17 12l-3.5 1.5L12 17l-1.5-3.5L7 12l3.5-1.5L12 7Z" fill="#ffffff" />
    </>
  ),
};

interface TypeBadgeProps {
  typeName: string;
  className?: string;
}

export default function TypeBadge({ typeName, className = '' }: TypeBadgeProps) {
  const normName = typeName.toLowerCase().trim();
  const typeKey = typeTranslation[normName] || 'normal';
  const svgContent = typeSvgs[typeKey] || typeSvgs.normal;

  const badgeStyle = {
    color: `var(--color-${typeKey})`,
    backgroundColor: `var(--color-${typeKey}-bg)`,
    borderColor: `var(--color-${typeKey})`,
  };

  return (
    <span className={`${styles.badge} ${className}`} style={badgeStyle}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {svgContent}
      </svg>
      {typeName}
    </span>
  );
}
