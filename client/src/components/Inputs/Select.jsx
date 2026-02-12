import React from 'react';
import styles from './Select.module.css';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Выберите...',
  error,
  disabled = false,
  required = false,
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
      
      <select
        className={`${styles.select} ${error ? styles.error : ''} ${!value ? styles.placeholder : ''}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Select;