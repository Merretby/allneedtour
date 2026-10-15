import React, { useState } from "react";
import {
  Search,
  Download,
  BarChart2,
  TrendingUp,
  Users,
  X,
  Plus,
} from "lucide-react";
import { useToast } from "./components/ToastProvider";

interface KPIReport {
  id: string;
  title: string;
  category: string;
  period: string;
  trend: "up" | "down" | "stable";
  value: string;
  comparison: string;
  status: "Generated" | "Scheduled";
}

const MOCK_REPORTS: KPIReport[] = [
  {
    id: "1",
    title: "Monthly Revenue Summary",
    category: "Financial",
    period: "October 2026",
    trend: "up",
    value: "142,500.00 MAD",
    comparison: "+12.4% vs last month",
    status: "Generated",
  },
  {
    id: "2",
    title: "Average Table Turn",
    category: "Operations",
    period: "Last 7 Days",
    trend: "down",
    value: "45 mins",
    comparison: "-5 mins vs last week",
    status: "Generated",
  },
  {
    id: "3",
    title: "Staff Attendance",
    category: "HR",
    period: "This Week",
    trend: "stable",
    value: "98%",
    comparison: "Unchanged",
    status: "Generated",
  },
  {
    id: "4",
    title: "Food Waste Cost",
    category: "Operations",
    period: "October 2026",
    trend: "down",
    value: "4,200.00 MAD",
    comparison: "-15% vs last month",
    status: "Scheduled",
  },
  {
    id: "5",
    title: "Customer Satisfaction Score",
    category: "Marketing",
    period: "Q3 2026",
    trend: "up",
    value: "4.8/5.0",
    comparison: "+0.2 pts vs Q2",
    status: "Generated",
  },
];

