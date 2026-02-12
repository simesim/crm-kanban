import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false
}) => {
  return (
    <button
      type={type}
      className={`
        ${styles.button} 
        ${styles[variant]} 
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ''}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;