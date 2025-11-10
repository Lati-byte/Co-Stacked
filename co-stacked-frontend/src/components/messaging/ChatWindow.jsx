// src/components/messaging/ChatWindow.jsx

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage } from '../../features/messages/messagesSlice';
import styles from './ChatWindow.module.css';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
// --- NEW: Import ArrowLeft for the back button ---
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * The main chat interface component.
 * Displays messages for a selected conversation and handles sending new messages.
 */
// --- NEW: Added 'onBack' prop for mobile navigation ---
export const ChatWindow = ({ conversation, messages = [], currentUserId, onBack }) => {
  const dispatch = useDispatch();
  const { sendState } = useSelector((state) => state.messages);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(sendMessage({ conversationId: conversation._id, text }));
    setText('');
  };

  const otherParticipant = conversation.participants.find(p => p._id !== currentUserId);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* --- NEW: Back button for mobile view --- */}
        <button className={styles.backButton} onClick={onBack} aria-label="Back to conversations">
          <ArrowLeft size={22} />
        </button>
        {/* You could add an avatar here later if you have one */}
        <p className={styles.userName}>{otherParticipant?.name || 'Conversation'}</p>
      </header>

      <div className={styles.messageArea}>
        {messages.map(msg => {
          const isSender = msg.sender?._id === currentUserId;
          return (
            <div key={msg._id} className={`${styles.messageBubble} ${isSender ? styles.sender : styles.receiver}`}>
              {msg.text}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className={styles.footer}>
        <Input 
          placeholder="Type your message..." 
          className={styles.messageInput}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" disabled={sendState === 'loading'}>
          {sendState === 'loading' ? (
            <Loader2 size={18} className={styles.loader} />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </form>
    </div>
  );
};

// --- NEW: Added prop validation for 'onBack' ---
ChatWindow.propTypes = {
  conversation: PropTypes.object.isRequired,
  messages: PropTypes.array,
  currentUserId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};