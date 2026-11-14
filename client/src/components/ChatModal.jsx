import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const ChatModal = () => {
  const { activeChatUser, closeChat, messages, sendMessage, isUserOnline, sendTypingStatus, typingUsers } = useSocket();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const partnerId = activeChatUser?._id;
  const conversation = (partnerId && messages[partnerId]) || [];
  const isOnline = partnerId ? isUserOnline(partnerId) : false;
  const isTyping = partnerId ? typingUsers[partnerId] : false;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isTyping]);

  if (!activeChatUser) return null;

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(partnerId, inputText);
    setInputText('');
    sendTypingStatus(partnerId, false);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    sendTypingStatus(partnerId, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(partnerId, false);
    }, 1500);
  };

  return (
    <div style={styles.overlay} onClick={closeChat}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Chat Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatarWrapper}>
              {activeChatUser.avatar ? (
                <img src={activeChatUser.avatar} alt="" style={styles.avatar} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {activeChatUser.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <span
                style={{
                  ...styles.statusDot,
                  backgroundColor: isOnline ? '#10b981' : '#94a3b8',
                }}
                title={isOnline ? 'Online via WebSocket' : 'Offline'}
              />
            </div>
            <div>
              <div style={styles.partnerName}>{activeChatUser.name}</div>
              <div style={styles.statusText}>
                {isOnline ? 'Active now • Connected' : 'Offline • Direct Message'}
              </div>
            </div>
          </div>
          <button onClick={closeChat} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* Message Stream */}
        <div style={styles.messagesContainer}>
          {conversation.length === 0 ? (
            <div style={styles.emptyPrompt}>
              <span style={styles.waveIcon}>👋</span>
              <p style={styles.emptyTitle}>Say Hello to {activeChatUser.name}!</p>
              <p style={styles.emptySubtitle}>
                Connected via PassionX real-time WebSockets. Send a message to break the ice and discuss shared passions.
              </p>
            </div>
          ) : (
            conversation.map((msg) => {
              const isMe = msg.senderId === user?._id;
              return (
                <div
                  key={msg.id}
                  style={{
                    ...styles.messageRow,
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      ...styles.bubble,
                      backgroundColor: isMe ? '#0284c7' : '#ffffff',
                      color: isMe ? '#ffffff' : '#0f172a',
                      borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      boxShadow: isMe
                        ? '0 2px 8px rgba(2, 132, 199, 0.25)'
                        : '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <p style={styles.bubbleText}>{msg.text}</p>
                    <span
                      style={{
                        ...styles.time,
                        color: isMe ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          {isTyping && (
            <div style={styles.typingIndicator}>
              <span>{activeChatUser.name} is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} style={styles.inputForm}>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder={`Message ${activeChatUser.name}...`}
            style={styles.inputField}
            autoFocus
          />
          <button type="submit" style={styles.sendBtn} disabled={!inputText.trim()}>
            Send ✦
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  modal: {
    width: '100%',
    maxWidth: '460px',
    height: '560px',
    maxHeight: '90vh',
    backgroundColor: '#FAF8F5',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.22)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
  },
  header: {
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '16px',
  },
  statusDot: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid #ffffff',
  },
  partnerName: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0f172a',
  },
  statusText: {
    fontSize: '12px',
    color: '#64748b',
  },
  closeBtn: {
    background: '#f1f5f9',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    fontSize: '14px',
  },
  messagesContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#F5EFEB',
  },
  emptyPrompt: {
    margin: 'auto',
    textAlign: 'center',
    maxWidth: '280px',
  },
  waveIcon: {
    fontSize: '36px',
    display: 'block',
    marginBottom: '8px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 6px 0',
  },
  emptySubtitle: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: 1.5,
    margin: 0,
  },
  messageRow: {
    display: 'flex',
    width: '100%',
  },
  bubble: {
    maxWidth: '75%',
    padding: '10px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  bubbleText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: 1.45,
    wordBreak: 'break-word',
  },
  time: {
    fontSize: '10px',
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    fontSize: '12px',
    color: '#64748b',
    fontStyle: 'italic',
    padding: '4px 8px',
  },
  inputForm: {
    padding: '14px 18px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    outline: 'none',
  },
  sendBtn: {
    padding: '12px 18px',
    borderRadius: '12px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '13px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
};

export default ChatModal;
