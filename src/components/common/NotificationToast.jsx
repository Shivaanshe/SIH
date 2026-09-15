import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast() {
  const { notifications, removeNotification } = useApp();

  if (!notifications.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: 'calc(100% - 48px)',
        pointerEvents: 'none'
      }}
    >
      {notifications.map((note) => {
        const isEmerald = note.type === 'emerald';
        const isAmber = note.type === 'amber';
        const isRose = note.type === 'rose';

        const borderColor = isEmerald ? '#10b981' : isAmber ? '#f59e0b' : isRose ? '#f43f5e' : '#38bdf8';
        const Icon = isEmerald ? CheckCircle2 : isAmber ? AlertCircle : Info;

        return (
          <div
            key={note.id}
            onClick={() => removeNotification(note.id)}
            style={{
              padding: '12px 16px',
              borderLeft: `4px solid ${borderColor}`,
              border: `1px solid rgba(255,255,255,0.1)`,
              borderLeftColor: borderColor,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              boxShadow: '0 16px 36px rgba(0,0,0,0.6)',
              background: 'rgba(13, 21, 25, 0.96)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
              pointerEvents: 'auto',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            title="Click to dismiss"
          >
            <Icon size={18} color={borderColor} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f1f5f9' }}>
                {note.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', wordBreak: 'break-word', lineHeight: 1.4 }}>
                {note.message}
              </div>
            </div>

            {/* Easy Click-to-Close Button with Generous Hit Area */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(note.id);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(244, 63, 94, 0.25)';
                e.currentTarget.style.color = '#f43f5e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
