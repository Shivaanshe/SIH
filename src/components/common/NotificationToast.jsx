import React from 'react';
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
        const isExiting = Boolean(note.isExiting);

        return (
          <div
            key={note.id}
            onClick={() => removeNotification(note.id)}
            style={{
              padding: isExiting ? '0px 16px' : '14px 16px',
              borderLeft: isExiting ? '0px solid transparent' : `4px solid ${borderColor}`,
              border: isExiting ? 'none' : `1px solid rgba(255, 255, 255, 0.1)`,
              borderLeftColor: isExiting ? 'transparent' : borderColor,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              boxShadow: isExiting ? 'none' : '0 16px 36px rgba(0, 0, 0, 0.6)',
              background: 'rgba(13, 21, 25, 0.96)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
              pointerEvents: isExiting ? 'none' : 'auto',
              opacity: isExiting ? 0 : 1,
              transform: isExiting ? 'translateX(100%) scale(0.92)' : 'translateX(0) scale(1)',
              maxHeight: isExiting ? '0px' : '180px',
              marginBottom: isExiting ? '-10px' : '0px',
              animation: isExiting ? 'none' : 'toastSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, max-height 0.35s ease, padding 0.35s ease, margin 0.35s ease',
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

            {/* Close Button */}
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

            {/* Smooth Countdown Progress Bar */}
            {!isExiting && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '3px',
                  background: borderColor,
                  animation: 'toastProgress 3.8s linear forwards',
                  opacity: 0.6
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
