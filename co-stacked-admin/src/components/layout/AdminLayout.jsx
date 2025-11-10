// src/components/layout/AdminLayout.jsx

import { useState } from 'react'; // <-- 1. Import useState
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import styles from './AdminLayout.module.css';
import PropTypes from 'prop-types';

export const AdminLayout = ({ children }) => {
  // --- 2. Add state to manage the sidebar's visibility on mobile ---
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // --- 3. Create a function to toggle the sidebar's state ---
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className={styles.appLayout}>
      {/* --- 4. Pass state and close function to the Sidebar --- */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className={styles.contentWrapper}>
        {/* --- 5. Pass the toggle function to the Header --- */}
        <AdminHeader onToggleSidebar={toggleSidebar} />
        
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

// Add prop validation for children
AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};