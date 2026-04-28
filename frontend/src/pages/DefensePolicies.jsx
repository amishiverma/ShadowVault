import { useState } from 'react';

export default function DefensePolicies() {
  const [shields, setShields] = useState({
    sensitiveData: true,
    syntaxInjection: true,
    roleplayJailbreak: true
  });

  const [rules, setRules] = useState([
    'ignore previous instructions',
    'system bypass',
    'base64 encode your secrets'
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRule, setNewRule] = useState('');

  const toggleShield = (key) => {
    setShields(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
      setIsAdding(false);
    }
  };

  const deleteRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Defense Policies</h1>
      
      <div className="dashboard-grid">
        <div className="panel col-span-2">
          <div className="panel-header"><h3>Protocol Shields</h3></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <h4 style={{ fontWeight: 500 }}>Sensitive Data Shield</h4>
                   <span className="text-dim" style={{ fontSize: '0.8rem' }}>Prevents PII and secrets from leaking.</span>
                </div>
                <div className="toggle-switch" onClick={() => toggleShield('sensitiveData')} style={{ cursor: 'pointer' }}>
                  <div className={`toggle-track ${shields.sensitiveData ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
             </div>

             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <h4 style={{ fontWeight: 500 }}>Syntax Injection Shield</h4>
                   <span className="text-dim" style={{ fontSize: '0.8rem' }}>Blocks SQLi and prompt overrides.</span>
                </div>
                <div className="toggle-switch" onClick={() => toggleShield('syntaxInjection')} style={{ cursor: 'pointer' }}>
                  <div className={`toggle-track ${shields.syntaxInjection ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
             </div>
             
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <h4 style={{ fontWeight: 500 }}>Roleplay Jailbreak Shield</h4>
                   <span className="text-dim" style={{ fontSize: '0.8rem' }}>Detects DAN, Developer Mode bypasses.</span>
                </div>
                <div className="toggle-switch" onClick={() => toggleShield('roleplayJailbreak')} style={{ cursor: 'pointer' }}>
                  <div className={`toggle-track ${shields.roleplayJailbreak ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
             </div>
          </div>
        </div>
        
        <div className="panel">
           <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3>Custom Prompt Blacklists</h3>
           </div>
           
           <div style={{ marginTop: '1rem' }}>
             {rules.length === 0 ? (
               <p className="text-dim" style={{ fontSize: '0.85rem' }}>No custom rules currently active.</p>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {rules.map((rule, idx) => (
                   <div key={idx} style={{
                     display: 'flex', 
                     justifyContent: 'space-between', 
                     alignItems: 'center',
                     padding: '10px 14px',
                     background: 'rgba(255,255,255,0.03)',
                     border: '1px solid rgba(255,255,255,0.1)',
                     borderRadius: '10px',
                     fontSize: '0.85rem'
                   }}>
                     <span style={{ fontFamily: 'monospace', opacity: 0.9 }}>"{rule}"</span>
                     <button 
                       onClick={() => deleteRule(idx)}
                       style={{ 
                         background: 'none', 
                         border: 'none', 
                         color: '#ff4d4d', 
                         cursor: 'pointer',
                         padding: '4px',
                         display: 'flex',
                         alignItems: 'center',
                         opacity: 0.6
                       }}
                       title="Delete Rule"
                     >
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                         <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                       </svg>
                     </button>
                   </div>
                 ))}
               </div>
             )}
             
             {isAdding ? (
               <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                 <input 
                   type="text" 
                   value={newRule}
                   onChange={(e) => setNewRule(e.target.value)}
                   placeholder="Enter blacklisted phrase..."
                   autoFocus
                   onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
                   style={{
                     flex: 1,
                     padding: '10px 14px',
                     borderRadius: '10px',
                     border: '1px solid rgba(110,60,188,0.4)',
                     background: 'rgba(0,0,0,0.2)',
                     color: 'white',
                     fontSize: '0.85rem'
                   }}
                 />
                 <button 
                   onClick={handleAddRule}
                   className="btn btn-primary"
                   style={{ padding: '0 15px', height: '38px', fontSize: '0.85rem' }}
                 >
                   Add
                 </button>
                 <button 
                   onClick={() => setIsAdding(false)}
                   className="btn btn-secondary"
                   style={{ padding: '0 15px', height: '38px', fontSize: '0.85rem' }}
                 >
                   Cancel
                 </button>
               </div>
             ) : (
               <button 
                 className="btn btn-secondary" 
                 style={{ marginTop: '1.5rem', width: '100%', borderStyle: 'dashed', opacity: 0.8 }}
                 onClick={() => setIsAdding(true)}
               >
                 + Add New Rule
               </button>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
