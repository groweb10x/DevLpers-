'use client';
import { useState } from 'react';
import Link from 'next/link';

const conversations = [
  { id: 1, name: 'Ahmed Store', role: 'Buyer', lastMsg: 'Can you start the project from Monday?', time: '2 min ago', unread: 2, online: true, avatar: 'A' },
  { id: 2, name: 'TechPak Ltd', role: 'Buyer', lastMsg: 'The design looks great! Please proceed.', time: '1 hr ago', unread: 0, online: true, avatar: 'T' },
  { id: 3, name: 'Sara Khan', role: 'Developer', lastMsg: 'I have sent the proposal, please check.', time: '3 hrs ago', unread: 1, online: false, avatar: 'S' },
  { id: 4, name: 'Hassan Co', role: 'Buyer', lastMsg: 'When will the first milestone be ready?', time: '1 day ago', unread: 0, online: false, avatar: 'H' },
  { id: 5, name: 'StartupX', role: 'Buyer', lastMsg: 'Thanks for the update!', time: '2 days ago', unread: 0, online: false, avatar: 'X' },
];

const messageData: Record<number, { from: string; text: string; time: string; mine: boolean }[]> = {
  1: [
    { from: 'Ahmed Store', text: 'Hi! I saw your profile and I am impressed with your work.', time: '10:00 AM', mine: false },
    { from: 'Me', text: 'Thank you! I would love to work on your project.', time: '10:05 AM', mine: true },
    { from: 'Ahmed Store', text: 'Great! Can you share your portfolio for e-commerce projects?', time: '10:08 AM', mine: false },
    { from: 'Me', text: 'Sure! I have built 5+ e-commerce platforms. Here is my portfolio link.', time: '10:12 AM', mine: true },
    { from: 'Ahmed Store', text: 'Excellent work! I want to discuss the project requirements.', time: '10:20 AM', mine: false },
    { from: 'Me', text: 'Of course, I am available for a call anytime today.', time: '10:22 AM', mine: true },
    { from: 'Ahmed Store', text: 'Can you start the project from Monday?', time: '10:30 AM', mine: false },
  ],
  2: [
    { from: 'TechPak Ltd', text: 'Hello, we need a mobile app developer.', time: '9:00 AM', mine: false },
    { from: 'Me', text: 'Hi! I specialize in React Native and Flutter.', time: '9:05 AM', mine: true },
    { from: 'TechPak Ltd', text: 'The design looks great! Please proceed.', time: '9:30 AM', mine: false },
  ],
  3: [
    { from: 'Sara Khan', text: 'Hi, I am looking for collaboration on a project.', time: 'Yesterday', mine: false },
    { from: 'Me', text: 'Sure, tell me more about it.', time: 'Yesterday', mine: true },
    { from: 'Sara Khan', text: 'I have sent the proposal, please check.', time: '8:00 AM', mine: false },
  ],
  4: [
    { from: 'Hassan Co', text: 'We need an AI chatbot for our website.', time: '2 days ago', mine: false },
    { from: 'Me', text: 'I have experience with GPT-4 integration.', time: '2 days ago', mine: true },
    { from: 'Hassan Co', text: 'When will the first milestone be ready?', time: '1 day ago', mine: false },
  ],
  5: [
    { from: 'StartupX', text: 'We loved your proposal!', time: '3 days ago', mine: false },
    { from: 'Me', text: 'Thank you! Looking forward to working together.', time: '3 days ago', mine: true },
    { from: 'StartupX', text: 'Thanks for the update!', time: '2 days ago', mine: false },
  ],
};

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState(messageData);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages(prev => ({
      ...prev,
      [activeChat]: [
        ...prev[activeChat],
        { from: 'Me', text: newMsg, time: 'Just now', mine: true },
      ],
    }));
    setNewMsg('');
  };

  const activeConvo = conversations.find(c => c.id === activeChat);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* NAVBAR */}
      <nav style={{
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px', flexShrink: 0,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)' }}>
            Dev<span style={{ color: 'var(--text)' }}>Market</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/dashboard">
            <button style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '8px 18px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
            }}>← Dashboard</button>
          </Link>
        </div>
      </nav>

      {/* CHAT LAYOUT */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT - Conversations */}
        <div style={{
          width: '320px', flexShrink: 0,
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          background: 'var(--card)',
        }}>
          {/* Search */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>
              💬 Messages
            </h2>
            <input
              placeholder="Search conversations..."
              style={{
                width: '100%', padding: '9px 12px',
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: '8px', color: 'var(--text)',
                fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Conversation List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map(convo => (
              <div key={convo.id} onClick={() => setActiveChat(convo.id)} style={{
                padding: '1rem',
                background: activeChat === convo.id ? 'rgba(108,99,255,0.08)' : 'transparent',
                borderLeft: activeChat === convo.id ? '3px solid var(--accent)' : '3px solid transparent',
                cursor: 'pointer', transition: 'all 0.15s',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne', fontWeight: 700,
                    }}>{convo.avatar}</div>
                    {convo.online && (
                      <div style={{
                        position: 'absolute', bottom: '1px', right: '1px',
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: 'var(--green)',
                        border: '2px solid var(--card)',
                      }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.88rem' }}>{convo.name}</span>
                      <span style={{ color: 'var(--muted)', fontSize: '0.72rem' }}>{convo.time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        color: 'var(--muted)', fontSize: '0.8rem',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        maxWidth: '160px',
                      }}>{convo.lastMsg}</span>
                      {convo.unread > 0 && (
                        <span style={{
                          background: 'var(--accent)', color: '#fff',
                          borderRadius: '50%', width: '18px', height: '18px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                        }}>{convo.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - Chat Window */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Chat Header */}
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            background: 'var(--card)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne', fontWeight: 700,
                }}>{activeConvo?.avatar}</div>
                {activeConvo?.online && (
                  <div style={{
                    position: 'absolute', bottom: '1px', right: '1px',
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: 'var(--green)', border: '2px solid var(--card)',
                  }} />
                )}
              </div>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem' }}>{activeConvo?.name}</div>
                <div style={{ fontSize: '0.75rem', color: activeConvo?.online ? 'var(--green)' : 'var(--muted)' }}>
                  {activeConvo?.online ? '● Online' : '● Offline'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--muted)', padding: '7px 14px',
                borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem',
              }}>📋 View Project</button>
              <button style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--muted)', padding: '7px 14px',
                borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem',
              }}>💰 Send Offer</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1.5rem',
            display: 'flex', flexDirection: 'column', gap: '1rem',
          }}>
            {messages[activeChat]?.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.mine ? 'flex-end' : 'flex-start',
              }}>
                <div style={{ maxWidth: '65%' }}>
                  <div style={{
                    padding: '10px 16px',
                    background: msg.mine ? 'var(--accent)' : 'var(--card)',
                    border: msg.mine ? 'none' : '1px solid var(--border)',
                    borderRadius: msg.mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    color: msg.mine ? '#fff' : 'var(--text)',
                    fontSize: '0.88rem', lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                  <div style={{
                    color: 'var(--muted)', fontSize: '0.72rem',
                    marginTop: '0.3rem',
                    textAlign: msg.mine ? 'right' : 'left',
                  }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border)',
            background: 'var(--card)',
            display: 'flex', gap: '0.75rem', alignItems: 'flex-end',
          }}>
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              style={{
                flex: 1, padding: '12px 16px',
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: '10px', color: 'var(--text)',
                fontSize: '0.9rem', outline: 'none',
              }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
            />
            <button style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--muted)', padding: '12px',
              borderRadius: '10px', cursor: 'pointer', fontSize: '1rem',
            }}>📎</button>
            <button onClick={sendMessage} style={{
              background: 'var(--accent)', border: 'none',
              color: '#fff', padding: '12px 20px',
              borderRadius: '10px', cursor: 'pointer',
              fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem',
            }}>Send →</button>
          </div>
        </div>
      </div>
    </div>
  );
}