// src/components/messaging/ChatWindow.jsx

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage } from '../../features/messages/messagesSlice';
import styles from './ChatWindow.module.css';
import { Avatar } from '../shared/Avatar';
import { Button } from '../shared/Button';
import { Textarea } from '../shared/Textarea';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * The main chat interface component.
 * Displays messages for a selected conversation and handles sending new messages.
 */
export const ChatWindow = ({ conversation, messages = [], currentUserId, onBack }) => {
  const dispatch = useDispatch();
  const { sendState } = useSelector((state) => state.messages);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        {/* Back button for mobile view */}
        <button className={styles.backButton} onClick={onBack} aria-label="Back to conversations">
          <ArrowLeft size={22} />
        </button>
        
        {/* Display avatar and user info */}
        {otherParticipant && (
          <>
            <Avatar src={otherParticipant.avatarUrl} fallback={(otherParticipant.name || '?').charAt(0)} size="small" />
            <div className={styles.headerInfo}>
              <p className={styles.userName}>{otherParticipant.name}</p>
              <p className={styles.userRole}>{otherParticipant.role}</p>
            </div>
          </>
        )}
      </header>

      <div className={styles.messageList}>
        {messages.map(msg => {
          const isMyMessage = msg.sender?._id === currentUserId;
          return (
            // --- UPDATED BUBBLE LOGIC ---
            <div
              key={msg._id}
              className={`${styles.messageRow} ${isMyMessage ? styles.myMessageRow : styles.theirMessageRow}`}
            >
              <div className={`${styles.messageBubble} ${isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble}`}>
                <p className={styles.messageText}>{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className={styles.footer}>
        <Textarea 
          placeholder="Type your message..." 
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
        />
        <Button type="submit" disabled={sendState === 'loading'}>
          {sendState === 'loading' ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </form>
    </div>
  );
};

ChatWindow.propTypes = {
  conversation: PropTypes.object.isRequired,
  messages: PropTypes.array,
  currentUserId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};