export const ReportsKPIsPage: React.FC = () => {
  const { showToast } = useToast();
  const [reports, setReports] = useState<KPIReport[]>(MOCK_REPORTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Form state
  const [formType, setFormType] = useState("Financial Summary");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formDashboard, setFormDashboard] = useState(true);
  const [formEmail, setFormEmail] = useState(false);

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "All") return matchesSearch;
    return matchesSearch && r.category === filter;
  });

  const reportsGenerated = reports.filter(
    (r) => r.status === "Generated"
  ).length;

  const getTrendBadge = (trend: string) => {
    if (trend === "up")
      return { bg: "var(--success-bg)", color: "var(--success)" };
    if (trend === "down")
      return { bg: "var(--warning-bg)", color: "var(--warning)" };
    return { bg: "#F3F4F6", color: "#6B7280" };
  };

  const getStatusBadge = (status: string) => {
    if (status === "Generated") return { bg: "#F3F4F6", color: "#6B7280" };
    return { bg: "var(--brand-surface)", color: "var(--brand-blue)" };
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: KPIReport = {
      id: Date.now().toString(),
      title: `${formType} Report`,
      category: formType,
      period: `${formStartDate || "Custom"} – ${formEndDate || "Custom"}`,
      trend: "stable",
      value: "—",
      comparison: "No data yet",
      status: "Scheduled",
    };
    setReports([newReport, ...reports]);
    setIsNewReportOpen(false);
    setFormType("Financial Summary");
    setFormStartDate("");
    setFormEndDate("");
    setFormDashboard(true);
    setFormEmail(false);
    showToast({
      type: "success",
      title: "Report generated",
      message: `${formType} report has been scheduled`,
    });
  };

  const handleExport = () => {
    setIsExportOpen(false);
    showToast({
      type: "success",
      title: "Reports exported",
      message: "CSV download started",
    });
  };

  const handleViewData = (title: string) => {
    showToast({ type: "info", title: `Viewing ${title}` });
  };

  const handleDownloadPDF = (title: string) => {
    showToast({ type: "success", title: `${title} PDF downloaded` });
  };

  return (
    <div className="an-card">
      <div className="an-page-header">
        <span className="an-page-eyebrow">Performance</span>
        <h2 className="an-page-title">Reports & KPIs</h2>
        <p className="an-page-desc">
          Turn service, financial and operational data into clear decisions.
        </p>
      </div>

      <div className="an-page-actions">
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Reports Ready</span>
          <span className="an-metric-value">{reportsGenerated}</span>
          <span className="an-metric-sub">generated reports</span>
        </div>
        <div className="an-metric" style={{ flex: 1, minWidth: 200 }}>
          <span className="an-metric-label">Avg. Profit Margin</span>
          <span className="an-metric-value" style={{ color: "var(--success)" }}>
            24.5%
          </span>
          <span className="an-metric-sub">across all modules</span>
        </div>
        <button
          className="an-btn an-btn-primary"
          onClick={() => setIsNewReportOpen(true)}
        >
          <Plus size={16} /> New Report
        </button>
        <button
          className="an-btn an-btn-secondary"
          onClick={() => setIsExportOpen(true)}
        >
          <Download size={16} /> Export All
        </button>
      </div>

      <div className="an-table-wrap">
        <div className="an-table-toolbar">
          <div className="an-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search reports or metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="an-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Financial">Financial</option>
            <option value="Operations">Operations</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
          </select>
          <select className="an-select" style={{ width: 150 }}>
            <option>Last 30 days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>

        <div className="table-scroll">
          <table className="an-table">
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
              {filtered.map((report) => {
                const trend = getTrendBadge(report.trend);
                const status = getStatusBadge(report.status);
                return (
                  <tr key={report.id}>
                    <td>
                      <strong>{report.title}</strong>
                    </td>
                    <td>{report.category}</td>
                    <td>{report.period}</td>
                    <td>
                      <strong>{report.value}</strong>
                      <br />
                      <small>{report.comparison}</small>
                    </td>
                    <td>
                      <span
                        className="an-badge"
                        style={{ background: trend.bg, color: trend.color }}
                      >
                        <span className="an-badge-dot" />
                        {report.trend === "up"
                          ? "Increasing"
                          : report.trend === "down"
                            ? "Decreasing"
                            : "Stable"}
                      </span>
                    </td>
                    <td>
                      <span
                        className="an-badge"
                        style={{ background: status.bg, color: status.color }}
                      >
                        <span className="an-badge-dot" />
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="an-btn an-btn-sm an-btn-secondary"
                          onClick={() => handleViewData(report.title)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                        >
                          <BarChart2 size={12} />
                        </button>
                        <button
                          className="an-btn an-btn-sm an-btn-secondary"
                          onClick={() => handleDownloadPDF(report.title)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                        >
                          <Download size={13} />
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
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Report Modal */}
      {isNewReportOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsNewReportOpen(false)}
        >
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close"
              onClick={() => {
                setIsNewReportOpen(false);
                setFormType("Financial Summary");
                setFormStartDate("");
                setFormEndDate("");
                setFormDashboard(true);
                setFormEmail(false);
              }}
            >
              <X size={17} />
            </button>
            <span className="eyebrow">Generate New Report</span>
            <h2>Generate New Report</h2>
            <p>Configure and generate a new performance report.</p>
            <form onSubmit={handleGenerateReport}>
              <div className="an-form-group">
                <label className="an-label">Report Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="an-select"
                >
                  <option value="Financial Summary">Financial Summary</option>
                  <option value="Sales by Category">Sales by Category</option>
                  <option value="Staff Attendance & Payroll">
                    Staff Attendance & Payroll
                  </option>
                  <option value="Inventory & Waste Logs">
                    Inventory & Waste Logs
                  </option>
                </select>
              </div>
              <div className="form-grid">
                <div className="an-form-group">
                  <label className="an-label">Start Date</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="an-input"
                  />
                </div>
                <div className="an-form-group">
                  <label className="an-label">End Date</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="an-input"
                  />
                </div>
              </div>
              <div className="an-form-group">
                <label className="an-label">Delivery Method</label>
                <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      color: "var(--brand-text-muted)",
                    }}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={formDashboard}
                      onChange={(e) => setFormDashboard(e.target.checked)}
                    />{" "}
                    View on Dashboard
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      color: "var(--brand-text-muted)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formEmail}
                      onChange={(e) => setFormEmail(e.target.checked)}
                    />{" "}
                    Send via Email
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="secondary"
                  onClick={() => {
                    setIsNewReportOpen(false);
                    setFormType("Financial Summary");
                    setFormStartDate("");
                    setFormEndDate("");
                    setFormDashboard(true);
                    setFormEmail(false);
                  }}
                >
                  Cancel
                </button>
                <button className="primary" type="submit">
                  Generate
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
            <span className="eyebrow">Export Reports</span>
            <h2>Export Reports</h2>
            <p>Export the current filtered list of reports.</p>
            <div style={{ marginBottom: "20px" }}>
              <label className="an-label">Format</label>
              <select className="an-select">
                <option>CSV (Excel)</option>
                <option>PDF Document</option>
                <option>JSON</option>
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
