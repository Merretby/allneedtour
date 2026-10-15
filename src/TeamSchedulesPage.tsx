import React, { useState } from "react";
import {
  Search,
  Download,
  Calendar,
  X,
  Plus,
  Edit3,
  Trash2,
} from "lucide-react";
import { useToast } from "./components/ToastProvider";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  shift: string;
  nextShift: string;
  status: "On Shift" | "Off Shift" | "Leave";
  hoursThisWeek: number;
}

const MOCK_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Karim Haddad",
    email: "karim@allneeds.com",
    role: "Head Chef",
    department: "Kitchen",
    shift: "Morning (06:00 - 15:00)",
    nextShift: "Tomorrow 06:00",
    status: "On Shift",
    hoursThisWeek: 42,
  },
  {
    id: "2",
    name: "Sara Majid",
    email: "sara.m@allneeds.com",
    role: "Waitress",
    department: "Service",
    shift: "Evening (16:00 - 00:00)",
    nextShift: "Today 16:00",
    status: "Off Shift",
    hoursThisWeek: 28,
  },
  {
    id: "3",
    name: "Youssef Bennani",
    email: "youssef.b@allneeds.com",
    role: "Bartender",
    department: "Bar",
    shift: "Night (18:00 - 02:00)",
    nextShift: "Tomorrow 18:00",
    status: "On Shift",
    hoursThisWeek: 35,
  },
  {
    id: "4",
    name: "Lina Farah",
    email: "lina@allneeds.com",
    role: "Sous Chef",
    department: "Kitchen",
    shift: "Off",
    nextShift: "Monday 08:00",
    status: "Leave",
    hoursThisWeek: 0,
  },
  {
    id: "5",
    name: "Thomas Roy",
    email: "thomas@allneeds.com",
    role: "Cashier",
    department: "Front of house",
    shift: "Morning (08:00 - 16:00)",
    nextShift: "Tomorrow 08:00",
    status: "On Shift",
    hoursThisWeek: 38,
  },
];

