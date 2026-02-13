import React, { useState } from 'react';
import styles from './Layout.module.css';

const Layout = ({ children, headerContent, sidebarContent }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button className={styles.menuButton} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          ☰
        </button>
        <div className={styles.headerContent}>
          {headerContent || 'Header'}
        </div>
      </header>
      
      <div className={styles.mainContainer}>
        <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.closed : ''}`}>
          <div className={styles.sidebarContent}>
            {sidebarContent || 'Sidebar Content'}
          </div>
        </aside>
        
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; // ВАЖНО: default export!