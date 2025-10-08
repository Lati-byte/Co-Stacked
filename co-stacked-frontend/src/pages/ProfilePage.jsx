// src/pages/ProfilePage.jsx

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../features/users/usersSlice'; // We'll need this to find other users
import styles from './ProfilePage.module.css';

// Import All Components Used on this Page
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { Tag } from '../components/shared/Tag';
import { ProjectCard } from '../components/shared/ProjectCard';
import { StarRating } from '../components/shared/StarRating';
import { ProfileBoostModal } from '../components/billing/ProfileBoostModal';
import { LeaveReviewModal } from '../components/reviews/LeaveReviewModal';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { ProfileEditor } from '../components/profile/ProfileEditor';
import { MapPin, Link as LinkIcon, CheckCircle } from 'lucide-react';

// Import ONLY the data needed for fallbacks/logic, not for display
import { mockProjects, mockInterests, mockReviews } from '../data/mock.js'; // Can be replaced by API calls later

const LoadingSpinner = () => <div className={styles.loader}>Loading profile...</div>;

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userId } = useParams(); // Get the ID from the URL, if it exists

  // Local UI state for modals
  const [isEditing, setIsEditing] = useState(false);
  const [isBoostModalOpen, setBoostModalOpen] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);

  // === DATA FETCHING & STATE MANAGEMENT FROM REDUX ===
  // Get the currently logged-in user from the auth slice
  const { user: loggedInUser } = useSelector(state => state.auth);
  // Get the public list of all users and the fetching status
  const { items: allUsers, status: usersStatus } = useSelector(state => state.users);
  
  // Fetch the user list if it's not already loaded (e.g., if user navigates here directly)
  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);
  
  // Determine which user profile to display and if it's our own
  const userToDisplay = userId ? allUsers.find(u => u._id === userId) : loggedInUser;
  const isOwnProfile = userToDisplay && loggedInUser && userToDisplay._id === loggedInUser._id;
  
  // === DATA FILTERING & DERIVED STATE ===
  const userProjects = userToDisplay?.role === 'founder'
    ? mockProjects.filter(project => project.founderId === userToDisplay._id) // using _id for real data
    : [];
  
  const approvedConnections = mockInterests.filter(
    interest => interest.status === 'approved' && 
                (interest.senderId === userToDisplay?._id || interest.receiverId === userToDisplay?._id)
  );

  const developerReviews = userToDisplay?.role === 'developer' 
    ? mockReviews.filter(r => r.developerId === userToDisplay._id) 
    : [];

  const averageRating = developerReviews.length > 0
    ? developerReviews.reduce((acc, r) => acc + r.rating, 0) / developerReviews.length
    : 0;

  const canLeaveReview = !isOwnProfile && loggedInUser?.role === 'founder' && userToDisplay?.role === 'developer'; // Simplified logic for now
  
  // === RENDER LOGIC ===
  if (usersStatus === 'loading' || !userToDisplay) {
    return (
      <div className={styles.pageContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <ProfileBoostModal user={userToDisplay} open={isBoostModalOpen} onClose={() => setBoostModalOpen(false)} />
      <LeaveReviewModal developer={userToDisplay} open={isReviewModalOpen} onClose={() => setReviewModalOpen(false)} />

      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          {isEditing && isOwnProfile ? (
            <ProfileEditor 
              user={userToDisplay} 
              onSave={() => setIsEditing(false)} 
              onCancel={() => setIsEditing(false)} 
            />
          ) : (
            <Card>
              <div className={styles.header}>
                <div>
                  <h1 className={styles.title}>{userToDisplay.name}</h1>
                  {userToDisplay.role === 'developer' && developerReviews.length > 0 && (
                    <div className={styles.aggregateRating}>
                      <StarRating rating={averageRating} />
                      <span>({developerReviews.length} {developerReviews.length === 1 ? 'review' : 'reviews'})</span>
                    </div>
                  )}
                  <p className={styles.subtitle}>{userToDisplay.role}</p>
                </div>
                
                <div className={styles.headerActions}>
                  {canLeaveReview && (
                    <Button onClick={() => setReviewModalOpen(true)} variant="secondary">Leave a Review</Button>
                  )}
                  {isOwnProfile && (
                    <>
                      <Button onClick={() => setBoostModalOpen(true)} variant="secondary">Boost Profile</Button>
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className={styles.content}>
                {/* Sections now use robust fallbacks for potentially empty data */}
                <div className={styles.section}><h3 className={styles.sectionTitle}>About Me:</h3><p>{userToDisplay.bio || 'No bio provided.'}</p></div>
                <div className={styles.section}><h3 className={styles.sectionTitle}>Skills:</h3><div className={styles.skillsContainer}>{(Array.isArray(userToDisplay.skills) && userToDisplay.skills.length > 0) ? userToDisplay.skills.map(s => <Tag key={s}>{s}</Tag>) : <p>No skills listed.</p>}</div></div>
                <div className={styles.infoGrid}><div className={styles.infoItem}><MapPin size={18}/><span>{userToDisplay.location || 'N/A'}</span></div><div className={styles.infoItem}><LinkIcon size={18}/><a href={userToDisplay.portfolioLink} target="_blank" rel="noopener noreferrer">Portfolio</a></div><p><strong>Availability:</strong> {userToDisplay.availability || 'N/A'}</p></div>
                
                {userProjects.length > 0 && (
                   <><div className={styles.separator} /><h2 className={styles.title}>Posted Projects</h2><div className={styles.projectsGrid}>{userProjects.map(p => <ProjectCard key={p.id} project={p}/>)}</div></>
                )}
                
                {developerReviews.length > 0 && (
                   <><div className={styles.separator} /><h2 className={styles.title}>Reviews</h2><div className={styles.reviewsGrid}>{developerReviews.map(r => <ReviewCard key={r.id} review={r}/>)}</div></>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};