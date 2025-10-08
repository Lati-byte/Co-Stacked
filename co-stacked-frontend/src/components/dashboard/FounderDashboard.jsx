// src/components/dashboard/FounderDashboard.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../pages/DashboardPage.module.css'; // Uses the shared dashboard styles

// Import all necessary UI Components
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { InterestRequestCard } from '../shared/InterestRequestCard';
import { BoostModal } from '../billing/BoostModal';
import { Bell, Briefcase, MessageSquare, Search } from 'lucide-react';
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
 * The main UI component for the Founder's dashboard view.
 * It is a "presentational" component that receives all its data and state via props
 * from the main DashboardPage.
 */
export const FounderDashboard = ({ currentUser, interests, userProjects, activeConversations }) => {
  // Local state to manage the visibility of the Boost modal
  const [isBoostModalOpen, setBoostModalOpen] = useState(false);
  // Local state to track which project is being boosted
  const [projectToBoost, setProjectToBoost] = useState(null);

  const handleBoostClick = (project) => {
    setProjectToBoost(project);
    setBoostModalOpen(true);
  };
  
  // Derive the list of pending requests from the 'interests' prop
  const incomingInterests = interests.filter(i => i.status === "pending");

  return (
    <>
      {/* The BoostModal is ready to be shown when its state is toggled */}
      <BoostModal project={projectToBoost} open={isBoostModalOpen} onClose={() => setBoostModalOpen(false)} />
      
      <h2 className={styles.title}>Founder Dashboard</h2>
      
      {/* --- Stat Cards Section --- */}
      <div className={styles.grid}>
        <StatCard to="/requests" title="Pending Interests" value={`${incomingInterests.length} New`} Icon={Bell} />
        <StatCard to="/my-projects" title="My Projects" value={`${userProjects.length} Active`} Icon={Briefcase} />
        <StatCard to="/messages" title="Messages" value={`${activeConversations.length} Active`} Icon={MessageSquare} />
        <StatCard to="/users" title="Find Talent" value="Search Now" Icon={Search} />
      </div>
      
      {/* --- Incoming Requests Section --- */}
      {incomingInterests.length > 0 && (
          <>
            <div className={styles.separator} />
            <h3 className={styles.title}>Incoming Interest Requests</h3>
            <div className={styles.grid}>
                {incomingInterests.map(interest => <InterestRequestCard key={interest._id} interest={interest} viewerRole="founder"/>)}
            </div>
          </>
      )}

      {/* --- Your Projects Section --- */}
      {userProjects.length > 0 && (
          <>
            <div className={styles.separator} />
            <h3 className={styles.title}>Your Projects</h3>
            <div className={styles.projectList}>
                {userProjects.map(project => (
                    <Card key={project._id} className={styles.projectCard}>
                        <div>
                            <p className={styles.projectTitle}>{project.title}</p>
                            <p className={styles.projectStatus}>Status: Live</p>
                        </div>
                        <div className={styles.projectActions}>
                            <Button variant="secondary" to={`/projects/edit/${project._id}`}>Manage</Button>
                            <Button variant="primary" onClick={() => handleBoostClick(project)}>Boost Project</Button>
                        </div>
                    </Card>
                ))}
            </div>
          </>
      )}

      {/* --- Quick Actions Section --- */}
      <div className={styles.separator} />
      <h3 className={styles.title}>Quick Actions</h3>
      <div className={styles.grid}>
          <Card className={styles.quickActionCard}><Link to="/post-project">Post a New Project</Link><p>Share your next big idea.</p></Card>
          <Card className={styles.quickActionCard}><Link to="/users">Discover Developers</Link><p>Find talent for your projects.</p></Card>
      </div>
    </>
  );
};

// PropTypes for better type-checking and component documentation
FounderDashboard.propTypes = {
  currentUser: PropTypes.object.isRequired,
  interests: PropTypes.array.isRequired,
  userProjects: PropTypes.array.isRequired,
  activeConversations: PropTypes.array.isRequired,
};