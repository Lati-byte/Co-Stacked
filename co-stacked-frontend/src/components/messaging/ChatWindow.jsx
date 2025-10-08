// src/components/messaging/ChatWindow.jsx

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage } from '../../features/messages/messagesSlice';
import styles from './ChatWindow.module.css';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { Send, Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * The main chat interface component.
 * Displays messages for a selected conversation and handles sending new messages.
 */
export const ChatWindow = ({ conversation, messages = [], currentUserId }) => {
  const dispatch = useDispatch();
  const { sendState } = useSelector((state) => state.messages);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scrolling logic
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

  // Find the other user in the conversation for display purposes.
  // The backend now populates this array with user objects.
  const otherParticipant = conversation.participants.find(p => p._id !== currentUserId);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.userName}>{otherParticipant?.name || 'Conversation'}</p>
      </header>

      <div className={styles.messageArea}>
        {messages.map(msg => {
          // --- THIS IS THE CRITICAL FIX ---
          // Because the backend now sends a populated sender object, we must check
          // the `_id` property *inside* that object.
          // Optional chaining (`?.`) prevents a crash if `msg.sender` is unexpectedly null.
          const isSender = msg.sender?._id === currentUserId;
          
          return (
            <div key={msg._id} className={`${styles.messageBubble} ${isSender ? styles.sender : styles.receiver}`}>
              {msg.text}
            </div>
          );
        })}
        {/* An empty div at the end of the list acts as a reliable target for auto-scrolling */}
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

// Prop validation remains the same
ChatWindow.propTypes = {
  conversation: PropTypes.object.isRequired,
  messages: PropTypes.array,
  currentUserId: PropTypes.string.isRequired,
};