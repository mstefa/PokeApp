import React from 'react';
import styles from './Icon.module.css';

const icons: Record<string, React.ReactNode> = {
  menu: (
    <>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" strokeWidth="3" />
      <line x1="4" y1="18" x2="16" y2="18" />
    </>
  ),
  chevron: <polyline points="6 9 12 15 18 9" />,
  back: (
    <>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </>
  ),
  forward: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  pokedex: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="3" fill="none" />
      <line x1="9" y1="6" x2="15" y2="6" strokeWidth="3" />
      <circle cx="9" cy="12" r="1.5" fill="currentColor" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" />
      <line x1="9" y1="16" x2="15" y2="16" />
      <line x1="9" y1="18" x2="13" y2="18" />
    </>
  ),
  backpack: (
    <>
      <path d="M6 10V20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20V10" fill="none" />
      <path d="M6 10H18V7C18 5.89543 17.1046 5 16 5H8C6.89543 5 6 5.89543 6 7V10Z" fill="none" />
      <path d="M12 2V5" />
      <path d="M9 14H15" />
      <path d="M12 11V17" />
    </>
  ),
  arena: (
    <>
      <path d="M14.5 17.5L3 6M3 6L6 3M3 6L4.5 11.5L9.5 9.5" />
      <path d="M9.5 6.5L21 18M21 18L18 21M21 18L19.5 12.5L14.5 14.5" />
      <circle cx="12" cy="12" r="3" strokeDasharray="2,2" />
    </>
  ),
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: 'menu' | 'chevron' | 'back' | 'forward' | 'pokedex' | 'backpack' | 'arena';
  size?: number;
}

export default function Icon({ name, size = 24, className = '', ...props }: IconProps) {
  const svgContent = icons[name];
  if (!svgContent) return null;

  return (
    <svg
      className={`${styles.icon} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {svgContent}
    </svg>
  );
}
