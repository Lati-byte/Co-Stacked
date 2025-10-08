// src/components/layout/AdminLayout.jsx
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader'; // <-- Import Header
import styles from './AdminLayout.module.css';

export const AdminLayout = ({ children }) => {
  return (
    <div className={styles.appLayout}>
      <AdminSidebar />
      {/* Create a wrapper for the right side that includes header and content */}
      <div className={styles.contentWrapper}>
        <AdminHeader />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
};