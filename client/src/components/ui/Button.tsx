import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  isBouncy?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  isBouncy = true,
  className = '',
  ...props
}: ButtonProps) {
  const buttonClass = [
    isBouncy ? styles.btnBouncy : '',
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}
