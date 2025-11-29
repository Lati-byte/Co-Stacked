// src/components/dashboard/DeveloperDashboard.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteInterest } from "../../features/interests/interestsSlice";
import styles from "../../pages/DashboardPage.module.css";
import { Card } from "../shared/Card";
import { ProjectCard } from "../shared/ProjectCard";
import { ConfirmationModal } from "../shared/ConfirmationModal";
import { MessageSquare, Search, Eye, Star, Send, UserPlus } from "lucide-react";
import PropTypes from "prop-types";

// This sub-component is self-contained and does not need changes.
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
    return (
      <Link to={to} className={styles.statCardLink}>
        {cardContent}
      </Link>
    );
  }
  return cardContent;
};

/**
 * The main UI component for the Developer's dashboard view.
 */
// --- THIS IS THE FIX ---
// Provide default empty arrays for props that are expected to be arrays.
// This prevents crashes if the props are momentarily undefined during render.
export const DeveloperDashboard = ({
  currentUser,
  sentItems = [],
  developerReviews = [],
}) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectionToDelete, setConnectionToDelete] = useState(null);

  const handleDeleteClick = (connection) => {
    setConnectionToDelete(connection);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (connectionToDelete) {
      dispatch(deleteInterest(connectionToDelete._id));
    }
    setIsModalOpen(false);
    setConnectionToDelete(null);
  };

  // This line is now safe because `sentItems` is guaranteed to be an array.
  const approvedConnections = sentItems.filter((i) => i.status === "approved");

  return (
    <>
      <ConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Cut Connection"
        message={`Are you sure you want to end your collaboration on the project "${connectionToDelete?.projectId.title}"? This cannot be undone.`}
        confirmText="Yes, Cut Connection"
        isDestructive={true}
      />

      <h2 className={styles.title}>Developer Dashboard</h2>

      <div className={styles.grid}>
        <StatCard
          to="/projects"
          title="Discover Projects"
          value="Browse Latest"
          Icon={Search}
        />
        <StatCard
          to="/my-applications"
          title="My Applications"
          value={sentItems.length}
          description="Track sent requests"
          Icon={Send}
        />
        <StatCard
          to="/profile"
          title="Profile Views"
          value={currentUser.profileViews || 0}
          description="Total views from other users"
          Icon={Eye}
        />
        <StatCard
          to="/profile"
          title="Your Reviews"
          value={developerReviews.length}
          description="Total feedback received"
          Icon={Star}
        />
      </div>

      {approvedConnections.length > 0 && (
        <>
          <div className={styles.separator} />
          <h3 className={styles.title}>Your Active Collaborations</h3>
          <div className={styles.grid}>
            {approvedConnections.map((connection) => {
              const project = connection.projectId;
              return project ? (
                <div key={connection._id}>
                  <ProjectCard project={project} connection={connection} />
                </div>
              ) : null;
            })}
          </div>
        </>
      )}

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

// Update PropTypes to reflect that some props are no longer strictly required,
// as the component provides its own default values.
DeveloperDashboard.propTypes = {
  currentUser: PropTypes.object.isRequired,
  sentItems: PropTypes.array,
  developerReviews: PropTypes.array,
};
