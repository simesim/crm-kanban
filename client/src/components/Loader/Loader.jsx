import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ size = 'medium', color = '#007bff' }) => {
  return (
    <div className={styles.loaderContainer}>
      <div 
        className={`${styles.loader} ${styles[size]}`}
        style={{ borderTopColor: color }}
      />
    </div>
  );
};

export default Loader;