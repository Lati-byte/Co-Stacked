// src/components/profile/ProfileHeader.jsx

import { Button } from '../shared/Button';
import { StarRating } from '../shared/StarRating';
import { Avatar } from '../shared/Avatar';
import styles from '../../pages/ProfilePage.module.css';
import verificationBadge from '../../assets/verification-badge.png';
import PropTypes from 'prop-types';
import { Edit, Share2 } from 'lucide-react';

export const ProfileHeader = ({ 
  user, 
  isOwnProfile, 
  averageRating, 
  reviewCount,
  onEdit, 
  onBoost, 
  onAvatarClick,
  onShare,
  copySuccess,
  connectionButton // <-- 1. Accept the new prop
}) => (
  <div className={styles.header}>
    <div className={styles.headerMain}>
      <div className={styles.avatarWrapper}>
        <Avatar 
          src={user.avatarUrl} 
          fallback={(user.name || '?').charAt(0)}
          size="large"
        />
        {isOwnProfile && (
          <button className={styles.avatarEditButton} onClick={onAvatarClick} aria-label="Change profile picture">
            <Edit size={16} />
          </button>
        )}
      </div>

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
    </div>
    
    <div className={styles.headerActions}>
      {/* --- 2. Render the dynamic connection button passed from the parent --- */}
      {connectionButton}

      <Button onClick={onShare} variant="secondary">
        <Share2 size={16} />
        <span>{copySuccess ? 'Copied!' : 'Share'}</span>
      </Button>
      
      {/*
        The "Leave a Review" button is removed from here because its logic is now tied
        to the connection status, which is handled by the parent ProfilePage.
      */}

      {isOwnProfile && (
        <>
          <Button onClick={onBoost} variant="secondary">Boost Profile</Button>
          <Button onClick={onEdit}>Edit Profile</Button>
        </>
      )}
    </div>
  </div>
);

// --- 3. UPDATE PropTypes ---
ProfileHeader.propTypes = {
  user: PropTypes.object.isRequired,
  isOwnProfile: PropTypes.bool.isRequired,
  averageRating: PropTypes.number,
  reviewCount: PropTypes.number,
  onEdit: PropTypes.func.isRequired,
  onBoost: PropTypes.func.isRequired,
  onAvatarClick: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  copySuccess: PropTypes.string,
  connectionButton: PropTypes.node, // The button can be a component node or null
};