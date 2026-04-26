export default function PayloadAnalytics() {
  return (
    <div className="page-container">
      <h1 className="page-title">Payload Analytics</h1>
      <div className="panel">
          <div className="panel-header">
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
               <span className="text-dim" style={{ fontSize: '0.85rem' }}>Date Range &#x25BC;</span>
               <span className="text-dim" style={{ fontSize: '0.85rem' }}>Threat Score &#x25BC;</span>
               <span className="text-dim" style={{ fontSize: '0.85rem' }}>Threat Classification &#x25BC;</span>
            </div>
          </div>
          <div className="logs-table-container">
            <table className="logs-table">
               <thead>
                  <tr>
                     <th><input type="checkbox"/></th>
                     <th>Date/Time</th>
                     <th>Score</th>
                     <th>Model</th>
                     <th>Classification</th>
                     <th>Source IP</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td><input type="checkbox" defaultChecked/></td>
                     <td>02:00 PM</td>
                     <td><span className="text-red">99.1%</span></td>
                     <td>GPT-4</td>
                     <td>Roleplay Jailbreak</td>
                     <td>192.168.1.5</td>
                  </tr>
                  <tr>
                     <td><input type="checkbox"/></td>
                     <td>01:45 PM</td>
                     <td><span className="text-yellow">75.0%</span></td>
                     <td>Claude 3</td>
                     <td>Data Exfiltration</td>
                     <td>10.0.0.44</td>
                  </tr>
               </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
