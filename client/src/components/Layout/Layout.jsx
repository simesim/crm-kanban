<<<<<<< HEAD
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ padding: 16, borderRight: "1px solid #ddd" }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>CRM Kanban</div>
        <nav style={{ display: "grid", gap: 8 }}>
          <Link to="/boards">Boards</Link>
        </nav>
      </aside>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
=======
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
>>>>>>> d5d5f61172c5e1fe8eed093fc2836c1e8e898903
