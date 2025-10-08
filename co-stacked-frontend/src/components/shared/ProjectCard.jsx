// src/components/shared/ProjectCard.jsx
import PropTypes from 'prop-types';
import { Card } from './Card';
import { Tag } from './Tag';
import { Button } from './Button';
import styles from './ProjectCard.module.css';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react'; // For the 'Message' button icon

/**
 * A robust card component to display a summary of a project.
 * It is defensively coded to handle potentially incomplete project data.
 * It is also "connection-aware" and will change its main call-to-action button
 * based on the user's connection status with the project.
 */
export const ProjectCard = ({ project, connectionStatus }) => {
  // Main guard clause: If the project prop itself is missing, render nothing.
  if (!project) {
    return null;
  }

  // Guarantees `skills` is always an array, preventing errors with .slice() or .map().
  const skills = Array.isArray(project.skillsNeeded) ? project.skillsNeeded : [];

  return (
    <Card isInteractive={true}>
      <div className={styles.contentWrapper}>
        <h3 className={styles.title}>{project.title || 'Untitled Project'}</h3>
        <p className={styles.description}>{project.description || 'No description provided.'}</p>
        
        <div>
          <h4 className={styles.skillsTitle}>Skills Needed</h4>
          <div className={styles.tagsContainer}>
            {skills.length > 0 ? (
                skills.map((skill) => <Tag key={skill}>{skill}</Tag>)
            ) : (
                <p className={styles.noSkills}>No specific skills listed.</p>
            )}
          </div>
        </div>
        
        <div className={styles.detailsList}>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Compensation:</span> {project.compensation || 'N/A'}
          </p>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Stage:</span> {project.stage || 'N/A'}
          </p>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Founder:</span> {project.founder || 'N/A'}
          </p>
        </div>

        <div className={styles.footer}>
          <Button variant="secondary" to={`/projects/${project._id}`}>
            View Details
          </Button>

          {/* === THIS IS THE CRITICAL UPDATE === */}
          {/* We now conditionally render the main action button based on connection status */}
          {connectionStatus === 'approved' ? (
            // If already connected, show a button to the messages page
            <Button variant="primary" to="/messages">
              <MessageSquare size={16} className="mr-2"/>
              Message Founder
            </Button>
          ) : (
            // Otherwise, show the default "Connect" button that links to the project detail page
            <Button variant="primary" to={`/projects/${project._id}`}>
              Connect
            </Button>
          )}
          {/* ==================================== */}

        </div>
      </div>
    </Card>
  );
};

// Updated PropTypes for better documentation and error-checking.
ProjectCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    skillsNeeded: PropTypes.arrayOf(PropTypes.string),
    founder: PropTypes.string,
    compensation: PropTypes.string,
    stage: PropTypes.string,
  }).isRequired,
  // Add the new optional prop
  connectionStatus: PropTypes.string,
};