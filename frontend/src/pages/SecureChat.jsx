import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// ─── Bias Audit Badge ─────────────────────────────────────────────────────────
function BiasAuditBadge({ text }) {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const runAudit = async () => {
    if (status === 'loading') return;
    setStatus('loading');
    setExpanded(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/api/audit/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setResult(data.audit);
        setStatus('done');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const severityColor = {
    none: '#22c55e',
    low: '#84cc16',
    medium: '#f59e0b',
    high: '#ef4444',
  };

  return (
    <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
      {status === 'idle' && (
        <button
          onClick={runAudit}
          title="Check this reply for bias using AI Ethics Auditor"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(110,60,188,0.4)',
            background: 'rgba(110,60,188,0.1)',
            color: '#a78bfa',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer',
            letterSpacing: '0.02em',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(110,60,188,0.25)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(110,60,188,0.1)'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          Audit Reply for Bias
        </button>
      )}

      {status === 'loading' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', opacity: 0.6 }}>
          <span style={{
            display: 'inline-block', width: '12px', height: '12px',
            border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#a78bfa',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          Running bias audit...
        </div>
      )}

      {status === 'error' && (
        <p style={{ fontSize: '0.78rem', color: '#f87171', margin: 0 }}>⚠️ Audit failed — check backend connection.</p>
      )}

      {status === 'done' && result && (
        <div
          style={{
            marginTop: '8px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: result.is_biased ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
            border: `1px solid ${result.is_biased ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
            fontSize: '0.82rem',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '700', color: result.is_biased ? '#f87171' : '#4ade80' }}>
              {result.is_biased ? '⚠️ Bias Detected' : '✅ No Bias Detected'}
            </span>
            {result.bias_type && result.bias_type !== 'none' && (
              <span style={{
                padding: '2px 10px',
                borderRadius: '20px',
                background: 'rgba(167,139,250,0.15)',
                color: '#c4b5fd',
                fontSize: '0.72rem',
                fontWeight: '600',
                textTransform: 'capitalize',
              }}>
                {result.bias_type}
              </span>
            )}
            {result.severity && result.severity !== 'none' && (
              <span style={{
                padding: '2px 10px',
                borderRadius: '20px',
                background: `${severityColor[result.severity]}22`,
                color: severityColor[result.severity] || '#fff',
                fontSize: '0.72rem',
                fontWeight: '600',
                textTransform: 'uppercase',
              }}>
                {result.severity}
              </span>
            )}
          </div>
          {result.explanation && (
            <p style={{ margin: 0, opacity: 0.8, lineHeight: '1.5' }}>{result.explanation}</p>
          )}
          <button
            onClick={() => { setStatus('idle'); setResult(null); setExpanded(false); }}
            style={{ marginTop: '8px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="sc-msg sc-msg--ai">
      <div className="sc-avatar sc-avatar--ai">AI</div>
      <div className="sc-bubble sc-bubble--typing">
        <span className="sc-dot" />
        <span className="sc-dot" />
        <span className="sc-dot" />
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Message({ msg }) {
  const isUser = msg.role === 'user';

  if (msg.role === 'blocked') {
    return (
      <div className="sc-alert">
        <div className="sc-alert-header">
          <span className="sc-alert-icon">🛡</span>
          <span>ShadowVault Blocked This Request</span>
          <span className={`sc-badge sc-badge--${msg.level}`}>{msg.level?.toUpperCase()}</span>
        </div>
        <p className="sc-alert-body">{msg.description}</p>
        <div className="sc-alert-meta">
          <span>Risk Score: <b style={{ color: '#f97316' }}>{msg.score}/100</b></span>
          {msg.threats?.length > 0 && (
            <span>Vectors: <b>{msg.threats.join(', ')}</b></span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`sc-msg ${isUser ? 'sc-msg--user' : 'sc-msg--ai'}`}>
      {!isUser && <div className="sc-avatar sc-avatar--ai">AI</div>}
      <div className={`sc-bubble ${isUser ? 'sc-bubble--user' : 'sc-bubble--ai'}`}>
        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
        {!isUser && msg.score !== undefined && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#10b981', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem' }}>
            🛡️ Safety Rating: {msg.score}/100 (Safe)
          </div>
        )}
        {/* ── Bias Audit Badge — only for AI replies ── */}
        {!isUser && msg.content && (
          <BiasAuditBadge text={msg.content} />
        )}
        <div className="sc-timestamp">{msg.time}</div>
      </div>
      {isUser && <div className="sc-avatar sc-avatar--user">U</div>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SecureChat() {
  const location = useLocation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hello! I'm your ShadowVault-secured AI assistant. Every message you send is scanned by the dual-layer defense engine before reaching the AI. Ask me anything!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [scanStatus, setScanStatus] = useState({ text: 'Shields Active', color: '#22c55e' });
  const [inputFocused, setInputFocused] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle initial message from Dashboard
  useEffect(() => {
    if (location.state?.initialMessage) {
      const initialText = location.state.initialMessage;
      const sendInitial = async (text) => {
        setMessages(prev => [...prev, { role: 'user', content: text, time: now() }]);
        setIsTyping(true);
        setScanStatus({ text: 'Scanning...', color: '#f59e0b' });

        try {
          const formData = new FormData();
          formData.append('prompt', text);
          formData.append('history', JSON.stringify([]));

          const res = await fetch(`${API_URL}/api/secure-chat`, {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) throw new Error('Backend error');

          const data = await res.json();
          setIsTyping(false);

          if (data.status === 'blocked') {
            setScanStatus({ text: 'Threat Blocked', color: '#ef4444' });
            setMessages(prev => [...prev, {
              role: 'blocked',
              level: data.risk_score > 85 ? 'critical' : 'high',
              description: data.message,
              score: data.risk_score,
              threats: data.threats_found || [],
              time: now(),
            }]);
          } else {
            setScanStatus({ text: 'Safe — Executed with Gemini', color: '#3b82f6' });
            setMessages(prev => [...prev, { role: 'ai', content: data.reply, score: data.risk_score, time: now() }]);
          }
          setTimeout(() => setScanStatus({ text: 'Shields Active', color: '#22c55e' }), 3000);
        } catch (err) {
          setIsTyping(false);
          setScanStatus({ text: 'Backend Offline', color: '#ef4444' });
        }
      };

      sendInitial(initialText);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', content: text, time: now() }]);
    setInput('');
    setIsTyping(true);
    setScanStatus({ text: 'Scanning...', color: '#f59e0b' });

    try {
      const history = messages
        .filter(m => m.role === 'user' || m.role === 'ai')
        .map(m => ({ role: m.role, content: m.content }));

      const formData = new FormData();
      formData.append('prompt', text || '');
      formData.append('history', JSON.stringify(history || []));

      const res = await fetch(`${API_URL}/api/secure-chat`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Backend error:', res.status, errorText);
        setIsTyping(false);
        setScanStatus({ text: 'Backend Error', color: '#ef4444' });
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `⚠️ Backend error (${res.status}): ${errorText}`,
          time: now(),
        }]);
        return;
      }

      const data = await res.json();
      setIsTyping(false);

      if (data.status === 'blocked') {
        setScanStatus({ text: 'Threat Blocked', color: '#ef4444' });
        setMessages(prev => [...prev, {
          role: 'blocked',
          level: data.risk_score > 85 ? 'critical' : data.risk_score > 60 ? 'high' : 'medium',
          description: data.message,
          score: data.risk_score,
          threats: data.threats_found || [],
          time: now(),
        }]);
        setTimeout(() => setScanStatus({ text: 'Shields Active', color: '#22c55e' }), 3000);
        return;
      }

      setScanStatus({ text: 'Safe — Executed with Gemini', color: '#3b82f6' });
      setMessages(prev => [...prev, { role: 'ai', content: data.reply, score: data.risk_score, time: now() }]);
      setTimeout(() => setScanStatus({ text: 'Shields Active', color: '#22c55e' }), 3000);

    } catch (err) {
      setIsTyping(false);
      setScanStatus({ text: 'Backend Offline', color: '#ef4444' });
      setMessages(prev => [...prev, {
        role: 'ai',
        content: '⚠️ Unable to connect to ShadowVault backend. Make sure the Python server is running on port 8000.',
        time: now(),
      }]);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="page-container">

      {/* ── Top header bar ── */}
      <div className="sc-header">
        <div className="sc-header-left">
          <div className="sc-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h2 className="sc-header-title">Secure AI Chat</h2>
            <p className="sc-header-sub">Protected by ShadowVault dual-layer engine</p>
          </div>
        </div>
        <div className="sc-status-pill" style={{ borderColor: scanStatus.color, color: scanStatus.color }}>
          <span className="sc-status-dot" style={{ background: scanStatus.color }} />
          {scanStatus.text}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="sc-messages">
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {isTyping && <TypingDots />}
        <div ref={bottomRef} />
      </div>

      {/* ── Premium Input Area ── */}
      <div className="sc-input-area">
        <div className={`sc-input-glow-wrap ${inputFocused ? 'focused' : ''}`}>
          <div className="sc-input-inner">
            <textarea
              ref={textareaRef}
              className="sc-glow-input"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Ask anything — ShadowVault will protect you..."
            />
            <div className="sc-toolbar">
              <div className="sc-toolbar-left">
                <button className="sc-tool-btn" title="Attach">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <button className="sc-tools-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  Tools
                </button>
              </div>
              <div className="sc-toolbar-right">
                <button className="sc-mic-btn" title="Voice input">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>
                <button
                  className="sc-glow-send"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  title="Send"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="sc-footer-note">
          All prompts scanned by NVIDIA Nemotron Safety Guard + Regex engine before reaching AI
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
