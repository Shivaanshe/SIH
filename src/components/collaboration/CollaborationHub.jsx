import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  Trophy,
  Flame,
  Star,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CollaborationHub() {
  const { domainPack, addNotification } = useApp();
  const { collaborationItems, bookMentorshipSlot } = useData();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'Mentorship', 'Guest Lecture', 'Innovation Challenge'
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [submittedChallenges, setSubmittedChallenges] = useState(new Set());

  const items = (collaborationItems || []).filter(item => item.domainPack === domainPack);

  const filteredItems = activeTab === 'all'
    ? items
    : items.filter(i => i.type.toLowerCase().includes(activeTab.toLowerCase()));

  const handleBookSlot = (item) => {
    setBookedSlots(prev => new Set(prev).add(item.id));
    if (bookMentorshipSlot) bookMentorshipSlot(item.id);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    addNotification("Mentorship Confirmed", `Your 1-on-1 slot with ${item.mentorName} is confirmed. Calendar invitation sent.`, "emerald");
  };

  const handleJoinChallenge = (item) => {
    setSubmittedChallenges(prev => new Set(prev).add(item.id));
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    addNotification("Challenge Registered", `Team registration for "${item.title}" confirmed. Problem statement guidelines unlocked!`, "blue");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.45) 0%, rgba(15, 23, 42, 0.8) 100%)',
        borderLeft: '5px solid #38bdf8'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>🤝</span>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  Industry–Academia Collaborative Ecosystem
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Live 1-on-1 Industry Mentorship, Accredited Guest Lectures, Innovation Hackathons & Joint Capstones.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="glass-pill badge-blue" style={{ fontSize: '0.74rem' }}>
              ● Live Academic-Corporate Sync
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: 'All Collaboration Initiatives' },
          { id: 'mentorship', label: '1-on-1 Industry Mentorship' },
          { id: 'lecture', label: 'Guest Lectures & Seminars' },
          { id: 'challenge', label: 'Innovation Challenges' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {filteredItems.map(item => {
          const isBooked = bookedSlots.has(item.id);
          const isChallengeJoined = submittedChallenges.has(item.id);

          return (
            <div key={item.id} className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className={`glass-pill ${item.type === 'Mentorship' ? 'badge-emerald' : item.type === 'Guest Lecture' ? 'badge-blue' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                    {item.type}
                  </span>
                  {item.rating && (
                    <span style={{ fontSize: '0.76rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={13} fill="#fbbf24" /> {item.rating}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '6px' }}>
                  {item.title}
                </h3>

                <div style={{ fontSize: '0.82rem', color: '#38bdf8', marginBottom: '12px' }}>
                  {item.mentorName ? `${item.mentorName} • ${item.organization}` : item.speakerName ? `${item.speakerName} • ${item.organization}` : item.host}
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {item.description || item.problemStatement}
                </p>

                {/* Sub-details box */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.76rem'
                }}>
                  {item.slotsAvailable && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Slots Available:</span>
                      <strong style={{ color: '#34d399' }}>{item.slotsAvailable - (isBooked ? 1 : 0)} Seats Left</strong>
                    </div>
                  )}
                  {item.date && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
                      <strong style={{ color: '#e2e8f0' }}>{item.date}</strong>
                    </div>
                  )}
                  {item.prizePool && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Prize & Grants:</span>
                      <strong style={{ color: '#fbbf24' }}>{item.prizePool}</strong>
                    </div>
                  )}
                  {item.deadline && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Submission Deadline:</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.deadline}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                {item.type === 'Mentorship' && (
                  <button
                    onClick={() => handleBookSlot(item)}
                    disabled={isBooked}
                    className={`btn ${isBooked ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ width: '100%', fontSize: '0.82rem' }}
                  >
                    {isBooked ? (
                      <>
                        <CheckCircle size={14} color="#10b981" /> 1-on-1 Slot Confirmed
                      </>
                    ) : (
                      <>
                        <Users size={14} /> Book Mentorship Session
                      </>
                    )}
                  </button>
                )}

                {item.type === 'Guest Lecture' && (
                  <button
                    onClick={() => addNotification("Lecture Registered", "Webinar invite and calendar reminder added.", "blue")}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.82rem' }}
                  >
                    <Calendar size={14} /> Register for Live Webinar
                  </button>
                )}

                {item.type === 'Innovation Challenge' && (
                  <button
                    onClick={() => handleJoinChallenge(item)}
                    disabled={isChallengeJoined}
                    className={`btn ${isChallengeJoined ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ width: '100%', fontSize: '0.82rem', background: isChallengeJoined ? undefined : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                  >
                    {isChallengeJoined ? (
                      <>
                        <CheckCircle size={14} color="#10b981" /> Team Registered
                      </>
                    ) : (
                      <>
                        <Trophy size={14} /> Register Team for Challenge
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
