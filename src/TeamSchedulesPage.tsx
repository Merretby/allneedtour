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
import {
  KEYS,
  TEAM_SEED,
  downloadCsv,
  useEscape,
  useStore,
  type TeamMember,
} from "./store";

export type { TeamMember };

export const TeamSchedulesPage: React.FC = () => {
  const { showToast } = useToast();
  const [team, setTeam] = useStore<TeamMember[]>(KEYS.team, TEAM_SEED);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("Head Chef");
  const [formDepartment, setFormDepartment] = useState("Kitchen");
  const [formShift, setFormShift] = useState("Morning (06:00 - 15:00)");
  const [formStatus, setFormStatus] =
    useState<TeamMember["status"]>("Off Shift");

  const closeAddStaff = () => {
    setIsAddStaffOpen(false);
    setEditingId(null);
    setFormFirstName("");
    setFormLastName("");
    setFormEmail("");
    setFormRole("Head Chef");
    setFormDepartment("Kitchen");
    setFormShift("Morning (06:00 - 15:00)");
    setFormStatus("Off Shift");
  };
  const closeExport = () => setIsExportOpen(false);

  useEscape(isAddStaffOpen, closeAddStaff);
  useEscape(isExportOpen, closeExport);

  const filtered = team.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter !== "All" && m.department !== filter) return false;
    if (statusFilter !== "All" && m.status !== statusFilter) return false;
    return matchesSearch;
  });

  const activeStaffCount = team.filter((m) => m.status !== "Leave").length;
  const onShiftCount = team.filter((m) => m.status === "On Shift").length;

  const getStatusBadge = (status: string) => {
    if (status === "On Shift")
      return { bg: "var(--success-bg)", color: "var(--success)" };
    if (status === "Off Shift")
      return { bg: "var(--brand-bg)", color: "var(--brand-text-muted)" };
    return { bg: "var(--warning-bg)", color: "var(--warning)" };
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName || !formLastName || !formEmail) {
      showToast({ type: "error", title: "Missing required fields" });
      return;
    }
    if (editingId) {
      setTeam((prev) =>
        prev.map((m) =>
          m.id === editingId
            ? {
                ...m,
                name: `${formFirstName} ${formLastName}`,
                email: formEmail,
                role: formRole,
                department: formDepartment,
                shift: formShift,
                status: formStatus,
              }
            : m
        )
      );
      showToast({ type: "success", title: "Staff member updated" });
      closeAddStaff();
      return;
    }
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: `${formFirstName} ${formLastName}`,
      email: formEmail,
      role: formRole,
      department: formDepartment,
      shift: "Not assigned",
      nextShift: "Not scheduled",
      status: "Off Shift",
      hoursThisWeek: 0,
    };
    setTeam((prev) => [newMember, ...prev]);
    closeAddStaff();
    showToast({
      type: "success",
      title: "Staff member added",
      message: newMember.name,
    });
  };

  const handleEdit = (member: TeamMember) => {
    const [first, ...rest] = member.name.split(" ");
    setEditingId(member.id);
    setFormFirstName(first);
    setFormLastName(rest.join(" "));
    setFormEmail(member.email);
    setFormRole(member.role);
    setFormDepartment(member.department);
    setFormShift(member.shift);
    setFormStatus(member.status);
    setIsAddStaffOpen(true);
  };

  const handleSchedule = (member: TeamMember) => {
    handleEdit(member);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Remove this staff member?")) return;
    setTeam((prev) => prev.filter((m) => m.id !== id));
    showToast({ type: "success", title: "Staff member removed" });
  };

  const handleExport = () => {
    setIsExportOpen(false);
    downloadCsv("allneed-team-schedule.csv", [
      ["Name", "Email", "Role", "Department", "Shift", "Next shift", "Status", "Hours/week"],
      ...filtered.map((m) => [
        m.name,
        m.email,
        m.role,
        m.department,
        m.shift,
        m.nextShift,
        m.status,
        m.hoursThisWeek,
      ]),
    ]);
    showToast({
      type: "success",
      title: "Schedule exported",
      message: `${filtered.length} member(s) downloaded as CSV`,
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
          <select
            className="an-select"
            style={{ width: 150 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="On Shift">On Shift</option>
            <option value="Off Shift">Off Shift</option>
            <option value="Leave">Leave</option>
          </select>
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
                          onClick={() => handleSchedule(member)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                        >
                          Schedule
                        </button>
                        <button
                          className="an-btn an-btn-sm an-btn-secondary"
                          onClick={() => handleEdit(member)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          aria-label={`Edit ${member.name}`}
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
          onClick={closeAddStaff}
        >
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close"
              onClick={closeAddStaff}
              aria-label="Close"
            >
              <X size={17} />
            </button>
            <span className="eyebrow">
              {editingId ? "Edit Staff Member" : "Add New Staff Member"}
            </span>
            <h2>{editingId ? "Edit Staff Member" : "Add New Staff Member"}</h2>
            <p>Enter the staff member details below.</p>
            <form onSubmit={handleSaveStaff}>
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
                {editingId && (
                  <>
                    <div className="an-form-group">
                      <label className="an-label">Shift</label>
                      <select
                        value={formShift}
                        onChange={(e) => setFormShift(e.target.value)}
                        className="an-select"
                      >
                        <option>Not assigned</option>
                        <option>Morning (06:00 - 15:00)</option>
                        <option>Morning (08:00 - 16:00)</option>
                        <option>Evening (16:00 - 00:00)</option>
                        <option>Night (18:00 - 02:00)</option>
                        <option>Off</option>
                      </select>
                    </div>
                    <div className="an-form-group">
                      <label className="an-label">Status</label>
                      <select
                        value={formStatus}
                        onChange={(e) =>
                          setFormStatus(e.target.value as TeamMember["status"])
                        }
                        className="an-select"
                      >
                        <option value="On Shift">On Shift</option>
                        <option value="Off Shift">Off Shift</option>
                        <option value="Leave">Leave</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary" onClick={closeAddStaff}>
                  Cancel
                </button>
                <button className="primary" type="submit">
                  {editingId ? "Save Changes" : "Save Staff"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <div className="modal-backdrop" onClick={closeExport}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close"
              onClick={closeExport}
              aria-label="Close"
            >
              <X size={17} />
            </button>
            <span className="eyebrow">Export Schedule</span>
            <h2>Export Schedule</h2>
            <p>Export the current filtered staff list as a CSV file.</p>
            <div style={{ marginBottom: "20px" }}>
              <label className="an-label">Format</label>
              <select className="an-select" defaultValue="CSV (Excel)">
                <option>CSV (Excel)</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={closeExport}>
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
