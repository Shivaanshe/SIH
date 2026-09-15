import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, trend, color = 'emerald' }) {
  const colorMap = {
    emerald: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', text: '#34d399' },
    amber: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', text: '#fbbf24' },
    blue: { bg: 'rgba(56, 189, 248, 0.1)', border: 'rgba(56, 189, 248, 0.25)', text: '#38bdf8' },
    rose: { bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.25)', text: '#fb7185' }
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            background: scheme.bg,
            border: `1px solid ${scheme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: scheme.text
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: '800', lineHeight: 1 }}>{value}</h2>
        {trend && (
          <span style={{ fontSize: '0.78rem', color: scheme.text, fontWeight: '700' }}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
