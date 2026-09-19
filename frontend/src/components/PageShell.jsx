/**
 * Shared UI primitives used across all secondary pages.
 * Import from here to keep every page visually consistent.
 */

import { useState } from 'react';

/* ── Page wrapper ────────────────────────────────────────────────────────── */
export function PageShell({ children }) {
  return (
    <div
      className="page-scroll"
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'linear-gradient(160deg, #0a0414 0%, #0d0520 50%, #0a0414 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Top accent bar — full width */}
      <div style={{
        width: '100%', height: 3, flexShrink: 0,
        background: 'linear-gradient(90deg,#ff8c00,#ffd700,#ff69b4,#ffd700,#ff8c00)',
      }} />

      {/* Content — centered, max width, padded */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        padding: '20px 18px',
        paddingBottom: 'max(28px, env(safe-area-inset-bottom, 12px))',
        flex: 1,
      }}>
        {children}
      </div>
    </div>
  );
}

/* ── Page header with back button ────────────────────────────────────────── */
export function PageHeader({ icon, title, subtitle, onBack, right }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <button
        onClick={onBack}
        style={{
          width: 40, height: 40, borderRadius: 14, flexShrink: 0,
          background: 'rgba(255,215,0,0.08)',
          border: '1px solid rgba(255,215,0,0.25)',
          color: 'rgba(255,255,255,0.6)',
          fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.12s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#ffd700'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.25)'; }}
      >
        ←
      </button>
      <div className="flex-1">
        <h1 style={{ color: '#ffd700', fontSize: 20, fontWeight: 900, lineHeight: 1, margin: 0 }}>
          {icon} {title}
        </h1>
        {subtitle && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 3 }}>{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}

/* ── Section card ────────────────────────────────────────────────────────── */
export function SectionCard({ title, icon, children, accentColor = '#ffd700' }) {
  return (
    <div
      style={{
        borderRadius: 20,
        marginBottom: 12,
        overflow: 'hidden',
        border: `1px solid ${accentColor}1a`,
        background: 'rgba(255,255,255,0.03)',
      }}
    >
      {/* Section header */}
      <div style={{
        padding: '12px 16px 10px',
        background: `linear-gradient(90deg, ${accentColor}10, transparent)`,
        borderBottom: `1px solid ${accentColor}12`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ color: accentColor, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</span>
      </div>
      <div style={{ padding: '4px 0' }}>
        {children}
      </div>
    </div>
  );
}

/* ── Row inside a section ────────────────────────────────────────────────── */
export function SectionRow({ children, noBorder }) {
  return (
    <div style={{
      padding: '10px 16px',
      borderBottom: noBorder ? 'none' : '1px solid rgba(255,255,255,0.04)',
    }}>
      {children}
    </div>
  );
}

/* ── Gold primary button ─────────────────────────────────────────────────── */
export function GoldButton({ children, onClick, icon, style }) {
  const [p, setP] = useState(false);
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setP(true)}
      onPointerUp={() => setP(false)}
      onPointerLeave={() => { setP(false); setH(false); }}
      onPointerEnter={() => setH(true)}
      style={{
        width: '100%', padding: '15px 20px', borderRadius: 18,
        background: 'linear-gradient(135deg,#ffe566 0%,#ffd700 40%,#f59e0b 80%,#d97706 100%)',
        border: '1px solid rgba(255,255,255,0.3)',
        color: '#1a0800', fontSize: 17, fontWeight: 900, letterSpacing: '0.03em',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: h
          ? '0 0 50px rgba(255,200,0,0.6), 0 8px 32px rgba(255,140,0,0.4)'
          : '0 0 30px rgba(255,200,0,0.35), 0 4px 20px rgba(255,140,0,0.2)',
        transform: p ? 'scale(0.95) translateY(2px)' : h ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)',
        ...style,
      }}
    >
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      {children}
    </button>
  );
}

/* ── Orange secondary button ─────────────────────────────────────────────── */
export function OrangeButton({ children, onClick, icon }) {
  const [p, setP] = useState(false);
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setP(true)}
      onPointerUp={() => setP(false)}
      onPointerLeave={() => { setP(false); setH(false); }}
      onPointerEnter={() => setH(true)}
      style={{
        width: '100%', padding: '14px 20px', borderRadius: 18,
        background: 'linear-gradient(135deg,#ff9d2e 0%,#ff8c00 50%,#ea580c 100%)',
        border: '1px solid rgba(255,200,100,0.3)',
        color: '#fff', fontSize: 16, fontWeight: 800,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: h ? '0 0 40px rgba(255,120,0,0.5)' : '0 0 20px rgba(255,120,0,0.25)',
        transform: p ? 'scale(0.95)' : h ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      {children}
    </button>
  );
}

/* ── Glass back button ───────────────────────────────────────────────────── */
export function BackButton({ onClick, label = '← Back to Menu' }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerEnter={() => setH(true)}
      onPointerLeave={() => setH(false)}
      style={{
        width: '100%', padding: '13px', borderRadius: 16, marginTop: 4,
        background: h ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
        border: h ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.1)',
        color: h ? '#ffd700' : 'rgba(255,255,255,0.55)',
        fontSize: 14, fontWeight: 700, cursor: 'pointer',
        transition: 'all 0.15s ease',
        backdropFilter: 'blur(8px)',
      }}
    >
      {label}
    </button>
  );
}

/* ── Divider with center gem ─────────────────────────────────────────────── */
export function GemDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 my-4 ${className}`}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,215,0,0.3))' }} />
      <span style={{ color: '#ffd700', fontSize: 12 }}>◆</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(255,215,0,0.3))' }} />
    </div>
  );
}

/* ── Progress bar ─────────────────────────────────────────────────────────── */
export function ProgressBar({ value, max, color = '#ffd700' }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 999, width: `${pct}%`,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        boxShadow: `0 0 8px ${color}80`,
        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  );
}
