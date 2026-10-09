import React, { useState } from 'react';
import { Search, Download, Calendar } from 'lucide-react';

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
          
          <button className="secondary" onClick={() => window.dispatchEvent(new CustomEvent("allneeds:toast", { detail: "Exported Schedule CSV" }))}>
            <Download size={13} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Export
          </button>
          
          <button className="secondary" style={{ background: '#0F172A', color: 'white', borderColor: '#0F172A' }} onClick={() => window.dispatchEvent(new CustomEvent("allneeds:toast", { detail: "Add staff member dialog" }))}>
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
                      <button>Schedule</button>
                      <button>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
