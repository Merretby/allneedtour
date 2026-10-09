import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: string;
  status: 'On Shift' | 'Off Shift' | 'Leave';
  hoursThisWeek: number;
}

const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Karim T.', role: 'Head Chef', department: 'Kitchen', shift: 'Morning (06:00 - 15:00)', status: 'On Shift', hoursThisWeek: 42 },
  { id: '2', name: 'Sara M.', role: 'Waitress', department: 'Service', shift: 'Evening (16:00 - 00:00)', status: 'Off Shift', hoursThisWeek: 28 },
  { id: '3', name: 'Youssef B.', role: 'Bartender', department: 'Bar', shift: 'Night (18:00 - 02:00)', status: 'On Shift', hoursThisWeek: 35 },
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

  return (
    <div className="table-wrap">
      <div className="table-toolbar">
        <div className="search">
          <Search size={15} />
          <input 
            type="text" 
            placeholder="Search staff, roles..." 
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
        </select>
        
        <input 
          type="date" 
          className="filter"
        />
        
        <button className="secondary" onClick={() => window.dispatchEvent(new CustomEvent("allneeds:toast", { detail: "Add staff member" }))}>
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
                    </span>
                  </div>
                </td>
                <td>
                  <strong>{member.role}</strong>
                  <small>{member.department}</small>
                </td>
                <td>{member.shift}</td>
                <td>
                  <strong>{member.hoursThisWeek}h</strong>
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
  );
};
