// frontend/src/pages/ProfilePage.jsx

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './ProfilePage.module.css';

// Import Redux Actions
import { fetchUsers, recordProfileView } from '../features/users/usersSlice';
import { fetchProjects } from '../features/projects/projectsSlice';
import { fetchReviewsForUser } from '../features/reviews/reviewsSlice';
import { fetchReceivedInterests } from '../features/interests/interestsSlice';

// Import All UI Components
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { Tag } from '../components/shared/Tag';
import { ProjectCard } from '../components/shared/ProjectCard';
import { StarRating } from '../components/shared/StarRating';
import { ProfileBoostModal } from '../components/billing/ProfileBoostModal';
import { LeaveReviewModal } from '../components/reviews/LeaveReviewModal';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { ProfileEditor } from '../components/profile/ProfileEditor';
import { MapPin, Link as LinkIcon } from 'lucide-react';
import verificationBadge from '../assets/verification-badge.png';

const LoadingSpinner = () => <div className={styles.loader}>Loading profile...</div>;

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isBoostModalOpen, setBoostModalOpen] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('not_connected'); // 'not_connected', 'pending', 'connected', 'request_received'
  const [isLoading, setIsLoading] = useState(false);

  const { user: loggedInUser } = useSelector(state => state.auth);
  const { items: allUsers, status: usersStatus } = useSelector(state => state.users);
  const { items: allProjects, status: projectsStatus } = useSelector(state => state.projects);
  const { reviewsByUser, status: reviewsStatus } = useSelector(state => state.reviews);
  const { receivedItems: founderConnections } = useSelector(state => state.interests);
  
  const userToDisplay = userId ? allUsers.find(u => u._id === userId) : loggedInUser;
  const isOwnProfile = userToDisplay && loggedInUser && userToDisplay._id === loggedInUser._id;

  // Fetch connection status
  useEffect(() => {
    const fetchConnectionStatus = async () => {
      if (!loggedInUser || !userToDisplay || isOwnProfile) return;
      
      try {
        const response = await fetch(`/api/connections/status/${userToDisplay._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setConnectionStatus(data.status);
        }
      } catch (error) {
        console.error('Error fetching connection status:', error);
      }
    };

    fetchConnectionStatus();
  }, [loggedInUser, userToDisplay, isOwnProfile]);

  // Data fetching effects
  useEffect(() => {
    if (usersStatus === 'idle') dispatch(fetchUsers());
    if (projectsStatus === 'idle') dispatch(fetchProjects());
    if (userToDisplay?._id) dispatch(fetchReviewsForUser(userToDisplay._id));
    if (loggedInUser?.role === 'founder') dispatch(fetchReceivedInterests());
  }, [userToDisplay?._id, usersStatus, projectsStatus, loggedInUser, dispatch]);
  
  // Record profile view
  useEffect(() => {
    if (userId && loggedInUser && userId !== loggedInUser._id) {
      dispatch(recordProfileView(userId));
    }
  }, [userId, loggedInUser, dispatch]);

  // Connection Handlers
  const sendConnectionRequest = async () => {
    if (!userToDisplay) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/connections/send', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ targetUserId: userToDisplay._id })
      });

      if (res.ok) {
        setConnectionStatus('pending');
      } else {
        const error = await res.json();
        console.error('Error sending connection request:', error.message);
      }
    } catch (e) {
      console.error("Error sending connection request", e);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptConnectionRequest = async () => {
    if (!userToDisplay) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/connections/accept', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ senderId: userToDisplay._id })
      });

      if (res.ok) {
        setConnectionStatus('connected');
      } else {
        const error = await res.json();
        console.error('Error accepting connection:', error.message);
      }
    } catch (e) {
      console.error("Error accepting connection", e);
    } finally {
      setIsLoading(false);
    }
  };

  const declineConnectionRequest = async () => {
    if (!userToDisplay) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/connections/decline', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ senderId: userToDisplay._id })
      });

      if (res.ok) {
        setConnectionStatus('not_connected');
      }
    } catch (e) {
      console.error("Error declining connection", e);
    } finally {
      setIsLoading(false);
    }
  };

  const removeConnection = async () => {
    if (!userToDisplay) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/connections/remove', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ targetUserId: userToDisplay._id })
      });

      if (res.ok) {
        setConnectionStatus('not_connected');
      }
    } catch (e) {
      console.error("Error removing connection", e);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSentRequest = async () => {
    if (!userToDisplay) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/connections/cancel', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ targetUserId: userToDisplay._id })
      });

      if (res.ok) {
        setConnectionStatus('not_connected');
      }
    } catch (e) {
      console.error("Error canceling request", e);
    } finally {
      setIsLoading(false);
    }
  };

  const developerReviews = reviewsByUser[userToDisplay?._id] || [];

  const userProjects = userToDisplay?.role === 'founder' 
    ? allProjects.filter(p => p.founderId === userToDisplay._id) 
    : [];

  const averageRating = developerReviews.length > 0 
    ? developerReviews.reduce((acc, r) => acc + r.rating, 0) / developerReviews.length
    : 0;

  const sharedConnections = founderConnections.filter(conn => 
    conn.senderId?._id === userToDisplay?._id && conn.status === 'approved'
  );
  const reviewableProjects = sharedConnections.filter(conn => 
    !developerReviews.some(review => review.projectId?._id === conn.projectId?._id)
  );
  const canLeaveReview = !isOwnProfile && loggedInUser?.role === 'founder' && userToDisplay?.role === 'developer' && reviewableProjects.length > 0;

  if (usersStatus === 'loading' || projectsStatus === 'loading' || reviewsStatus === 'loading' || !userToDisplay) {
    return <div className={styles.pageContainer}><LoadingSpinner /></div>;
  }

  const renderConnectionButton = () => {
    if (isOwnProfile) return null;

    switch (connectionStatus) {
      case 'connected':
        return (
          <div className={styles.connectionActions}>
            <Button disabled variant="secondary">Connected ✓</Button>
            <Button 
              onClick={removeConnection} 
              variant="outline" 
              disabled={isLoading}
            >
              Remove Connection
            </Button>
          </div>
        );
      
      case 'pending':
        return (
          <div className={styles.connectionActions}>
            <Button disabled variant="secondary">Request Sent</Button>
            <Button 
              onClick={cancelSentRequest} 
              variant="outline" 
              disabled={isLoading}
            >
              Cancel Request
            </Button>
          </div>
        );
      
      case 'request_received':
        return (
          <div className={styles.connectionActions}>
            <Button 
              onClick={acceptConnectionRequest} 
              variant="primary" 
              disabled={isLoading}
            >
              Accept Request
            </Button>
            <Button 
              onClick={declineConnectionRequest} 
              variant="outline" 
              disabled={isLoading}
            >
              Decline
            </Button>
          </div>
        );
      
      default: // not_connected
        return (
          <Button 
            onClick={sendConnectionRequest} 
            variant="primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Connect'}
          </Button>
        );
    }
  };

  return (
    <>
      <ProfileBoostModal user={userToDisplay} open={isBoostModalOpen} onClose={() => setBoostModalOpen(false)} />
      <LeaveReviewModal 
        developer={userToDisplay}
        reviewableProjects={reviewableProjects}
        open={isReviewModalOpen} 
        onClose={() => setReviewModalOpen(false)} 
      />

      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          {isEditing && isOwnProfile ? (
            <ProfileEditor user={userToDisplay} onSave={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
          ) : (
            <Card>
              {isOwnProfile && userToDisplay.isBoosted && new Date(userToDisplay.boostExpiresAt) > new Date() && (
                <div className={styles.boostBanner}>
                  Your profile is boosted until {formatDate(userToDisplay.boostExpiresAt)}.
                </div>
              )}

              <div className={styles.header}>
                <div>
                  <div className={styles.nameWrapper}>
                    <h1 className={styles.title}>{userToDisplay.name}</h1>
                    {userToDisplay.isVerified && (
                      <div className={styles.verifiedBadge} title="Verified User">
                        <img src={verificationBadge} alt="Verification Badge" className={styles.badgeIcon}/>
                        <span>Verified</span> 
                      </div>
                    )}
                  </div>
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
                    <Button onClick={() => setReviewModalOpen(true)} variant="secondary">
                      Leave a Review
                    </Button>
                  )}

                  {renderConnectionButton()}

                  {isOwnProfile && (
                    <>
                      <Button onClick={() => setBoostModalOpen(true)} variant="secondary">
                        Boost Profile
                      </Button>
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className={styles.content}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>About Me:</h3>
                  <p>{userToDisplay.bio || 'No bio provided.'}</p>
                </div>
                
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Skills:</h3>
                  <div className={styles.skillsContainer}>
                    {(Array.isArray(userToDisplay.skills) && userToDisplay.skills.length > 0) 
                      ? userToDisplay.skills.map(s => <Tag key={s}>{s}</Tag>) 
                      : <p>No skills listed.</p>
                    }
                  </div>
                </div>
                
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <MapPin size={18}/>
                    <span>{userToDisplay.location || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <LinkIcon size={18}/>
                    <a href={userToDisplay.portfolioLink} target="_blank" rel="noopener noreferrer">
                      Portfolio
                    </a>
                  </div>
                  <p><strong>Availability:</strong> {userToDisplay.availability || 'N/A'}</p>
                </div>
                
                {userProjects.length > 0 && (
                  <>
                    <div className={styles.separator} />
                    <h2 className={styles.title}>Posted Projects</h2>
                    <div className={styles.projectsGrid}>
                      {userProjects.map(p => <ProjectCard key={p._id} project={p}/>)}
                    </div>
                  </>
                )}
                
                {/* Testimonials Section - Hidden with CSS */}
                {developerReviews.length > 0 && (
                  <div className={styles.hiddenSection}>
                    <div className={styles.separator} />
                    <h2 className={styles.title}>Reviews</h2>
                    <div className={styles.reviewsGrid}>
                      {developerReviews.map(r => <ReviewCard key={r._id} review={r}/>)}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};
