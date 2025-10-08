// src/components/dashboard/DeveloperDashboard.jsx

import { Link } from 'react-router-dom';
import styles from '../../pages/DashboardPage.module.css'; // Uses the shared dashboard styles
import { Card } from '../shared/Card';
import { ProjectCard } from '../shared/ProjectCard';
import { MessageSquare, Search, Eye, Star, Send } from 'lucide-react'; // Swapped Icon for consistency
import PropTypes from 'prop-types';

/**
 * A local, reusable sub-component for the dashboard's summary statistics cards.
 */
const StatCard = ({ title, value, description, Icon, to }) => {
  const cardContent = (
    <Card className={styles.statCardContent}>
      <div className={styles.statHeader}>
        <h3 className={styles.statCardTitle}>{title}</h3>
        <Icon size={16} color="var(--muted-foreground)" />
      </div>
      <p className={styles.statValue}>{value}</p>
      {description && <p className={styles.statDescription}>{description}</p>}
    </Card>
  );

  if (to) {
    return <Link to={to} className={styles.statCardLink}>{cardContent}</Link>;
  }
  return cardContent;
};

/**
 * The main UI component for the Developer's dashboard view.
 * It is a "presentational" component that receives all its data via props.
 */
export const DeveloperDashboard = ({ currentUser, sentItems }) => {
  // Derive the list of approved connections from the 'sentItems' prop.
  // This assumes 'sentItems' contains populated project data.
  const approvedConnections = sentItems.filter(i => i.status === 'approved');

  return (
    <>
      <h2 className={styles.title}>Developer Dashboard</h2>
      
      {/* --- Stat Cards Section --- */}
      <div className={styles.grid}>
        <StatCard to="/projects" title="Discover Projects" value="Browse Latest" Icon={Search} />
        <StatCard to="/my-applications" title="My Applications" value={sentItems.length} description="Track your sent requests" Icon={Send} />
        <StatCard to="/profile" title="Profile Views" value="28" description="(Mock data)" Icon={Eye} />
        <StatCard to="/profile" title="Your Reviews" value="3" description="(Mock data)" Icon={Star} />
      </div>

      {/* --- Active Collaborations Section --- */}
      {approvedConnections.length > 0 && (
        <>
          <div className={styles.separator} />
          <h3 className={styles.title}>Your Active Collaborations</h3>
          <div className={styles.grid}>
            {approvedConnections.map(connection => { 
              const project = connection.projectId; // Backend populates this object.
              
              // Defensive check to ensure project data exists before rendering.
              return project ? (
                // === THIS IS THE CRITICAL UPDATE ===
                // We pass the `connectionStatus` prop to the ProjectCard
                // to make it render a "Message" button instead of a "Connect" button.
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  connectionStatus="approved" 
                />
              ) : null; 
            })}
          </div>
        </>
      )}

      {/* --- Quick Actions Section --- */}
      <div className={styles.separator} />
      <h3 className={styles.title}>Quick Actions</h3>
      <div className={styles.grid}>
        <Card className={styles.quickActionCard}>
          <Link to="/profile">Update Your Profile</Link>
          <p>Keep your skills and bio fresh.</p>
        </Card>
        <Card className={styles.quickActionCard}>
          <Link to="/settings">Manage Settings</Link>
          <p>Adjust your notifications and visibility.</p>
        </Card>
      </div>
    </>
  );
};

// Add PropTypes for better type-checking and component documentation
DeveloperDashboard.propTypes = {
  currentUser: PropTypes.object.isRequired,
  sentItems: PropTypes.array.isRequired,
};