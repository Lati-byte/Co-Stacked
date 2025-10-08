// src/pages/MessagesPage.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './MessagesPage.module.css';
import { ConversationList } from '../components/messaging/ConversationList';
import { ChatWindow } from '../components/messaging/ChatWindow';

// Import the Redux actions we need
import { fetchConversations, fetchMessages } from '../features/messages/messagesSlice';

const LoadingSpinner = () => <div className={styles.placeholder}><p>Loading conversations...</p></div>;

export const MessagesPage = () => {
  const dispatch = useDispatch();

  // === GET LIVE DATA FROM REDUX ===
  const { user: currentUser } = useSelector(state => state.auth);
  const { 
    conversations, 
    messagesByConversation, 
    status: messagesStatus 
  } = useSelector(state => state.messages);
  
  // Local state to track which conversation is currently selected
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  
  // --- DATA FETCHING ---
  useEffect(() => {
    // When the page loads, fetch the list of conversations
    if (messagesStatus === 'idle') {
      dispatch(fetchConversations());
    }
  }, [messagesStatus, dispatch]);
  
  // When a conversation is selected for the first time, fetch its messages
  useEffect(() => {
    if (selectedConversationId && !messagesByConversation[selectedConversationId]) {
      dispatch(fetchMessages(selectedConversationId));
    }
  }, [selectedConversationId, messagesByConversation, dispatch]);

  // Set the first conversation as selected once the list has loaded
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0]._id);
    }
  }, [conversations, selectedConversationId]);


  if (!currentUser) {
    return <LoadingSpinner />; // Or a 'please login' message
  }

  // --- DERIVED STATE ---
  const selectedConversation = conversations.find(c => c._id === selectedConversationId);
  const messages = messagesByConversation[selectedConversationId] || [];
  
  return (
    <div className={styles.pageContainer}>
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
          />
        ) : (
          <div className={styles.placeholder}>
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};