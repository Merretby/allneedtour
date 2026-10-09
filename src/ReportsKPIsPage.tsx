import React, { useState } from 'react';
import { Search, Download, BarChart2, TrendingUp, Users } from 'lucide-react';

interface KPIReport {
  id: string;
  title: string;
  category: string;
  period: string;
  trend: 'up' | 'down' | 'stable';
  value: string;
}

const MOCK_REPORTS: KPIReport[] = [
  { id: '1', title: 'Monthly Revenue', category: 'Financial', period: 'October 2023', trend: 'up', value: '142,500.00 MAD' },
  { id: '2', title: 'Average Table Turn', category: 'Operations', period: 'Last 7 Days', trend: 'down', value: '45 mins' },
  { id: '3', title: 'Staff Attendance', category: 'HR', period: 'This Week', trend: 'stable', value: '98%' },
];

export const ReportsKPIsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

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

  return (
    <div>
      <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
        <div className="record">
          <div className="module-symbol">
            <TrendingUp size={20} />
          </div>
          <div>
            <strong>142,500 MAD</strong>
            <small>Total Revenue (MTD)</small>
          </div>
        </div>
        <div className="record">
          <div className="module-symbol">
            <Users size={20} />
          </div>
          <div>
            <strong>4,200</strong>
            <small>Guests Served (MTD)</small>
          </div>
        </div>
        <div className="record">
          <div className="module-symbol">
            <BarChart2 size={20} />
          </div>
          <div>
            <strong>24.5%</strong>
            <small>Avg. Profit Margin</small>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search">
            <Search size={15} />
            <input 
              type="text" 
              placeholder="Search reports..." 
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
          </select>
          
          <button className="secondary" onClick={() => window.dispatchEvent(new CustomEvent("allneeds:toast", { detail: "Generating report..." }))}>
            <Download size={12} style={{ marginRight: '5px', display: 'inline-block' }}/> Export CSV
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
                  </td>
                  <td>
                    {getTrendBadge(report.trend)}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button>View Data</button>
                      <button>Download PDF</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
