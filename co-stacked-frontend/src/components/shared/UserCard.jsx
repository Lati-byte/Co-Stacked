// src/components/shared/UserCard.jsx

import { Card } from './Card';
import { Tag } from './Tag';
import { Button } from './Button';
import { Avatar } from './Avatar';
import styles from './UserCard.module.css';
import PropTypes from 'prop-types';

export const UserCard = ({ user }) => {
  // Main guard clause to prevent crashes if the user prop is missing.
  if (!user) {
    return null;
  }

  // Guarantees `skills` is always an array, preventing errors with .slice() or .map().
  const skills = Array.isArray(user.skills) ? user.skills : [];

  return (
    <Card isInteractive={true} className={styles.card}>
      <div className={styles.header}>
        <Avatar 
          src={user.avatarUrl} 
          // POLISHED: A slightly more robust fallback for the avatar initial.
          fallback={(user.name || '?').charAt(0)} 
          alt={`${user.name || 'User'}'s avatar`} 
        />
        <div>
          <h3 className={styles.name}>{user.name || 'Unnamed User'}</h3>
          <p className={styles.role}>{user.role || 'No role specified'}</p>
        </div>
      </div>
      
      <p className={styles.bio}>
        {user.bio || 'This user has not added a bio yet.'}
      </p>
      
      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Top Skills</h4>
        <div className={styles.skillsContainer}>
          {skills.length > 0 ? (
            <>
              {skills.slice(0, 3).map(skill => <Tag key={skill}>{skill}</Tag>)}
              {skills.length > 3 && <Tag>+{skills.length - 3} more</Tag>}
            </>
          ) : (
            <p className={styles.noSkills}>No skills listed.</p>
          )}
        </div>
      </div>
      
      <div className={styles.footer}>
        <span className={styles.availability}>
          {user.availability || 'Availability not set'}
        </span>
        <Button to={`/users/${user._id}`} variant="secondary">View Profile</Button>
      </div>
    </Card>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    role: PropTypes.string,
    bio: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    availability: PropTypes.string,
    avatarUrl: PropTypes.string,
  }).isRequired
};