// src/components/dashboard/FounderDashboard.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteInterest } from '../../features/interests/interestsSlice';
import styles from '../../pages/DashboardPage.module.css'; // Uses the shared dashboard styles

// Import all necessary UI Components
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { InterestRequestCard } from '../shared/InterestRequestCard';
import { BoostModal } from '../billing/BoostModal';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { ConnectionCard } from './ConnectionCard';
import { Bell, Briefcase, MessageSquare, Search, Rocket } from 'lucide-react';
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

// Helper function to format dates nicely for the UI
const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

/**
 * The main UI component for the Founder's dashboard view.
 */
// --- UPDATED: Removed the unused `activeConversations` prop ---
export const FounderDashboard = ({ currentUser, interests, userProjects }) => {
  const dispatch = useDispatch();
  
  const [isBoostModalOpen, setBoostModalOpen] = useState(false);
  const [projectToBoost, setProjectToBoost] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [connectionToDelete, setConnectionToDelete] = useState(null);

  const handleBoostClick = (project) => {
    setProjectToBoost(project);
    setBoostModalOpen(true);
  };
  
  const handleDisconnectClick = (connection) => {
    setConnectionToDelete(connection);
    setIsDeleteModalOpen(true);
  };

  const confirmDisconnect = () => {
    if (connectionToDelete) {
      dispatch(deleteInterest(connectionToDelete._id));
    }
    setIsDeleteModalOpen(false);
    setConnectionToDelete(null);
  };
  
  const incomingInterests = interests.filter(i => i.status === "pending");
  const approvedConnections = interests.filter(i => i.status === "approved");

  return (
    <>
      <BoostModal project={projectToBoost} open={isBoostModalOpen} onClose={() => setBoostModalOpen(false)} />
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDisconnect}
        title="Cut Connection"
        message={`Are you sure you want to end the collaboration with "${connectionToDelete?.senderId.name}"? This action cannot be undone.`}
        confirmText="Yes, Cut Connection"
      />
      
      <h2 className={styles.title}>Founder Dashboard</h2>
      
      <div className={styles.grid}>
        <StatCard to="/requests" title="Pending Interests" value={`${incomingInterests.length} New`} Icon={Bell} />
        <StatCard to="/my-projects" title="My Projects" value={`${userProjects.length} Active`} Icon={Briefcase} />
        <StatCard to="/messages" title="Active Connections" value={`${approvedConnections.length} Active`} Icon={MessageSquare} />
        <StatCard to="/users" title="Find Talent" value="Search Now" Icon={Search} />
      </div>
      
      {incomingInterests.length > 0 && (
        <>
          <div className={styles.separator} />
          <h3 className={styles.title}>Incoming Interest Requests</h3>
          <div className={styles.grid}>
            {incomingInterests.map(interest => <InterestRequestCard key={interest._id} interest={interest} viewerRole="founder"/>)}
          </div>
        </>
      )}

      {approvedConnections.length > 0 && (
        <>
          <div className={styles.separator} />
          <h3 className={styles.title}>Your Active Collaborations</h3>
          <div className={styles.grid}>
            {approvedConnections.map(connection => (
              <ConnectionCard 
                key={connection._id}
                connection={connection}
                onDisconnect={() => handleDisconnectClick(connection)}
              />
            ))}
          </div>
        </>
      )}

      {userProjects.length > 0 && (
        <>
          <div className={styles.separator} />
          <h3 className={styles.title}>Your Projects</h3>
          <div className={styles.projectList}>
            {userProjects.map(project => {
              const isBoostedActive = project.isBoosted && new Date(project.boostExpiresAt) > new Date();
              return (
                <Card key={project._id} className={styles.projectCard}>
                  <div>
                    <p className={styles.projectTitle}>{project.title}</p>
                    {isBoostedActive ? (
                      <p className={styles.boostStatus}>
                        <Rocket size={14} />
                        Boosted until {formatDate(project.boostExpiresAt)}
                      </p>
                    ) : (
                      <p className={styles.projectStatus}>Status: Live</p>
                    )}
                  </div>
                  <div className={styles.projectActions}>
                    <Button variant="secondary" to={`/projects/edit/${project._id}`}>Manage</Button>
                    <Button variant="primary" onClick={() => handleBoostClick(project)}>Boost Project</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <div className={styles.separator} />
      <h3 className={styles.title}>Quick Actions</h3>
      <div className={styles.grid}>
          <Card className={styles.quickActionCard}><Link to="/post-project">Post a New Project</Link><p>Share your next big idea.</p></Card>
          <Card className={styles.quickActionCard}><Link to="/users">Discover Developers</Link><p>Find talent for your projects.</p></Card>
      </div>
    </>
  );
};

// --- UPDATED: Removed the unused `activeConversations` prop type ---
FounderDashboard.propTypes = {
  currentUser: PropTypes.object.isRequired,
  interests: PropTypes.array.isRequired,
  userProjects: PropTypes.array.isRequired,
};