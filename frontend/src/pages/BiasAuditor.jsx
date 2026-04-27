import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../utils/authUtils';

export default function BiasAuditor() {
  const [file, setFile] = useState(null);
  const [targetColumn, setTargetColumn] = useState('');
  const [protectedAttrs, setProtectedAttrs] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isLight = theme === 'light';

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const runAudit = async () => {
    if (!file || !targetColumn || !protectedAttrs) {
      alert("Please provide a file, target column, and protected attributes.");
      return;
    }

    setLoading(true);
    setResults(null);
    setExplanation('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_column', targetColumn);
    
    // Parse attributes from comma-separated string to JSON array
    const attrsArray = protectedAttrs.split(',').map(s => s.trim()).filter(s => s);
    formData.append('protected_attributes', JSON.stringify(attrsArray));

    const token = localStorage.getItem('authToken');
    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${API_URL}/api/audit/dataset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.status === 'success') {
        setResults(data);
        // Automatically trigger explanation
        explainResults(data.analysis);
      } else {
        alert("Audit failed: " + (data.detail || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const explainResults = async (analysisData) => {
    setExplaining(true);
    try {
      const response = await authenticatedFetch('/api/audit/explain', {
        method: 'POST',
        body: JSON.stringify(analysisData)
      });
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (err) {
      console.error(err);
      setExplanation("Failed to generate AI explanation.");
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="bias-auditor-container" style={{ 
      padding: '40px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      height: 'calc(100vh - 100px)',
      overflowY: 'auto',
      scrollbarWidth: 'thin'
    }}>
      <header style={{ marginBottom: '40px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '600', marginBottom: '10px' }}>AI Fairness Auditor</h1>
        <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>Inspect datasets for hidden discrimination and disparate impact.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: results ? '1fr 1fr' : '1fr', gap: '30px', transition: 'all 0.5s ease' }}>
        {/* Configuration Section */}
        <div className="premium-card" style={{ padding: '30px', borderRadius: '24px', background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20V16"/></svg>
            Audit Configuration
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>Dataset (CSV/JSON)</label>
            <input type="file" onChange={handleFileUpload} accept=".csv,.json" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)', background: 'transparent', color: 'inherit' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>Target Column (e.g., 'outcome', 'approved')</label>
            <input type="text" value={targetColumn} onChange={(e) => setTargetColumn(e.target.value)} placeholder="Enter column name..." style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: isLight ? 'white' : 'rgba(0,0,0,0.2)', color: 'inherit' }} />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>Protected Attributes (comma-separated, e.g., 'gender, race, age')</label>
            <input type="text" value={protectedAttrs} onChange={(e) => setProtectedAttrs(e.target.value)} placeholder="e.g. gender, race" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: isLight ? 'white' : 'rgba(0,0,0,0.2)', color: 'inherit' }} />
          </div>

          <button 
            onClick={runAudit}
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              borderRadius: '14px', 
              border: 'none', 
              background: loading ? '#ccc' : 'linear-gradient(135deg, #6e3cbc 0%, #4285f4 100%)', 
              color: 'white', 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 20px rgba(110, 60, 188, 0.2)'
            }}
          >
            {loading ? 'Analyzing Data...' : 'Thorough Inspection'}
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="premium-card results-fade-in" style={{ padding: '30px', borderRadius: '24px', background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Audit Report</h2>
              <div style={{ 
                padding: '6px 15px', 
                borderRadius: '20px', 
                background: results.analysis.status === 'CRITICAL' ? '#ff4d4d' : results.analysis.status === 'WARNING' ? '#ffa500' : '#00c853',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {results.analysis.status}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
              <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                 <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={results.analysis.overall_score > 50 ? "#ff4d4d" : "#00c853"} strokeWidth="3" strokeDasharray={`${results.analysis.overall_score}, 100`} />
                 </svg>
                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {results.analysis.overall_score}%
                 </div>
              </div>
              <div>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>Overall Bias Risk</p>
                <p style={{ margin: '5px 0 0 0', fontWeight: '500' }}>{results.analysis.summary.total_samples} Rows Analyzed</p>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '15px', opacity: 0.9 }}>Critical Flags</h3>
              {results.analysis.flags.length > 0 ? (
                results.analysis.flags.map((flag, idx) => (
                  <div key={idx} style={{ 
                    padding: '12px', 
                    borderRadius: '12px', 
                    background: flag.severity === 'CRITICAL' ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255, 165, 0, 0.1)', 
                    border: flag.severity === 'CRITICAL' ? '1px solid rgba(255, 77, 77, 0.3)' : '1px solid rgba(255, 165, 0, 0.3)',
                    marginBottom: '10px',
                    fontSize: '0.9rem'
                  }}>
                    <strong>{flag.type}:</strong> {flag.message}
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>No critical bias flags detected.</p>
              )}
            </div>

            <div>
               <h3 style={{ fontSize: '1rem', marginBottom: '15px', opacity: 0.9 }}>Fix Recommendations</h3>
               {results.mitigations.map((m, idx) => (
                 <div key={idx} style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4285f4', fontWeight: '600', fontSize: '0.9rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      {m.action}
                    </div>
                    <p style={{ margin: '5px 0 0 22px', fontSize: '0.85rem', opacity: 0.7 }}>{m.description}</p>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Explanation Section */}
      {explanation && (
        <div className="premium-card results-fade-in" style={{ marginTop: '30px', padding: '30px', borderRadius: '24px', background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            AI Auditor's Insights
          </h2>
          <div className="markdown-content" style={{ fontSize: '1.05rem', lineHeight: '1.6', opacity: 0.9 }}>
            {explanation.split('\n').map((line, i) => (
              <p key={i} style={{ marginBottom: line.startsWith('#') ? '15px' : '8px', fontWeight: line.startsWith('#') ? '600' : '400', fontSize: line.startsWith('#') ? '1.2rem' : '1.05rem' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {explaining && (
        <div style={{ textAlign: 'center', marginTop: '20px', opacity: 0.6 }}>
          <div className="loading-spinner" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '10px' }}></div>
          Generating AI insights...
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .results-fade-in { animation: fadeIn 0.8s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .premium-card:hover { border-color: rgba(110, 60, 188, 0.3) !important; transition: border 0.3s ease; }
      `}</style>
    </div>
  );
}