export const TeamSchedulesPage: React.FC = () => {
  const { showToast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Form state
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("Head Chef");
  const [formDepartment, setFormDepartment] = useState("Kitchen");

  const filtered = team.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "All") return matchesSearch;
    return matchesSearch && m.department === filter;
  });

  const activeStaffCount = team.filter((m) => m.status !== "Leave").length;
  const onShiftCount = team.filter((m) => m.status === "On Shift").length;

  const getStatusBadge = (status: string) => {
    if (status === "On Shift")
      return { bg: "var(--success-bg)", color: "var(--success)" };
    if (status === "Off Shift") return { bg: "#F3F4F6", color: "#6B7280" };
    return { bg: "var(--warning-bg)", color: "var(--warning)" };
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName || !formLastName || !formEmail) {
      showToast({ type: "error", title: "Missing required fields" });
      return;
    }
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: `${formFirstName} ${formLastName}`,
      email: formEmail,
      role: formRole,
      department: formDepartment,
      shift: "Not assigned",
      nextShift: "Not scheduled",
      status: "Off Shift",
      hoursThisWeek: 0,
    };
    setTeam([newMember, ...team]);
    setIsAddStaffOpen(false);
    setFormFirstName("");
    setFormLastName("");
    setFormEmail("");
    setFormRole("Head Chef");
    setFormDepartment("Kitchen");
    showToast({
      type: "success",
      title: "Staff member added",
      message: newMember.name,
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Remove this staff member?")) return;
    setTeam((prev) => prev.filter((m) => m.id !== id));
    showToast({ type: "success", title: "Staff member removed" });
  };

  const handleExport = () => {
    setIsExportOpen(false);
    showToast({
      type: "success",
      title: "Schedule exported",
      message: "CSV download started",
    });
  };

  return (
    <div className="an-card">
      <div className="an-page-header">
        <span className="an-page-eyebrow">People & Control</span>
        <h2 className="an-page-title">Team & Schedules</h2>
        <p className="an-page-desc">
          Manage your restaurant staff, shifts, and weekly working hours
          efficiently.
        </p>
      </div>

      <div className="an-page-actions">
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Active Staff</span>
          <span className="an-metric-value">{activeStaffCount}</span>
          <span className="an-metric-sub">team members</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">On Shift</span>
          <span className="an-metric-value" style={{ color: "var(--success)" }}>
            {onShiftCount}
          </span>
          <span className="an-metric-sub">currently working</span>
        </div>
        <button
          className="an-btn an-btn-primary"
          onClick={() => setIsAddStaffOpen(true)}
        >
          <Plus size={16} /> Add Staff
        </button>
        <button
          className="an-btn an-btn-secondary"
          onClick={() => setIsExportOpen(true)}
        >
          <Download size={16} /> Export
        </button>
      </div>

      <div className="an-table-wrap">
        <div className="an-table-toolbar">
          <div className="an-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search staff, roles, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="an-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All departments</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Service">Service</option>
            <option value="Bar">Bar</option>
            <option value="Front of house">Front of house</option>
          </select>
          <input type="date" className="an-input" style={{ width: 140 }} />
          <button
            className="an-btn an-btn-secondary an-btn-sm"
            onClick={() => setIsExportOpen(true)}
            style={{ padding: "8px 14px" }}
          >
            Export
          </button>
          <button
            className="an-btn an-btn-primary an-btn-sm"
            onClick={() => setIsAddStaffOpen(true)}
            style={{ padding: "8px 14px" }}
          >
            Add Staff
          </button>
        </div>

        <div className="table-scroll">
          <table className="an-table">
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
              {filtered.map((member) => {
                const badge = getStatusBadge(member.status);
                return (
                  <tr key={member.id}>
                    <td>
                      <div className="user-cell">
                        <span className="avatar">
                          {member.name
                            .split(" ")
                            .map((x) => x[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                        <span>
                          <strong>{member.name}</strong>
                          <small>{member.email}</small>
                        </span>
                      </div>
                    </td>
                    <td>
                      <strong>{member.role}</strong>
                      <br />
                      <small>{member.department}</small>
                    </td>
                    <td>
                      <strong>{member.shift}</strong>
                    </td>
                    <td>{member.nextShift}</td>
                    <td>
                      <strong
                        style={{
                          color:
                            member.hoursThisWeek > 40
                              ? "var(--warning)"
                              : "inherit",
                        }}
                      >
                        {member.hoursThisWeek}h{" "}
                        {member.hoursThisWeek > 40 && "(Overtime)"}
                      </strong>
                    </td>
                    <td>
                      <span
                        className="an-badge"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        <span className="an-badge-dot" />
                        {member.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="an-btn an-btn-sm an-btn-secondary"
                          onClick={() => {
                            showToast({
                              type: "info",
                              title: `Schedule for ${member.name}`,
                            });
                          }}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                        >
                          Schedule
                        </button>
                        <button
                          className="an-btn an-btn-sm an-btn-secondary"
                          onClick={() => {
                            showToast({
                              type: "info",
                              title: `Editing ${member.name}`,
                            });
                          }}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          className="an-btn an-btn-sm an-btn-destructive"
                          onClick={() => handleDelete(member.id)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--brand-text-muted)",
                    }}
                  >
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsAddStaffOpen(false)}
        >
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close"
              onClick={() => {
                setIsAddStaffOpen(false);
                setFormFirstName("");
                setFormLastName("");
                setFormEmail("");
                setFormRole("Head Chef");
                setFormDepartment("Kitchen");
              }}
            >
              <X size={17} />
            </button>
            <span className="eyebrow">Add New Staff Member</span>
            <h2>Add New Staff Member</h2>
            <p>Enter the staff member details below.</p>
            <form onSubmit={handleAddStaff}>
              <div className="form-grid">
                <div className="an-form-group">
                  <label className="an-label">First Name</label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    placeholder="e.g. Karim"
                    className="an-input"
                  />
                </div>
                <div className="an-form-group">
                  <label className="an-label">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    placeholder="e.g. Haddad"
                    className="an-input"
                  />
                </div>
                <div className="an-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="an-label">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="staff@restaurant.com"
                    className="an-input"
                  />
                </div>
                <div className="an-form-group">
                  <label className="an-label">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="an-select"
                  >
                    <option>Head Chef</option>
                    <option>Waitress</option>
                    <option>Bartender</option>
                    <option>Manager</option>
                    <option>Cashier</option>
                    <option>Supervisor</option>
                  </select>
                </div>
                <div className="an-form-group">
                  <label className="an-label">Department</label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="an-select"
                  >
                    <option>Kitchen</option>
                    <option>Service</option>
                    <option>Bar</option>
                    <option>Front of house</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="secondary"
                  onClick={() => {
                    setIsAddStaffOpen(false);
                    setFormFirstName("");
                    setFormLastName("");
                    setFormEmail("");
                  }}
                >
                  Cancel
                </button>
                <button className="primary" type="submit">
                  Save Staff
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <div className="modal-backdrop" onClick={() => setIsExportOpen(false)}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setIsExportOpen(false)}>
              <X size={17} />
            </button>
            <span className="eyebrow">Export Schedule</span>
            <h2>Export Schedule</h2>
            <p>Select the format and date range for your export.</p>
            <div style={{ marginBottom: "20px" }}>
              <label className="an-label">Format</label>
              <select className="an-select">
                <option>CSV (Excel)</option>
                <option>PDF Document</option>
              </select>
            </div>
            <div className="an-form-group">
              <label className="an-label">Date Range</label>
              <select className="an-select">
                <option>This Week</option>
                <option>Next Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="modal-actions">
              <button
                className="secondary"
                onClick={() => setIsExportOpen(false)}
              >
                Cancel
              </button>
              <button className="primary" onClick={handleExport}>
                Download All
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
