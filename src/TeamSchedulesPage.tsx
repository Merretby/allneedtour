import React, { useState } from 'react';
import { Search, Download, Calendar, X } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  shift: string;
  nextShift: string;
  status: 'On Shift' | 'Off Shift' | 'Leave';
  hoursThisWeek: number;
}

const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Karim Haddad', email: 'karim@allneeds.com', role: 'Head Chef', department: 'Kitchen', shift: 'Morning (06:00 - 15:00)', nextShift: 'Tomorrow 06:00', status: 'On Shift', hoursThisWeek: 42 },
  { id: '2', name: 'Sara Majid', email: 'sara.m@allneeds.com', role: 'Waitress', department: 'Service', shift: 'Evening (16:00 - 00:00)', nextShift: 'Today 16:00', status: 'Off Shift', hoursThisWeek: 28 },
  { id: '3', name: 'Youssef Bennani', email: 'youssef.b@allneeds.com', role: 'Bartender', department: 'Bar', shift: 'Night (18:00 - 02:00)', nextShift: 'Tomorrow 18:00', status: 'On Shift', hoursThisWeek: 35 },
  { id: '4', name: 'Lina Farah', email: 'lina@allneeds.com', role: 'Sous Chef', department: 'Kitchen', shift: 'Off', nextShift: 'Monday 08:00', status: 'Leave', hoursThisWeek: 0 },
  { id: '5', name: 'Thomas Roy', email: 'thomas@allneeds.com', role: 'Cashier', department: 'Front of house', shift: 'Morning (08:00 - 16:00)', nextShift: 'Tomorrow 08:00', status: 'On Shift', hoursThisWeek: 38 },
];

export const TeamSchedulesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  
  // Modal states
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    if (status === 'On Shift') {
      return (
        <span className="badge active">
          <i /> On Shift
        </span>
      );
    }
    if (status === 'Off Shift') {
      return (
        <span className="badge off">
          <i /> Off Shift
        </span>
      );
    }
    return (
      <span className="badge off" style={{ background: '#fff0dc', color: '#bb7e2f' }}>
        <i style={{ background: '#bb7e2f' }} /> Leave
      </span>
    );
  };

  const activeStaffCount = MOCK_TEAM.filter(m => m.status !== 'Leave').length;
  const onShiftCount = MOCK_TEAM.filter(m => m.status === 'On Shift').length;

  return (
    <section className="admin-page">
      <div className="admin-intro">
        <div>
          <span className="eyebrow">PEOPLE & CONTROL</span>
          <h2>Team & Schedules.</h2>
          <p>Manage your restaurant staff, shifts, and weekly working hours efficiently.</p>
        </div>
        <div className="admin-metrics">
          <strong>
            {activeStaffCount}
            <small>active staff</small>
          </strong>
          <strong>
            {onShiftCount}
            <small>currently on shift</small>
          </strong>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search">
            <Search size={15} />
            <input 
              type="text" 
              placeholder="Search staff, roles, or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All departments</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Service">Service</option>
            <option value="Bar">Bar</option>
            <option value="Front of house">Front of house</option>
          </select>
          
          <div className="search" style={{ width: '160px', padding: '0 8px' }}>
             <Calendar size={13} style={{ color: '#8da09b' }}/>
             <input type="date" style={{ padding: '8px 0' }} />
          </div>
          
          <button className="secondary" style={{ cursor: 'pointer' }} onClick={() => setIsExportOpen(true)}>
            <Download size={13} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Export
          </button>
          
          <button className="secondary" style={{ cursor: 'pointer', background: '#0F172A', color: 'white', borderColor: '#0F172A' }} onClick={() => setIsAddStaffOpen(true)}>
            + Add Staff
          </button>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role & Dept</th>
                <th>Current Shift</th>
                <th>Next Shift</th>
                <th>Hours (Week)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TEAM.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="user-cell">
                      <span className="avatar">
                        {member.name.split(" ").map(x => x[0]).join("").slice(0, 2)}
                      </span>
                      <span>
                        <strong>{member.name}</strong>
                        <small>{member.email}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    <strong>{member.role}</strong>
                    <small>{member.department}</small>
                  </td>
                  <td>
                    <strong>{member.shift}</strong>
                  </td>
                  <td>{member.nextShift}</td>
                  <td>
                    <strong style={{ color: member.hoursThisWeek > 40 ? '#bb7e2f' : 'inherit' }}>
                      {member.hoursThisWeek}h {member.hoursThisWeek > 40 && '(Overtime)'}
                    </strong>
                  </td>
                  <td>
                    {getStatusBadge(member.status)}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button style={{ cursor: 'pointer' }} onClick={() => setIsAddStaffOpen(true)}>Schedule</button>
                      <button style={{ cursor: 'pointer' }} onClick={() => setIsAddStaffOpen(true)}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="modal-overlay">
          <div className="menu-modal">
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>Add New Staff Member</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsAddStaffOpen(false)}>
                <X size={18} color="#64748B" />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>First Name</label>
                  <input type="text" placeholder="e.g. Karim" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Last Name</label>
                  <input type="text" placeholder="e.g. Haddad" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Email Address</label>
                <input type="email" placeholder="staff@restaurant.com" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Role</label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white' }}>
                    <option>Head Chef</option>
                    <option>Waitress</option>
                    <option>Bartender</option>
                    <option>Manager</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Department</label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white' }}>
                    <option>Kitchen</option>
                    <option>Service</option>
                    <option>Bar</option>
                    <option>Front of house</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-actions" style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
              <button className="secondary" style={{ cursor: 'pointer' }} onClick={() => setIsAddStaffOpen(false)}>Cancel</button>
              <button className="secondary" style={{ cursor: 'pointer', background: '#0F172A', color: 'white', borderColor: '#0F172A' }} onClick={() => setIsAddStaffOpen(false)}>Save Staff</button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <div className="modal-overlay">
          <div className="menu-modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>Export Schedule</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsExportOpen(false)}>
                <X size={18} color="#64748B" />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0' }}>Select the format and date range for your export.</p>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Format</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white' }}>
                  <option>CSV (Excel)</option>
                  <option>PDF Document</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Date Range</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white' }}>
                  <option>This Week</option>
                  <option>Next Week</option>
                  <option>This Month</option>
                </select>
              </div>
            </div>
            <div className="modal-actions" style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
              <button className="secondary" style={{ cursor: 'pointer' }} onClick={() => setIsExportOpen(false)}>Cancel</button>
              <button className="secondary" style={{ cursor: 'pointer', background: '#0F172A', color: 'white', borderColor: '#0F172A' }} onClick={() => { setIsExportOpen(false); alert("Downloading..."); }}>Download</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
