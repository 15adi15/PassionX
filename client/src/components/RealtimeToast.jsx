import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

const RealtimeToast = () => {
  const { toastNotification, clearToast, openChat } = useSocket();

  useEffect(() => {
    if (!toastNotification) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 6000);
    return () => clearTimeout(timer);
  }, [toastNotification, clearToast]);

  if (!toastNotification) return null;

  return (
    <div style={styles.toast}>
      <div style={styles.content}>
        {toastNotification.avatar ? (
          <img src={toastNotification.avatar} alt="" style={styles.avatar} />
        ) : (
          <span style={styles.icon}>
            {toastNotification.type === 'message' ? '💬' : '✦'}
          </span>
        )}
        <div style={styles.textCol}>
          <div style={styles.title}>{toastNotification.title}</div>
          <div style={styles.body}>{toastNotification.body}</div>
        </div>
      </div>

      <div style={styles.actions}>
        {toastNotification.sender && (
          <button
            onClick={() => {
              openChat(toastNotification.sender);
              clearToast();
            }}
            style={styles.replyBtn}
          >
            Reply
          </button>
        )}
        <button onClick={clearToast} style={styles.closeBtn}>
          ✕
        </button>
      </div>
    </div>
  );
};

const styles = {
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    borderRadius: '16px',
    padding: '14px 18px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    maxWidth: '380px',
    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    backdropFilter: 'blur(12px)',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #38bdf8',
  },
  icon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  textCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflow: 'hidden',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f8fafc',
  },
  body: {
    fontSize: '13px',
    color: '#94a3b8',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '220px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  replyBtn: {
    padding: '6px 12px',
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '4px',
  },
};

export default RealtimeToast;

