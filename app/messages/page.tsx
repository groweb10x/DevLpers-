'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
};

type Profile = {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
};

export default function Messages() {
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Fetch user and conversations
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);
      await fetchConversations(user.id);
      setLoading(false);
    };
    init();
  }, []);

  // URL mein ?with=developer_id hai toh direct open karo
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const withId = params.get('with');
  if (withId && user) {
    setActiveChat(withId);
    fetchMessages(user.id, withId);
  }
}, [user]);

  const fetchConversations = async (userId: string) => {
    // Get all messages involving this user
    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (!msgs) return;

    // Get unique conversation partners
    const partnerIds = [...new Set(msgs.map((m: Message) =>
      m.sender_id === userId ? m.receiver_id : m.sender_id
    ))];

    // Fetch profiles of partners
    const { data: profiles } = await supabase
      .from('developer_profiles')
      .select('user_id, full_name, avatar_url')
      .in('user_id', partnerIds);

    // Build conversation list
    const convos = partnerIds.map(partnerId => {
      const partnerMsgs = msgs.filter((m: Message) =>
        m.sender_id === partnerId || m.receiver_id === partnerId
      );
      const lastMsg = partnerMsgs[0];
      const profile = profiles?.find((p: Profile) => p.user_id === partnerId);
      const unread = partnerMsgs.filter((m: Message) =>
        m.sender_id === partnerId && m.receiver_id === userId
      ).length;

      return {
        partnerId,
        name: profile?.full_name || 'Unknown User',
        avatar: profile?.full_name?.[0]?.toUpperCase() || '?',
        avatarUrl: profile?.avatar_url || null,
        lastMsg: lastMsg?.message || '',
        time: lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        unread,
      };
    });

    setConversations(convos);
    if (convos.length > 0 && !activeChat) {
      setActiveChat(convos[0].partnerId);
      fetchMessages(userId, convos[0].partnerId);
    }
  };

  const fetchMessages = async (userId: string, partnerId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`
      )
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  // Real-time subscription
  useEffect(() => {
    if (!user || !activeChat) return;

    const channel = supabase
      .channel(`messages-${user.id}-${activeChat}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`,
      }, (payload) => {
        const newMessage = payload.new as Message;
        if (newMessage.sender_id === activeChat) {
          setMessages(prev => [...prev, newMessage]);
          // Update conversation list
          setConversations(prev => prev.map(c =>
            c.partnerId === activeChat
              ? { ...c, lastMsg: newMessage.message, time: new Date(newMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              : c
          ));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, activeChat]);

  const handleSelectChat = async (partnerId: string) => {
    setActiveChat(partnerId);
    if (user) await fetchMessages(user.id, partnerId);
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !user || !activeChat || sending) return;
    setSending(true);

    const msgData = {
      sender_id: user.id,
      receiver_id: activeChat,
      message: newMsg.trim(),
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(msgData)
      .select()
      .single();

    if (!error && data) {
      setMessages(prev => [...prev, data]);
      setConversations(prev => prev.map(c =>
        c.partnerId === activeChat
          ? { ...c, lastMsg: newMsg.trim(), time: 'Just now' }
          : c
      ));
    }

    setNewMsg('');
    setSending(false);
  };

  const activeConvo = conversations.find(c => c.partnerId === activeChat);
  const filteredConvos = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#95979d' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading messages...</p>
      </div>
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>

      {/* NAVBAR */}
      <nav style={{
        background: '#ffffff',
        borderBottom: '1px solid #e4e5e7',
        padding: isMobile ? '0 1rem' : '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px', flexShrink: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#1dbf73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>D</div>
          <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.2rem', color: '#404145' }}>
            Dev<span style={{ color: '#1dbf73' }}>Lpers</span>
          </span>
        </Link>
        <Link href="/dashboard">
          <button style={{ background: '#fff', border: '1px solid #e4e5e7', color: '#404145', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500 }}>
            ← Dashboard
          </button>
        </Link>
      </nav>

      {/* CHAT LAYOUT */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT - Conversations */}
        <div style={{
          width: isMobile ? '100%' : '300px', flexShrink: 0,
          borderRight: '1px solid #e4e5e7',
          display: 'flex', flexDirection: 'column',
          background: '#fff',
        }}>
          {/* Header */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e4e5e7' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '0.75rem' }}>
              💬 Messages
            </h2>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              style={{
                width: '100%', padding: '9px 12px',
                background: '#fafafa', border: '1px solid #e4e5e7',
                borderRadius: '8px', color: '#404145',
                fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Conversation List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConvos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#95979d' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💬</div>
                <p style={{ fontSize: '0.85rem' }}>No conversations yet</p>
                <p style={{ fontSize: '0.78rem', marginTop: '0.5rem' }}>
                  Messages from clients will appear here
                </p>
              </div>
            ) : (
              filteredConvos.map(convo => (
                <div key={convo.partnerId} onClick={() => handleSelectChat(convo.partnerId)} style={{
                  padding: '0.85rem 1.25rem',
                  background: activeChat === convo.partnerId ? '#f0fdf4' : '#fff',
                  borderLeft: activeChat === convo.partnerId ? '3px solid #1dbf73' : '3px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s',
                  borderBottom: '1px solid #e4e5e7',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      {convo.avatarUrl ? (
                        <img src={convo.avatarUrl} alt={convo.name}
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '50%',
                          background: '#1dbf73', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '1rem',
                        }}>{convo.avatar}</div>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#404145' }}>{convo.name}</span>
                        <span style={{ color: '#95979d', fontSize: '0.72rem' }}>{convo.time}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          color: '#95979d', fontSize: '0.8rem',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          maxWidth: '160px',
                        }}>{convo.lastMsg}</span>
                        {convo.unread > 0 && (
                          <span style={{
                            background: '#1dbf73', color: '#fff',
                            borderRadius: '50%', width: '18px', height: '18px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                          }}>{convo.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT - Chat Window */}
        {activeChat ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa' }}>

            {/* Chat Header */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e4e5e7',
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {activeConvo?.avatarUrl ? (
                  <img src={activeConvo.avatarUrl} alt={activeConvo.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: '#1dbf73', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1rem',
                  }}>{activeConvo?.avatar}</div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#404145' }}>{activeConvo?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#1dbf73' }}>● Active</div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '1.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
            }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto', color: '#95979d' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
                  <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Start the conversation!</p>
                  <p style={{ fontSize: '0.85rem' }}>Send a message to {activeConvo?.name}</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id || i} style={{
                      display: 'flex',
                      justifyContent: isMine ? 'flex-end' : 'flex-start',
                    }}>
                      <div style={{ maxWidth: isMobile ? '85%' : '60%' }}>
                        <div style={{
                          padding: '10px 16px',
                          background: isMine ? '#1dbf73' : '#fff',
                          border: isMine ? 'none' : '1px solid #e4e5e7',
                          borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          color: isMine ? '#fff' : '#404145',
                          fontSize: '0.88rem', lineHeight: 1.5,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        }}>
                          {msg.message}
                        </div>
                        <div style={{
                          color: '#95979d', fontSize: '0.7rem',
                          marginTop: '0.3rem',
                          textAlign: isMine ? 'right' : 'left',
                          padding: '0 4px',
                        }}>{formatTime(msg.created_at)}</div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid #e4e5e7',
              background: '#fff',
              display: 'flex', gap: '0.75rem', alignItems: 'center',
            }}>
              <input
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={`Message ${activeConvo?.name || ''}...`}
                style={{
                  flex: 1, padding: '12px 16px',
                  background: '#fafafa', border: '1px solid #e4e5e7',
                  borderRadius: '10px', color: '#404145',
                  fontSize: '0.9rem', outline: 'none',
                }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
              />
              <button onClick={sendMessage} disabled={sending || !newMsg.trim()} style={{
                background: sending || !newMsg.trim() ? '#a7f3d0' : '#1dbf73',
                border: 'none', color: '#fff',
                padding: '12px 22px', borderRadius: '10px',
                cursor: sending || !newMsg.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap',
              }}>
                {sending ? '⏳' : 'Send →'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
            <div style={{ textAlign: 'center', color: '#95979d' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
              <h3 style={{ fontWeight: 700, color: '#404145', marginBottom: '0.5rem' }}>Your Messages</h3>
              <p style={{ fontSize: '0.88rem' }}>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}