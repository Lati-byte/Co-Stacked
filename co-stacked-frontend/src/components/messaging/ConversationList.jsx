// src/components/messaging/ConversationList.jsx

import styles from './ConversationList.module.css';
import PropTypes from 'prop-types';
import { Avatar } from '../shared/Avatar';

export const ConversationList = ({ conversations, selectedConversationId, onSelectConversation, currentUserId }) => {
  // DEBUG LOG 1: What does the full `conversations` array look like?
  console.log("ConversationList received conversations:", conversations);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Conversations</h2>
      </header>
      
      <div className={styles.list}>
        {conversations.length > 0 ? (
          conversations.map((convo, index) => {
            // DEBUG LOG 2: Look at each individual conversation object.
            console.log(`--- Iteration ${index} ---`);
            console.log("Processing conversation:", convo);
            console.log("Current user ID:", currentUserId);

            const otherParticipant = convo.participants.find(p => p._id !== currentUserId);

            // DEBUG LOG 3: What did our `.find()` method produce? Is it a user object or undefined?
            console.log("Found other participant:", otherParticipant);
            
            // Defensive check
            if (!otherParticipant) {
              // DEBUG LOG 4: If it's undefined, this log will tell us exactly which conversation failed.
              console.error("CRITICAL ERROR: Could not find the other participant in this conversation:", convo);
              return null; // Skip rendering this broken conversation
            }
            
            // DEBUG LOG 5: Check if the name property exists before trying to use it.
            if (!otherParticipant.name) {
                console.error("CRITICAL ERROR: The participant object is missing a 'name' property:", otherParticipant);
                return null; // Skip this one too
            }

            const isActive = convo._id === selectedConversationId;

            return (
              <button
                key={convo._id}
                className={`${styles.convoItem} ${isActive ? styles.active : ''}`}
                onClick={() => onSelectConversation(convo._id)}
              >
                <Avatar 
                  src={otherParticipant.avatarUrl} 
                  fallback={otherParticipant.name.charAt(0)} // The line that might crash
                  alt={`${otherParticipant.name}'s avatar`}
                />
                <div className={styles.convoDetails}>
                  <p className={styles.userName}>{otherParticipant.name}</p>
                  <p className={styles.lastMessage}>{convo.lastMessage || 'Click to view conversation'}</p>
                </div>
              </button>
            );
          })
        ) : (
          <p className={styles.emptyState}>You have no conversations yet.</p>
        )}
      </div>
    </div>
  );
};

// ... (PropTypes)

// PropTypes for component validation and documentation.
ConversationList.propTypes = {
  conversations: PropTypes.array.isRequired,
  selectedConversationId: PropTypes.string, // Can be null if no conversation is selected
  onSelectConversation: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired,
};