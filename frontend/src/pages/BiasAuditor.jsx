import { useState, useEffect, useRef } from 'react';
import { authenticatedFetch } from '../utils/authUtils';

export default function BiasAuditor() {
  const [file, setFile] = useState(null);
  const [targetColumn, setTargetColumn] = useState('');
  const [protectedAttrs, setProtectedAttrs] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isLight = theme === 'light';

  const cardStyle = {
    padding: '30px',
    borderRadius: '24px',
    background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
    border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
  };

  const handleFileUpload = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError('');
    }
  };

  const runAudit = async () => {
    if (!file || !targetColumn.trim() || !protectedAttrs.trim()) {
      setError('Please provide a CSV/JSON file, target column, and at least one protected attribute.');
      return;
    }

    setLoading(true);
    setResults(null);
    setExplanation('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_column', targetColumn.trim());

    const attrsArray = protectedAttrs.split(',').map(s => s.trim()).filter(s => s);
    formData.append('protected_attributes', JSON.stringify(attrsArray));

    const token = localStorage.getItem('authToken');
    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${API_URL}/api/audit/dataset`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Server returned an invalid response. Is the backend running?');
      }

      if (!response.ok) {
        throw new Error(data?.detail || `Server error: ${response.status}`);
      }

      // Check for backend-level error in the analysis result itself
      if (data.analysis?.error) {
        throw new Error(data.analysis.error);
      }

      if (data.status === 'success') {
        setResults(data);
        explainResults(data.analysis);
      } else {
        throw new Error(data.detail || 'Audit failed for an unknown reason.');
      }
    } catch (err) {
      console.error('Audit error:', err);
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const explainResults = async (analysisData) => {
    setExplaining(true);
    try {
      const response = await authenticatedFetch('/api/audit/explain', {
        method: 'POST',
        body: JSON.stringify(analysisData),
      });
      const data = await response.json();
      setExplanation(data.explanation || 'No explanation returned.');
    } catch (err) {
      console.error('Explain error:', err);
      setExplanation('Failed to generate AI explanation. Check that the Gemini API key is configured.');
    } finally {
      setExplaining(false);
    }
  };

  const statusColor = (status) => {
    if (status === 'CRITICAL') return '#ff4d4d';
    if (status === 'WARNING') return '#ffa500';
    return '#00c853';
  };

  return (
    <div
      className="bias-auditor-container"
      style={{
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        height: 'calc(100vh - 100px)',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
      }}
    >
      <header style={{ marginBottom: '40px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '600', marginBottom: '10px' }}>AI Fairness Auditor</h1>
        <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>Inspect datasets for hidden discrimination and disparate impact.</p>
      </header>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            marginBottom: '24px',
            padding: '16px 20px',
            borderRadius: '14px',
            background: 'rgba(255,77,77,0.1)',
            border: '1px solid rgba(255,77,77,0.35)',
            color: '#ff6b6b',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '2px' }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: results ? '1fr 1fr' : '1fr', gap: '30px', transition: 'all 0.5s ease' }}>

        {/* ─── Configuration Section ─── */}
        <div className="premium-card" style={cardStyle}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20V16" /></svg>
            Audit Configuration
          </h2>

          {/* File Upload */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>Dataset (CSV / JSON)</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: '12px',
                border: file 
                  ? '1px solid rgba(110,60,188,0.5)' 
                  : `1px dashed ${isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}`,
                background: file 
                  ? 'rgba(110,60,188,0.08)' 
                  : (isLight ? 'rgba(0,0,0,0.02)' : 'transparent'),
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: '8px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: file ? 1 : 0.6 }}>
                {file ? `✅ ${file.name}` : 'Click to upload CSV or JSON'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept=".csv,.json"
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Target Column */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>
              Target Column <span style={{ opacity: 0.5 }}>(e.g. "approved", "outcome")</span>
            </label>
            <input
              type="text"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              placeholder="Enter column name..."
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: isLight ? 'white' : 'rgba(0,0,0,0.2)',
                color: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Protected Attributes */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>
              Protected Attributes <span style={{ opacity: 0.5 }}>(comma-separated, e.g. "gender, race")</span>
            </label>
            <input
              type="text"
              value={protectedAttrs}
              onChange={(e) => setProtectedAttrs(e.target.value)}
              placeholder="e.g. gender, race, age"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: isLight ? 'white' : 'rgba(0,0,0,0.2)',
                color: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={runAudit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '14px',
              border: 'none',
              background: loading ? (isLight ? '#ccc' : '#444') : 'linear-gradient(135deg, #6e3cbc 0%, #4285f4 100%)',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 10px 20px rgba(110,60,188,0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {loading ? (
              <>
                <span className="loading-spinner" style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Analyzing Data...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                Thorough Inspection
              </>
            )}
          </button>
        </div>

        {/* ─── Results Section ─── */}
        {results && results.analysis && !results.analysis.error && (
          <div className="premium-card results-fade-in" style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Audit Report</h2>
              <div style={{
                padding: '6px 15px',
                borderRadius: '20px',
                background: statusColor(results.analysis.status),
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: 'white',
              }}>
                {results.analysis.status ?? 'N/A'}
              </div>
            </div>

            {/* Score Ring */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
              <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={(results.analysis.overall_score ?? 0) > 50 ? '#ff4d4d' : '#00c853'}
                    strokeWidth="3"
                    strokeDasharray={`${results.analysis.overall_score ?? 0}, 100`}
                  />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {results.analysis.overall_score ?? 0}%
                </div>
              </div>
              <div>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>Overall Bias Risk</p>
                <p style={{ margin: '5px 0 0', fontWeight: '500' }}>{results.analysis.summary?.total_samples ?? '—'} Rows Analyzed</p>
              </div>
            </div>

            {/* Critical Flags */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '15px', opacity: 0.9 }}>Critical Flags</h3>
              {(results.analysis.flags ?? []).length > 0 ? (
                (results.analysis.flags).map((flag, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: flag.severity === 'CRITICAL' ? 'rgba(255,77,77,0.1)' : 'rgba(255,165,0,0.1)',
                    border: flag.severity === 'CRITICAL' ? '1px solid rgba(255,77,77,0.3)' : '1px solid rgba(255,165,0,0.3)',
                    marginBottom: '10px',
                    fontSize: '0.9rem',
                  }}>
                    <strong>{flag.type}:</strong> {flag.message}
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>✅ No critical bias flags detected.</p>
              )}
            </div>

            {/* Mitigations */}
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '15px', opacity: 0.9 }}>Fix Recommendations</h3>
              {(results.mitigations ?? []).map((m, idx) => (
                <div key={idx} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4285f4', fontWeight: '600', fontSize: '0.9rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                    {m.action}
                  </div>
                  <p style={{ margin: '5px 0 0 22px', fontSize: '0.85rem', opacity: 0.7 }}>{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── AI Explanation Section ─── */}
      {explaining && (
        <div style={{ textAlign: 'center', marginTop: '30px', opacity: 0.6 }}>
          <span className="loading-spinner" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '10px' }} />
          Generating AI insights...
        </div>
      )}

      {explanation && !explaining && (
        <div className="premium-card results-fade-in" style={{ marginTop: '30px', ...cardStyle }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            AI Auditor's Insights
          </h2>
          <div className="markdown-content" style={{ fontSize: '1.05rem', lineHeight: '1.7', opacity: 0.9 }}>
            {explanation.split('\n').map((line, i) => (
              <p key={i} style={{
                marginBottom: line.startsWith('#') ? '15px' : '8px',
                fontWeight: line.startsWith('#') ? '600' : '400',
                fontSize: line.startsWith('#') ? '1.15rem' : '1.05rem',
              }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .results-fade-in { animation: fadeIn 0.8s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .premium-card:hover { border-color: rgba(110,60,188,0.3) !important; transition: border 0.3s ease; }
      `}</style>
    </div>
  );
}
