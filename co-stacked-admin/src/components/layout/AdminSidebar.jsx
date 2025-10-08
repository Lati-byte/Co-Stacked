// src/components/layout/AdminSidebar.jsx

import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../features/auth/adminAuthSlice';
import styles from './AdminSidebar.module.css';

// Import all necessary icons
import { LayoutDashboard, Users, Briefcase, Flag, LogOut } from 'lucide-react';
import logoSrc from '../../assets/logo.png'; 

// Define navigation items at the top level
const adminNavItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "User Management", href: "/users", icon: Users },
  { title: "Project Management", href: "/projects", icon: Briefcase },
  { title: "Content Moderation", href: "/reports", icon: Flag }, // Placeholder route
];

export const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handler for the logout button
  const handleLogout = () => {
    dispatch(logoutAdmin());
    // Redirect to the login page after logging out
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.header}>
        <img src={logoSrc} alt="CoStacked Admin Logo" className={styles.logoImage} />
        <span className={styles.logoText}>CoStacked Admin</span>
      </Link>
      
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {adminNavItems.map((item) => (
            <li key={item.href}>
              <NavLink 
                to={item.href} 
                // Using 'end' prop for the root dashboard link prevents it from
                // staying active when other routes are active (e.g., /users).
                end={item.href === '/'}
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                }
              >
                <item.icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
           {/* The logout button is now functional */}
           <button className={styles.navLink} onClick={handleLogout}>
             <LogOut size={20} />
             <span>Logout</span>
           </button>
        </div>
      </nav>
    </aside>
  );
};