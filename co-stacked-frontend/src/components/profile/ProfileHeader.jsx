// src/components/profile/ProfileHeader.jsx

import { Button } from '../shared/Button';
import { StarRating } from '../shared/StarRating';
import { Avatar } from '../shared/Avatar';
import styles from '../../pages/ProfilePage.module.css';
import verificationBadge from '../../assets/verification-badge.png';
import PropTypes from 'prop-types';
import { Edit } from 'lucide-react'; // Icon for the edit button

export const ProfileHeader = ({ 
  user, 
  isOwnProfile, 
  averageRating, 
  reviewCount,
  canLeaveReview, 
  onEdit, 
  onBoost, 
  onReview,
  onAvatarClick,
}) => (
  <div className={styles.header}>
    {/* Left side: Avatar */}
    <div className={styles.avatarWrapper}>
      <Avatar 
        src={user.avatarUrl} 
        fallback={(user.name || '?').charAt(0)}
        size="large" // Assumes your Avatar component can take 'large' prop
      />
      {isOwnProfile && (
        <button className={styles.avatarEditButton} onClick={onAvatarClick} aria-label="Change profile picture">
          <Edit size={16} />
        </button>
      )}
    </div>

    {/* Center: User Info */}
    <div className={styles.infoWrapper}>
      <div className={styles.nameWrapper}>
        <h1 className={styles.title}>{user.name}</h1>
        {user.isVerified && (
          <div className={styles.verifiedBadge} title="Verified User">
            <img src={verificationBadge} alt="Verification Badge" className={styles.badgeIcon} />
            <span>Verified</span>
          </div>
        )}
      </div>
      {user.role === 'developer' && reviewCount > 0 && (
        <div className={styles.aggregateRating}>
          <StarRating rating={averageRating} />
          <span>({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
        </div>
      )}
      <p className={styles.subtitle}>{user.role}</p>
    </div>
    
    {/* Right side: Action Buttons */}
    <div className={styles.headerActions}>
      {canLeaveReview && <Button onClick={onReview} variant="secondary">Leave a Review</Button>}
      {isOwnProfile && (
        <>
          <Button onClick={onBoost} variant="secondary">Boost Profile</Button>
          <Button onClick={onEdit}>Edit Profile</Button>
        </>
      )}
    </div>
  </div>
);

ProfileHeader.propTypes = {
  user: PropTypes.object.isRequired,
  isOwnProfile: PropTypes.bool.isRequired,
  averageRating: PropTypes.number,
  reviewCount: PropTypes.number,
  canLeaveReview: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onBoost: PropTypes.func.isRequired,
  onReview: PropTypes.func.isRequired,
  onAvatarClick: PropTypes.func.isRequired,
};