import React from 'react';
import styles from './TextArea.module.css';

const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  rows = 4,
  fullWidth = false,
  ...props
}) => {
  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <textarea
        className={`${styles.textarea} ${error ? styles.error : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        {...props}
      />
      
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default TextArea;