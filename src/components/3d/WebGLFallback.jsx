import React from 'react';
import { Sparkles, Network } from 'lucide-react';

export default function WebGLFallback({ title = "KaushalSetu Interactive Skill Bridge", domainPack = "ayush" }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '340px',
      background: 'linear-gradient(135deg, rgba(7, 12, 14, 0.95) 0%, rgba(13, 21, 25, 0.95) 100%)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '30px'
    }}>
      {/* Decorative SVG Animated Constellation Bridge */}
      <svg width="100%" height="240" viewBox="0 0 600 240" style={{ maxWidth: '600px' }}>
        <defs>
          <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Curved Wave Lines */}
        <path d="M 80 120 Q 200 40, 300 120 T 520 120" fill="none" stroke="url(#bridgeGrad)" strokeWidth="3" filter="url(#glow)" strokeDasharray="6 4">
          <animate attributeName="stroke-dashoffset" values="0; 100" dur="8s" repeatCount="indefinite" />
        </path>
        <path d="M 80 120 Q 200 200, 300 120 T 520 120" fill="none" stroke="url(#bridgeGrad)" strokeWidth="2" opacity="0.6" strokeDasharray="8 6">
          <animate attributeName="stroke-dashoffset" values="100; 0" dur="10s" repeatCount="indefinite" />
        </path>

        {/* Academia Left Node */}
        <circle cx="80" cy="120" r="28" fill="#064e3b" stroke="#10b981" strokeWidth="3" filter="url(#glow)" />
        <text x="80" y="125" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">ACADEMIA</text>

        {/* Mid Diagnostic Nexus */}
        <circle cx="300" cy="120" r="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" filter="url(#glow)">
          <animate attributeName="r" values="22; 26; 22" dur="3s" repeatCount="indefinite" />
        </circle>
        <text x="300" y="124" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">KAUSHAL</text>

        {/* Industry Right Node */}
        <circle cx="520" cy="120" r="28" fill="#78350f" stroke="#f59e0b" strokeWidth="3" filter="url(#glow)" />
        <text x="520" y="125" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">INDUSTRY</text>
      </svg>

      <div style={{ textAlign: 'center', marginTop: '16px', zIndex: 2 }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '1rem', color: '#f1f5f9' }}>
          <Sparkles size={16} color="#10b981" /> {title}
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Reactive 2D High-Performance Fallback • Active Domain: <strong style={{ color: domainPack === 'ayush' ? '#10b981' : '#38bdf8' }}>{domainPack.toUpperCase()}</strong>
        </p>
      </div>
    </div>
  );
}
