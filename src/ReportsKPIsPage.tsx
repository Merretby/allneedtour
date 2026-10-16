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
import { downloadCsv, useEscape } from "./store";

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
  const [statusFilter, setStatusFilter] = useState("All");
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<KPIReport | null>(null);

  // Form state
  const [formType, setFormType] = useState("Financial Summary");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formDashboard, setFormDashboard] = useState(true);
  const [formEmail, setFormEmail] = useState(false);

  const closeNewReport = () => {
    setIsNewReportOpen(false);
    setFormType("Financial Summary");
    setFormStartDate("");
    setFormEndDate("");
    setFormDashboard(true);
    setFormEmail(false);
  };
  const closeExport = () => setIsExportOpen(false);
  const closeDetail = () => setSelectedReport(null);

  useEscape(isNewReportOpen, closeNewReport);
  useEscape(isExportOpen, closeExport);
  useEscape(selectedReport !== null, closeDetail);

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter !== "All" && r.category !== filter) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    return matchesSearch;
  });

  const reportsGenerated = reports.filter(
    (r) => r.status === "Generated"
  ).length;

  const getTrendBadge = (trend: string) => {
    if (trend === "up")
      return { bg: "var(--success-bg)", color: "var(--success)" };
    if (trend === "down")
      return { bg: "var(--warning-bg)", color: "var(--warning)" };
    return { bg: "var(--brand-bg)", color: "var(--brand-text-muted)" };
  };

  const getStatusBadge = (status: string) => {
    if (status === "Generated")
      return { bg: "var(--brand-bg)", color: "var(--brand-text-muted)" };
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
    setReports((prev) => [newReport, ...prev]);
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
    downloadCsv("allneed-reports.csv", [
      ["Title", "Category", "Period", "Value", "Comparison", "Status"],
      ...filtered.map((r) => [
        r.title,
        r.category,
        r.period,
        r.value,
        r.comparison,
        r.status,
      ]),
    ]);
    showToast({
      type: "success",
      title: "Reports exported",
      message: `${filtered.length} report(s) downloaded as CSV`,
    });
  };

  const handleViewData = (report: KPIReport) => {
    setSelectedReport(report);
  };

  const handleExportReport = (report: KPIReport) => {
    downloadCsv(`${report.title.replace(/\s+/g, "-").toLowerCase()}.csv`, [
      ["Title", "Category", "Period", "Key metric", "Comparison", "Status"],
      [
        report.title,
        report.category,
        report.period,
        report.value,
        report.comparison,
        report.status,
      ],
    ]);
    showToast({
      type: "success",
      title: "Report exported",
      message: `${report.title} (CSV)`,
    });
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
          <select
            className="an-select"
            style={{ width: 150 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Generated">Generated</option>
            <option value="Scheduled">Scheduled</option>
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
                          onClick={() => handleViewData(report)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          title="View report"
                          aria-label={`View ${report.title}`}
                        >
                          <BarChart2 size={12} />
                        </button>
                        <button
                          className="an-btn an-btn-sm an-btn-secondary"
                          onClick={() => handleExportReport(report)}
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          title="Export report"
                          aria-label={`Export ${report.title}`}
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
          onClick={closeNewReport}
        >
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close"
              onClick={closeNewReport}
              aria-label="Close"
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
                <button type="button" className="secondary" onClick={closeNewReport}>
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
            <span className="eyebrow">Export Reports</span>
            <h2>Export Reports</h2>
            <p>Export the current filtered list of reports as a CSV file.</p>
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

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="modal-backdrop" onClick={closeDetail}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close"
              onClick={closeDetail}
              aria-label="Close"
            >
              <X size={17} />
            </button>
            <span className="eyebrow">{selectedReport.category} report</span>
            <h2>{selectedReport.title}</h2>
            <p>{selectedReport.period}</p>
            <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
              <div className="an-metric">
                <span className="an-metric-label">Key metric</span>
                <span className="an-metric-value">{selectedReport.value}</span>
                <span className="an-metric-sub">
                  {selectedReport.comparison}
                </span>
              </div>
              <div className="an-metric">
                <span className="an-metric-label">Trend</span>
                <span className="an-metric-value">
                  {selectedReport.trend === "up"
                    ? "Increasing"
                    : selectedReport.trend === "down"
                      ? "Decreasing"
                      : "Stable"}
                </span>
                <span className="an-metric-sub">
                  Status: {selectedReport.status}
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={closeDetail}>
                Close
              </button>
              <button
                className="primary"
                onClick={() => {
                  handleExportReport(selectedReport);
                  closeDetail();
                }}
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
