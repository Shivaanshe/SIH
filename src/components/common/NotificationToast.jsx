import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast() {
  const { notifications, removeNotification } = useApp();

  if (!notifications.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: '100%'
    }}>
      {notifications.map(note => {
        const isEmerald = note.type === 'emerald';
        const isAmber = note.type === 'amber';
        const isRose = note.type === 'rose';

        const borderColor = isEmerald ? '#10b981' : isAmber ? '#f59e0b' : isRose ? '#f43f5e' : '#38bdf8';
        const Icon = isEmerald ? CheckCircle2 : isAmber ? AlertCircle : Info;

        return (
          <div
            key={note.id}
            className="glass-panel"
            style={{
              padding: '12px 16px',
              borderLeft: `4px solid ${borderColor}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              background: 'rgba(13, 21, 25, 0.95)',
              animation: 'slideUp 0.2s ease-out'
            }}
          >
            <Icon size={18} color={borderColor} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f1f5f9' }}>
                {note.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', wordBreak: 'break-word' }}>
                {note.message}
              </div>
            </div>
            <button
              onClick={() => removeNotification(note.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
