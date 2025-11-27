// src/components/notifications/NotificationItem.jsx

import { Link } from 'react-router-dom';
import styles from './NotificationDropdown.module.css';
import PropTypes from 'prop-types';

// This component uses a named export, which is correct.
export const NotificationItem = ({ notification }) => {
  let message = '';
  let linkTo = '/dashboard';

  // The optional chaining (?.) prevents crashes if sender or projectId is null.
  switch (notification.type) {
    case 'NEW_INTEREST':
      message = `${notification.sender?.name || 'Someone'} showed interest in your project: "${notification.projectId?.title || 'a project'}"`;
      linkTo = '/requests';
      break;
    case 'INTEREST_APPROVED':
      message = `Your request for "${notification.projectId?.title || 'a project'}" was approved!`;
      linkTo = '/messages';
      break;
    case 'INTEREST_REJECTED':
      message = `Your request for "${notification.projectId?.title || 'a project'}" was declined.`;
      linkTo = '/my-applications';
      break;
    case 'NEW_MESSAGE':
      message = `You have a new message from ${notification.sender?.name || 'Someone'}.`;
      linkTo = '/messages';
      break;
    case 'SUBSCRIPTION_SUCCESS':
      message = 'Your subscription was successful! Your profile is now verified.';
      linkTo = '/settings';
      break;
    case 'BOOST_SUCCESS':
      if (notification.projectId) {
        message = `Your project "${notification.projectId.title}" has been successfully boosted.`;
        linkTo = '/my-projects';
      } else {
        message = 'Your profile has been successfully boosted!';
        linkTo = '/profile';
      }
      break;
    case 'NEW_REVIEW':
      message = `${notification.sender?.name || 'A founder'} left you a new review.`;
      linkTo = '/profile';
      break;
    default:
      message = 'You have a new notification.';
  }

  return (
    <Link to={linkTo} className={styles.notificationItem}>
      <div className={styles.dot}></div>
      <p>{message}</p>
    </Link>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
};