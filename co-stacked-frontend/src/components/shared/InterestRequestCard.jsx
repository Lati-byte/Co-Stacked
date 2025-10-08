// src/components/shared/InterestRequestCard.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Redux action for responding to requests
import { respondToInterest } from '../../features/interests/interestsSlice';

// Reusable UI components
import { Card } from './Card';
import { Button } from './Button';
import { Avatar } from './Avatar';

// Icons and utility functions
import { Loader2, Check, X, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Component-specific styles
import styles from './InterestRequestCard.module.css';

/**
 * A multi-purpose card for displaying an interest request.
 * It changes its appearance and available actions based on the request's `status`
 * and the `viewerRole` prop ('founder' or 'developer').
 */
export const InterestRequestCard = ({ interest, viewerRole = 'founder' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Subscribe to the global status for interest-related actions to show loading states
  const { status: interestActionStatus } = useSelector((state) => state.interests);

  // Destructure all necessary data from the interest object prop.
  // The backend populates these nested objects for us.
  const { senderId: sender, projectId: project, receiverId: founder, status, timestamp, _id: interestId } = interest;
  
  // Handler to dispatch the approve/reject action
  const handleResponse = (responseStatus) => {
    dispatch(respondToInterest({ interestId, status: responseStatus }));
  };
  
  // Handler to navigate to the messaging page
  const handleMessageClick = () => {
    navigate('/messages');
  };

  // Safely format the timestamp, with a fallback
  const timeAgo = timestamp
    ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    : 'a moment ago';
  
  // Guard clause to prevent rendering if backend data is incomplete
  if (!sender || !project || !founder) {
    return <Card className={styles.card}><p>Loading interest details...</p></Card>;
  }

  // Determine the card's text content based on who is viewing it
  const cardTitle = viewerRole === 'founder'
    ? sender.name
    : `Request for: ${project.title}`;
    
  const cardDescription = viewerRole === 'founder'
    ? `is interested in: ${project.title}`
    : `Sent to: ${founder.name}`;

  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <Avatar 
          src={viewerRole === 'founder' ? sender.avatarUrl : founder.avatarUrl} 
          fallback={(viewerRole === 'founder' ? sender.name : founder.name).charAt(0)}
          alt="User avatar" 
        />
        <div>
          <h3 className={styles.title}>{cardTitle}</h3>
          <p className={styles.description}>{cardDescription}</p>
        </div>
      </header>
      
      <div className={styles.content}>
        Sent {timeAgo}
      </div>
      
      <footer className={styles.footer}>
        {status === 'pending' && viewerRole === 'founder' ? (
          // --- Case 1: Founder's view of a pending request ---
          <>
            <Button onClick={() => handleResponse('rejected')} variant="secondary" className={styles.rejectButton} disabled={interestActionStatus === 'loading'}>
              {interestActionStatus === 'loading' ? <Loader2 className={styles.loader} /> : <X size={16} />}Decline
            </Button>
            <Button onClick={() => handleResponse('approved')} variant="primary" disabled={interestActionStatus === 'loading'}>
              {interestActionStatus === 'loading' ? <Loader2 className={styles.loader} /> : <Check size={16} />}Approve
            </Button>
          </>
        ) : status === 'approved' ? (
          // --- Case 2: Request is approved (for both founder and developer) ---
          <Button onClick={handleMessageClick} variant="primary">
            <MessageSquare size={16} className="mr-2"/>Message
          </Button>
        ) : (
          // --- Case 3: Request is rejected (or another status) ---
          <div className={`${styles.statusBadge} ${styles[status] || styles.rejected}`}>
            <X size={16} /> Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )}
      </footer>
    </Card>
  );
};

// Component prop validation
InterestRequestCard.propTypes = {
  interest: PropTypes.object.isRequired,
  viewerRole: PropTypes.oneOf(['founder', 'developer']),
};