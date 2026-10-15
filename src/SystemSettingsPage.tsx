import React, { useState } from "react";
import {
  Settings,
  Building2,
  Clock,
  Bell,
  CreditCard,
  Edit2,
  Search,
  Download,
  Check,
  X,
  Plus,
  ShieldAlert,
  ToggleLeft,
  ToggleRight,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";

const ICON_COLORS: Record<string, string> = {
  Building2: "#0e7771",
  ShieldAlert: "#c2410c",
  Clock: "#7c3aed",
  CreditCard: "#059669",
  Bell: "#d97706",
};

export function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState<string | null>(null);

  const tabs = [
    { key: "General", label: "General", icon: Settings },
    { key: "Service & Hours", label: "Service & Hours", icon: Clock },
    { key: "Financials", label: "Financials", icon: CreditCard },
    { key: "Notifications", label: "Notifications", icon: Bell },
  ] as const;

  return (
    <div className="module-page ss-page">
      <header className="ss-header">
        <div className="ss-header-main">
          <div className="ss-header-icon">
            <Settings size={20} />
          </div>
          <div>
            <h2>System Settings</h2>
            <p>
              Configure restaurant preferences, service rules, and operational
              defaults.
            </p>
          </div>
        </div>
        <div className="ss-header-actions">
          <button
            className="ss-btn ss-btn-outline"
            onClick={() => alert("Exporting configuration...")}
          >
            <Download size={14} /> Export Config
          </button>
          <button
            className="ss-btn ss-btn-primary"
            onClick={() => setShowEditModal("new_rule")}
          >
            <Plus size={14} /> Add Custom Rule
          </button>
        </div>
      </header>

      <div className="ss-toolbar">
        <div className="ss-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                className={`ss-tab ${isActive ? "ss-tab-active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="ss-search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="ss-content">
        {activeTab === "General" && (
          <div className="ss-grid">
            <div className="ss-card">
              <div className="ss-card-header">
                <div className="ss-card-icon building">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3>Restaurant Profile</h3>
                  <p>Basic information and identity</p>
                </div>
                <button
                  className="ss-icon-btn"
                  onClick={() => setShowEditModal("profile")}
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="ss-card-body">
                <div className="ss-row">
                  <span className="ss-label">Name</span>
                  <span className="ss-value">Restaurant Casablanca</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Address</span>
                  <span className="ss-value">123 Marina Blvd, Casablanca</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Phone</span>
                  <span className="ss-value">+212 522 123 456</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Email</span>
                  <span className="ss-value">contact@casablanca.ma</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Status</span>
                  <span className="ss-badge ss-badge-positive">Active</span>
                </div>
              </div>
            </div>

            <div className="ss-card">
              <div className="ss-card-header">
                <div className="ss-card-icon legal">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3>Legal & Registration</h3>
                  <p>Tax IDs and official documents</p>
                </div>
                <button
                  className="ss-icon-btn"
                  onClick={() => setShowEditModal("legal")}
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="ss-card-body">
                <div className="ss-row">
                  <span className="ss-label">Tax ID (ICE)</span>
                  <span className="ss-value">123456789000012</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Commercial Registry</span>
                  <span className="ss-value">RC 45678</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Company Type</span>
                  <span className="ss-value">SARL</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Service & Hours" && (
          <div className="ss-grid">
            <div className="ss-card">
              <div className="ss-card-header">
                <div className="ss-card-icon hours">
                  <Clock size={18} />
                </div>
                <div>
                  <h3>Operating Hours</h3>
                  <p>Daily schedule and shifts</p>
                </div>
                <button
                  className="ss-icon-btn"
                  onClick={() => setShowEditModal("hours")}
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="ss-card-body">
                <div className="ss-row">
                  <span className="ss-label">Monday – Friday</span>
                  <span className="ss-value">11:30 – 23:30</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Saturday – Sunday</span>
                  <span className="ss-value">11:30 – 00:30</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Holidays</span>
                  <span className="ss-badge ss-badge-neutral">
                    Special Schedule
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Timezone</span>
                  <span className="ss-value">Africa/Casablanca</span>
                </div>
              </div>
            </div>

            <div className="ss-card">
              <div className="ss-card-header">
                <div className="ss-card-icon rules">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3>Service Rules</h3>
                  <p>Table turnover and seating policies</p>
                </div>
                <button
                  className="ss-icon-btn"
                  onClick={() => setShowEditModal("rules")}
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="ss-card-body">
                <div className="ss-row">
                  <span className="ss-label">Table Turnover</span>
                  <span className="ss-value">90 minutes</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Grace Period</span>
                  <span className="ss-value">15 minutes</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Max Party Size</span>
                  <span className="ss-value">10 guests</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Financials" && (
          <div className="ss-grid">
            <div className="ss-card">
              <div className="ss-card-header">
                <div className="ss-card-icon currency">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3>Currency & Taxes</h3>
                  <p>Financial defaults</p>
                </div>
                <button
                  className="ss-icon-btn"
                  onClick={() => setShowEditModal("financial")}
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="ss-card-body">
                <div className="ss-row">
                  <span className="ss-label">Base Currency</span>
                  <span className="ss-value">MAD (Moroccan Dirham)</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Standard VAT</span>
                  <span className="ss-value">20%</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Reduced VAT (Food)</span>
                  <span className="ss-value">10%</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Rounding Rule</span>
                  <span className="ss-value">Nearest 0.05 MAD</span>
                </div>
              </div>
            </div>

            <div className="ss-card">
              <div className="ss-card-header">
                <div className="ss-card-icon payments">
                  <Bell size={18} />
                </div>
                <div>
                  <h3>Payment Methods</h3>
                  <p>Accepted payment options</p>
                </div>
                <button
                  className="ss-icon-btn"
                  onClick={() => setShowEditModal("payments")}
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="ss-card-body">
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Cash</span>
                  <div className="ss-toggle ss-toggle-on">
                    <ToggleRight size={16} />
                  </div>
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Credit Card</span>
                  <div className="ss-toggle ss-toggle-on">
                    <ToggleRight size={16} />
                  </div>
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Mobile Payment</span>
                  <div className="ss-toggle ss-toggle-off">
                    <ToggleLeft size={16} />
                  </div>
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Contactless</span>
                  <div className="ss-toggle ss-toggle-on">
                    <ToggleRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="ss-grid">
            <div className="ss-card">
              <div className="ss-card-header">
                <div className="ss-card-icon alerts">
                  <Bell size={18} />
                </div>
                <div>
                  <h3>System Alerts</h3>
                  <p>Automated notification rules</p>
                </div>
                <button
                  className="ss-icon-btn"
                  onClick={() => setShowEditModal("notifications")}
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="ss-card-body">
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Low Stock Alerts</span>
                  <div className="ss-toggle ss-toggle-on">
                    <ToggleRight size={16} />
                  </div>
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Daily Reports</span>
                  <div className="ss-toggle ss-toggle-on">
                    <ToggleRight size={16} />
                  </div>
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Voided Items</span>
                  <div className="ss-toggle ss-toggle-off">
                    <ToggleLeft size={16} />
                  </div>
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Reservation Reminders</span>
                  <div className="ss-toggle ss-toggle-on">
                    <ToggleRight size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="ss-card">
              <div className="ss-card-header">
                <div className="ss-card-icon channels">
                  <Mail size={18} />
                </div>
                <div>
                  <h3>Notification Channels</h3>
                  <p>How alerts are delivered</p>
                </div>
                <button
                  className="ss-icon-btn"
                  onClick={() => setShowEditModal("channels")}
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="ss-card-body">
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">In-App</span>
                  <div className="ss-toggle ss-toggle-on">
                    <ToggleRight size={16} />
                  </div>
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Email</span>
                  <div className="ss-toggle ss-toggle-off">
                    <ToggleLeft size={16} />
                  </div>
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">SMS</span>
                  <div className="ss-toggle ss-toggle-off">
                    <ToggleLeft size={16} />
                  </div>
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Push</span>
                  <div className="ss-toggle ss-toggle-on">
                    <ToggleRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showEditModal && (
        <div
          className="ss-modal-overlay"
          onClick={() => setShowEditModal(null)}
        >
          <div className="ss-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ss-modal-header">
              <h3>
                {showEditModal === "profile" && "Edit Restaurant Profile"}
                {showEditModal === "legal" && "Edit Legal Information"}
                {showEditModal === "hours" && "Edit Operating Hours"}
                {showEditModal === "rules" && "Edit Service Rules"}
                {showEditModal === "financial" && "Edit Financial Settings"}
                {showEditModal === "payments" && "Edit Payment Methods"}
                {showEditModal === "notifications" && "Edit Notifications"}
                {showEditModal === "channels" && "Edit Notification Channels"}
                {showEditModal === "new_rule" && "Add Custom Rule"}
              </h3>
              <button
                className="ss-icon-btn ss-icon-btn-close"
                onClick={() => setShowEditModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ss-modal-body">
              {showEditModal === "profile" && (
                <div className="ss-form-grid">
                  <div className="ss-form-group ss-full-width">
                    <label>Restaurant Name</label>
                    <input type="text" defaultValue="Restaurant Casablanca" />
                  </div>
                  <div className="ss-form-group ss-full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      defaultValue="123 Marina Blvd, Casablanca"
                    />
                  </div>
                  <div className="ss-form-group">
                    <label>Phone Number</label>
                    <input type="tel" defaultValue="+212 522 123 456" />
                  </div>
                  <div className="ss-form-group">
                    <label>Public Email</label>
                    <input type="email" defaultValue="contact@casablanca.ma" />
                  </div>
                </div>
              )}

              {showEditModal === "legal" && (
                <div className="ss-form-grid">
                  <div className="ss-form-group ss-full-width">
                    <label>Tax ID (ICE)</label>
                    <input type="text" defaultValue="123456789000012" />
                  </div>
                  <div className="ss-form-group">
                    <label>Commercial Registry (RC)</label>
                    <input type="text" defaultValue="RC 45678" />
                  </div>
                  <div className="ss-form-group">
                    <label>Company Type</label>
                    <select defaultValue="SARL">
                      <option value="SARL">SARL</option>
                      <option value="SA">SA</option>
                      <option value="SNC">SNC</option>
                    </select>
                  </div>
                </div>
              )}

              {showEditModal === "hours" && (
                <div className="ss-form-grid">
                  <div className="ss-form-group">
                    <label>Weekday Opening</label>
                    <input type="time" defaultValue="11:30" />
                  </div>
                  <div className="ss-form-group">
                    <label>Weekday Closing</label>
                    <input type="time" defaultValue="23:30" />
                  </div>
                  <div className="ss-form-group">
                    <label>Weekend Opening</label>
                    <input type="time" defaultValue="11:30" />
                  </div>
                  <div className="ss-form-group">
                    <label>Weekend Closing</label>
                    <input type="time" defaultValue="00:30" />
                  </div>
                </div>
              )}

              {showEditModal === "rules" && (
                <div className="ss-form-grid">
                  <div className="ss-form-group">
                    <label>Table Turnover (minutes)</label>
                    <input type="number" defaultValue="90" />
                  </div>
                  <div className="ss-form-group">
                    <label>Grace Period (minutes)</label>
                    <input type="number" defaultValue="15" />
                  </div>
                  <div className="ss-form-group">
                    <label>Max Party Size</label>
                    <input type="number" defaultValue="10" />
                  </div>
                </div>
              )}

              {showEditModal === "financial" && (
                <div className="ss-form-grid">
                  <div className="ss-form-group ss-full-width">
                    <label>Base Currency</label>
                    <select defaultValue="MAD">
                      <option value="MAD">MAD – Moroccan Dirham</option>
                      <option value="EUR">EUR – Euro</option>
                      <option value="USD">USD – US Dollar</option>
                    </select>
                  </div>
                  <div className="ss-form-group">
                    <label>Standard VAT (%)</label>
                    <input type="number" defaultValue="20" />
                  </div>
                  <div className="ss-form-group">
                    <label>Reduced VAT (%)</label>
                    <input type="number" defaultValue="10" />
                  </div>
                </div>
              )}

              {showEditModal === "payments" && (
                <div className="ss-form-grid">
                  <div className="ss-form-group ss-full-width">
                    <label>Payment Methods</label>
                    <div className="ss-chip-list">
                      <label className="ss-chip ss-chip-selected">
                        <input type="checkbox" defaultChecked={true} /> Cash
                      </label>
                      <label className="ss-chip ss-chip-selected">
                        <input type="checkbox" defaultChecked={true} /> Credit
                        Card
                      </label>
                      <label className="ss-chip">
                        <input type="checkbox" defaultChecked={false} /> Mobile
                        Payment
                      </label>
                      <label className="ss-chip ss-chip-selected">
                        <input type="checkbox" defaultChecked={true} />{" "}
                        Contactless
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {(showEditModal === "notifications" ||
                showEditModal === "channels" ||
                showEditModal === "new_rule") && (
                <div className="ss-form-grid">
                  <div className="ss-form-group ss-full-width">
                    <label>Rule Name</label>
                    <input type="text" placeholder="e.g. Low Stock Alert" />
                  </div>
                  <div className="ss-form-group">
                    <label>Trigger Event</label>
                    <select>
                      <option>Inventory below threshold</option>
                      <option>Voided transaction</option>
                      <option>End of day report ready</option>
                    </select>
                  </div>
                  <div className="ss-form-group">
                    <label>Notify Role</label>
                    <select>
                      <option>All Managers</option>
                      <option>Super Admins</option>
                      <option>Chefs</option>
                    </select>
                  </div>
                  <div className="ss-form-group ss-full-width">
                    <label>Notification Channels</label>
                    <div className="ss-chip-list">
                      <label className="ss-chip ss-chip-selected">
                        <input type="checkbox" defaultChecked={true} /> In-App
                      </label>
                      <label className="ss-chip">
                        <input type="checkbox" defaultChecked={false} /> Email
                      </label>
                      <label className="ss-chip">
                        <input type="checkbox" defaultChecked={false} /> SMS
                      </label>
                      <label className="ss-chip ss-chip-selected">
                        <input type="checkbox" defaultChecked={true} /> Push
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="ss-modal-footer">
              <button
                className="ss-btn ss-btn-outline"
                onClick={() => setShowEditModal(null)}
              >
                Cancel
              </button>
              <button
                className="ss-btn ss-btn-primary"
                onClick={() => setShowEditModal(null)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        :root {
          --ss-primary: #0e7771;
          --ss-primary-hover: #0c5f58;
          --ss-bg: #f5f7f4;
          --ss-card: #ffffff;
          --ss-border: #dce6e2;
          --ss-text: #18373d;
          --ss-text-muted: #71858a;
          --ss-success: #059669;
          --ss-warning: #d97706;
          --ss-danger: #c2410c;
        }

        .ss-page {
          position: relative;
          min-height: 100%;
        }

        .ss-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
          background: var(--ss-card);
          border-bottom: 1px solid var(--ss-border);
          margin-bottom: 0;
        }

        .ss-header-main {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ss-header-icon {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          background: #e8f4f2;
          color: var(--ss-primary);
          border-radius: 10px;
        }

        .ss-header-main h2 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 700;
          color: var(--ss-text);
          letter-spacing: -0.02em;
        }

        .ss-header-main p {
          margin: 0;
          font-size: 12px;
          color: var(--ss-text-muted);
        }

        .ss-header-actions {
          display: flex;
          gap: 10px;
        }

        .ss-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 38px;
          padding: 0 16px;
          border: 1px solid var(--ss-border);
          border-radius: 8px;
          background: var(--ss-card);
          color: var(--ss-text);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .ss-btn:hover {
          border-color: var(--ss-primary);
          color: var(--ss-primary);
          background: #eef6f5;
        }

        .ss-btn-outline {
          background: transparent;
        }

        .ss-btn-primary {
          background: var(--ss-primary);
          border-color: var(--ss-primary);
          color: #ffffff;
        }

        .ss-btn-primary:hover {
          background: var(--ss-primary-hover);
          border-color: var(--ss-primary-hover);
          color: #ffffff;
        }

        .ss-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 32px;
          background: var(--ss-card);
          border-bottom: 1px solid var(--ss-border);
        }

        .ss-tabs {
          display: flex;
          gap: 2px;
          border-bottom: 2px solid var(--ss-border);
        }

        .ss-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: var(--ss-text-muted);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .ss-tab:hover {
          color: var(--ss-primary);
          background: #f3f9f8;
        }

        .ss-tab-active {
          color: var(--ss-primary);
          border-bottom: 2px solid var(--ss-primary);
          background: #eef6f5;
        }

        .ss-search {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding: 0 14px;
          background: #f3f9f8;
          border: 1px solid var(--ss-border);
          border-radius: 8px;
        }

        .ss-search input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 12px;
          color: var(--ss-text);
          width: 180px;
        }

        .ss-content {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
          padding: 28px 32px;
        }

        .ss-card {
          background: var(--ss-card);
          border: 1px solid var(--ss-border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
        }

        .ss-card:hover {
          transform: translateY(-2px);
          border-color: #b9d7d2;
          box-shadow: 0 12px 32px rgba(24, 55, 61, 0.08);
        }

        .ss-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          background: #f4faf9;
          border-bottom: 1px solid var(--ss-border);
        }

        .ss-card-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          font-size: 18px;
        }

        .ss-card-icon.building { background: #e8f4f2; color: #0e7771; }
        .ss-card-icon.legal { background: #fdece3; color: #c2410c; }
        .ss-card-icon.hours { background: #f3e8ff; color: #7c3aed; }
        .ss-card-icon.rules { background: #fdece3; color: #c2410c; }
        .ss-card-icon.currency { background: #e6f7ef; color: #059669; }
        .ss-card-icon.payments { background: #fff4e3; color: #d97706; }
        .ss-card-icon.alerts { background: #fff4e3; color: #d97706; }
        .ss-card-icon.channels { background: #eef4fb; color: #1d4ed8; }

        .ss-card-header h3 {
          margin: 0 0 3px 0;
          font-size: 15px;
          font-weight: 700;
          color: var(--ss-text);
        }

        .ss-card-header p {
          margin: 0;
          font-size: 11.5px;
          color: var(--ss-text-muted);
        }

        .ss-icon-btn {
          margin-left: auto;
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          border: 1px solid var(--ss-border);
          border-radius: 6px;
          background: var(--ss-card);
          color: var(--ss-text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .ss-icon-btn:hover {
          background: var(--ss-primary);
          border-color: var(--ss-primary);
          color: #ffffff;
        }

        .ss-icon-btn-close {
          color: var(--ss-text-muted);
          background: transparent;
          border: none;
        }

        .ss-icon-btn-close:hover {
          background: #f3f4f6;
          color: var(--ss-text);
        }

        .ss-card-body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ss-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 0;
          border-bottom: 1px dashed #eef3f1;
          font-size: 13px;
        }

        .ss-row:last-child {
          border-bottom: none;
        }

        .ss-row-toggle {
          justify-content: space-between;
          align-items: center;
        }

        .ss-label {
          color: var(--ss-text-muted);
          font-size: 12.5px;
        }

        .ss-value {
          color: var(--ss-text);
          font-size: 13px;
          font-weight: 500;
        }

        .ss-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .ss-badge-positive {
          background: #eef7f1;
          color: #059669;
        }

        .ss-badge-neutral {
          background: #eef2f6;
          color: #64748b;
        }

        .ss-toggle {
          display: grid;
          place-items: center;
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: #e2e8f0;
          transition: all 0.2s ease;
        }

        .ss-toggle-on {
          background: var(--ss-primary);
          color: #ffffff;
        }

        .ss-toggle-off {
          background: #cbd5e1;
        }

        .ss-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(24, 55, 61, 0.45);
          backdrop-filter: blur(4px);
          display: grid;
          place-items: center;
          z-index: 100;
          padding: 24px;
        }

        .ss-modal {
          background: var(--ss-card);
          border-radius: 14px;
          width: 100%;
          max-width: 560px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 48px rgba(24, 55, 61, 0.18);
          border: 1px solid var(--ss-border);
          overflow: hidden;
        }

        .ss-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--ss-border);
          background: #fafbf9;
        }

        .ss-modal-header h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
          color: var(--ss-text);
        }

        .ss-modal-body {
          padding: 24px;
          overflow-y: auto;
        }

        .ss-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .ss-form-group.ss-full-width {
          grid-column: 1 / -1;
        }

        .ss-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ss-form-group label {
          font-size: 12px;
          font-weight: 600;
          color: var(--ss-text);
        }

        .ss-form-group input,
        .ss-form-group select {
          height: 40px;
          padding: 0 12px;
          border: 1px solid var(--ss-border);
          border-radius: 8px;
          background: var(--ss-card);
          color: var(--ss-text);
          font-size: 13px;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .ss-form-group input:focus,
        .ss-form-group select:focus {
          outline: none;
          border-color: var(--ss-primary);
          box-shadow: 0 0 0 3px rgba(14, 119, 113, 0.1);
        }

        .ss-chip-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ss-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: 1px solid var(--ss-border);
          border-radius: 20px;
          background: var(--ss-card);
          color: var(--ss-text-muted);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .ss-chip input {
          display: none;
        }

        .ss-chip-selected {
          background: var(--ss-primary);
          border-color: var(--ss-primary);
          color: #ffffff;
        }

        .ss-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid var(--ss-border);
          background: #fafbf9;
        }

        @media (max-width: 768px) {
          .ss-header {
            padding: 16px 20px;
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          .ss-header-actions {
            width: 100%;
            justify-content: space-between;
          }
          .ss-toolbar {
            padding: 14px 20px;
            flex-direction: column;
            gap: 14px;
            align-items: stretch;
          }
          .ss-search {
            width: 100%;
          }
          .ss-search input {
            width: auto;
            flex: 1;
          }
          .ss-content {
            padding: 20px;
            grid-template-columns: 1fr;
          }
          .ss-form-grid {
            grid-template-columns: 1fr;
          }
          .ss-modal {
            margin: 12px;
            max-height: 90vh;
          }
        }
      `}</style>
    </div>
  );
}
