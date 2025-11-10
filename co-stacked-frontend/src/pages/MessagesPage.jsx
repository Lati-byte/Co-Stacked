// src/pages/MessagesPage.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './MessagesPage.module.css';
import { ConversationList } from '../components/messaging/ConversationList';
import { ChatWindow } from '../components/messaging/ChatWindow';

import { fetchConversations, fetchMessages } from '../features/messages/messagesSlice';

const LoadingSpinner = () => <div className={styles.placeholder}><p>Loading conversations...</p></div>;

// --- NEW: A simple hook to detect mobile viewport ---
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

export const MessagesPage = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { user: currentUser } = useSelector(state => state.auth);
  const { 
    conversations, 
    messagesByConversation, 
    status: messagesStatus 
  } = useSelector(state => state.messages);
  
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  
  useEffect(() => {
    if (messagesStatus === 'idle') {
      dispatch(fetchConversations());
    }
  }, [messagesStatus, dispatch]);
  
  useEffect(() => {
    if (selectedConversationId && !messagesByConversation[selectedConversationId]) {
      dispatch(fetchMessages(selectedConversationId));
    }
  }, [selectedConversationId, messagesByConversation, dispatch]);

  // --- MODIFIED: Auto-select first conversation ONLY on desktop ---
  useEffect(() => {
    if (!isMobile && conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0]._id);
    }
  }, [conversations, selectedConversationId, isMobile]);


  if (!currentUser) {
    return <LoadingSpinner />;
  }
  
  // --- NEW: Function to handle going "back" on mobile ---
  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  const selectedConversation = conversations.find(c => c._id === selectedConversationId);
  const messages = messagesByConversation[selectedConversationId] || [];

  // --- NEW: Dynamically apply a class when a chat is active on mobile ---
  const pageContainerClass = `${styles.pageContainer} ${isMobile && selectedConversationId ? styles.chatActive : ''}`;
  
  return (
    <div className={pageContainerClass}>
      <div className={styles.conversationListWrapper}>
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          currentUserId={currentUser._id}
        />
      </div>
      <div className={styles.chatWindowWrapper}>
        {messagesStatus === 'loading' && !selectedConversation ? (
             <div className={styles.placeholder}><p>Loading...</p></div>
        ) : selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            currentUserId={currentUser._id}
            onBack={handleBackToList} // <-- Pass the back function here
          />
        ) : (
          <div className={styles.placeholder}>
            {conversations.length > 0
              ? <p>Select a conversation to start chatting.</p>
              : <p>You have no conversations yet.</p>
            }
          </div>
        )}
      </div>
    </div>
  );
};