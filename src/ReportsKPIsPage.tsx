import React, { useState } from 'react';
import { Search, Download, BarChart2, TrendingUp, Users, X } from 'lucide-react';

interface KPIReport {
  id: string;
  title: string;
  category: string;
  period: string;
  trend: 'up' | 'down' | 'stable';
  value: string;
  comparison: string;
  status: 'Generated' | 'Scheduled';
}

const MOCK_REPORTS: KPIReport[] = [
  { id: '1', title: 'Monthly Revenue Summary', category: 'Financial', period: 'October 2023', trend: 'up', value: '142,500.00 MAD', comparison: '+12.4% vs last month', status: 'Generated' },
  { id: '2', title: 'Average Table Turn', category: 'Operations', period: 'Last 7 Days', trend: 'down', value: '45 mins', comparison: '-5 mins vs last week', status: 'Generated' },
  { id: '3', title: 'Staff Attendance', category: 'HR', period: 'This Week', trend: 'stable', value: '98%', comparison: 'Unchanged', status: 'Generated' },
  { id: '4', title: 'Food Waste Cost', category: 'Operations', period: 'October 2023', trend: 'down', value: '4,200.00 MAD', comparison: '-15% vs last month', status: 'Scheduled' },
  { id: '5', title: 'Customer Satisfaction Score', category: 'Marketing', period: 'Q3 2023', trend: 'up', value: '4.8/5.0', comparison: '+0.2 pts vs Q2', status: 'Generated' },
];

export const ReportsKPIsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  // Modal states
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const getTrendBadge = (trend: string) => {
    if (trend === 'up') {
      return (
        <span className="badge active">
          <i /> Increasing
        </span>
      );
    }
    if (trend === 'down') {
      return (
        <span className="badge off" style={{ background: '#fff0dc', color: '#bb7e2f' }}>
          <i style={{ background: '#bb7e2f' }} /> Decreasing
        </span>
      );
    }
    return (
      <span className="badge off">
        <i /> Stable
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Generated') {
      return (
        <span className="badge active" style={{ background: '#f0f2f1', color: '#536f6d' }}>
          <i style={{ background: '#536f6d' }}/> Ready
        </span>
      );
    }
    return (
      <span className="badge off" style={{ background: '#e0f2fe', color: '#0369a1' }}>
        <i style={{ background: '#0369a1' }}/> Scheduled
      </span>
    );
  };

  const reportsGenerated = MOCK_REPORTS.filter(r => r.status === 'Generated').length;

  return (
    <section className="admin-page">
      <div className="admin-intro">
        <div>
          <span className="eyebrow">PEOPLE & CONTROL</span>
          <h2>Reports & KPIs.</h2>
          <p>Track financial, operational, and HR performance of your establishment.</p>
        </div>
        <div className="admin-metrics">
          <strong>
            {reportsGenerated}
            <small>reports ready</small>
          </strong>
          <strong>
            24.5%
            <small>avg. profit margin</small>
          </strong>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search">
            <Search size={15} />
            <input 
              type="text" 
              placeholder="Search reports or metrics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Financial">Financial</option>
            <option value="Operations">Operations</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
          </select>
          
          <select className="filter">
            <option>Last 30 days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          
          <button className="secondary" style={{ cursor: 'pointer' }} onClick={() => setIsExportOpen(true)}>
            <Download size={13} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Export All
          </button>

          <button className="secondary" style={{ cursor: 'pointer', background: '#0F172A', color: 'white', borderColor: '#0F172A' }} onClick={() => setIsNewReportOpen(true)}>
            + New Report
          </button>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Report Title</th>
                <th>Category</th>
                <th>Period</th>
                <th>Key Metric</th>
                <th>Trend</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id}>
                  <td>
                    <strong>{report.title}</strong>
                  </td>
                  <td>{report.category}</td>
                  <td>{report.period}</td>
                  <td>
                    <strong>{report.value}</strong>
                    <small>{report.comparison}</small>
                  </td>
                  <td>
                    {getTrendBadge(report.trend)}
                  </td>
                  <td>
                    {getStatusBadge(report.status)}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button style={{ cursor: 'pointer' }} onClick={() => alert("Viewing " + report.title)}>View Data</button>
                      <button style={{ cursor: 'pointer' }} onClick={() => alert("Downloading PDF")}>PDF</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Report Modal */}
      {isNewReportOpen && (
        <div className="modal-overlay">
          <div className="menu-modal">
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>Generate New Report</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsNewReportOpen(false)}>
                <X size={18} color="#64748B" />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Report Type</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white' }}>
                  <option>Financial Summary</option>
                  <option>Sales by Category</option>
                  <option>Staff Attendance & Payroll</option>
                  <option>Inventory & Waste Logs</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Start Date</label>
                  <input type="date" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>End Date</label>
                  <input type="date" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Delivery Method</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><input type="checkbox" defaultChecked /> View on Dashboard</label>
                  <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><input type="checkbox" /> Send via Email</label>
                </div>
              </div>
            </div>
            <div className="modal-actions" style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
              <button className="secondary" style={{ cursor: 'pointer' }} onClick={() => setIsNewReportOpen(false)}>Cancel</button>
              <button className="secondary" style={{ cursor: 'pointer', background: '#0F172A', color: 'white', borderColor: '#0F172A' }} onClick={() => setIsNewReportOpen(false)}>Generate</button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <div className="modal-overlay">
          <div className="menu-modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>Export Reports</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsExportOpen(false)}>
                <X size={18} color="#64748B" />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0' }}>Export the current filtered list of reports.</p>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Format</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white' }}>
                  <option>CSV (Excel)</option>
                  <option>PDF Document</option>
                  <option>JSON</option>
                </select>
              </div>
            </div>
            <div className="modal-actions" style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
              <button className="secondary" style={{ cursor: 'pointer' }} onClick={() => setIsExportOpen(false)}>Cancel</button>
              <button className="secondary" style={{ cursor: 'pointer', background: '#0F172A', color: 'white', borderColor: '#0F172A' }} onClick={() => { setIsExportOpen(false); alert("Downloading archive..."); }}>Download All</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
