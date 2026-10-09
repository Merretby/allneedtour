import React, { useState } from "react";
import {
  Settings,
  Building2,
  Clock,
  Bell,
  CreditCard,
  Edit2,
  Search,
  Filter,
  Download,
  Check,
  X,
  Plus,
  Trash2,
  ShieldAlert,
} from "lucide-react";

export function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState<string | null>(null);

  const tabs = ["General", "Service & Hours", "Financials", "Notifications"];

  return (
    <div className="module-page">
      <header className="module-header">
        <div className="module-title">
          <div className="icon-wrapper">
            <Settings size={18} />
          </div>
          <div>
            <h2>System Settings</h2>
            <p>Control restaurant preferences, service rules and operational defaults</p>
          </div>
        </div>
        <div className="module-actions">
          <button className="secondary" onClick={() => alert("Exporting configuration...")}>
            <Download size={14} /> Export Config
          </button>
          <button className="primary" onClick={() => setShowEditModal("new_rule")}>
            <Plus size={14} /> Add Custom Rule
          </button>
        </div>
      </header>

      <div className="module-toolbar">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="toolbar-actions">
          <div className="search-box">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="module-content">
        {activeTab === "General" && (
          <div className="settings-grid">
            <div className="setting-card">
              <div className="setting-header">
                <div className="setting-icon"><Building2 size={20} /></div>
                <div>
                  <h3>Restaurant Profile</h3>
                  <p>Basic information and identity</p>
                </div>
                <button className="icon-btn edit-btn" onClick={() => setShowEditModal("profile")}>
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="setting-body">
                <div className="setting-row">
                  <span className="label">Name</span>
                  <span className="value">Restaurant Casablanca</span>
                </div>
                <div className="setting-row">
                  <span className="label">Address</span>
                  <span className="value">123 Marina Blvd, Casablanca</span>
                </div>
                <div className="setting-row">
                  <span className="label">Phone</span>
                  <span className="value">+212 522 123 456</span>
                </div>
                <div className="setting-row">
                  <span className="label">Status</span>
                  <span className="badge positive">Active</span>
                </div>
              </div>
            </div>

            <div className="setting-card">
              <div className="setting-header">
                <div className="setting-icon"><ShieldAlert size={20} /></div>
                <div>
                  <h3>Legal & Registration</h3>
                  <p>Tax IDs and official documents</p>
                </div>
                <button className="icon-btn edit-btn" onClick={() => setShowEditModal("legal")}>
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="setting-body">
                <div className="setting-row">
                  <span className="label">Tax ID (ICE)</span>
                  <span className="value">123456789000012</span>
                </div>
                <div className="setting-row">
                  <span className="label">Commercial Registry</span>
                  <span className="value">RC 45678</span>
                </div>
                <div className="setting-row">
                  <span className="label">Company Type</span>
                  <span className="value">SARL</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Service & Hours" && (
          <div className="settings-grid">
            <div className="setting-card">
              <div className="setting-header">
                <div className="setting-icon"><Clock size={20} /></div>
                <div>
                  <h3>Operating Hours</h3>
                  <p>Daily schedule and shifts</p>
                </div>
                <button className="icon-btn edit-btn" onClick={() => setShowEditModal("hours")}>
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="setting-body">
                <div className="setting-row">
                  <span className="label">Monday - Friday</span>
                  <span className="value">11:30 - 23:30</span>
                </div>
                <div className="setting-row">
                  <span className="label">Saturday - Sunday</span>
                  <span className="value">11:30 - 00:30</span>
                </div>
                <div className="setting-row">
                  <span className="label">Holidays</span>
                  <span className="value">Special Schedule</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Financials" && (
          <div className="settings-grid">
            <div className="setting-card">
              <div className="setting-header">
                <div className="setting-icon"><CreditCard size={20} /></div>
                <div>
                  <h3>Currency & Taxes</h3>
                  <p>Financial defaults</p>
                </div>
                <button className="icon-btn edit-btn" onClick={() => setShowEditModal("financial")}>
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="setting-body">
                <div className="setting-row">
                  <span className="label">Base Currency</span>
                  <span className="value">MAD (Moroccan Dirham)</span>
                </div>
                <div className="setting-row">
                  <span className="label">Standard VAT</span>
                  <span className="value">20%</span>
                </div>
                <div className="setting-row">
                  <span className="label">Reduced VAT (Food)</span>
                  <span className="value">10%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="settings-grid">
            <div className="setting-card">
              <div className="setting-header">
                <div className="setting-icon"><Bell size={20} /></div>
                <div>
                  <h3>System Alerts</h3>
                  <p>Automated notification rules</p>
                </div>
                <button className="icon-btn edit-btn" onClick={() => setShowEditModal("notifications")}>
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="setting-body">
                <div className="setting-row">
                  <span className="label">Low Stock Alerts</span>
                  <span className="badge positive">Enabled</span>
                </div>
                <div className="setting-row">
                  <span className="label">Daily Reports</span>
                  <span className="badge positive">Enabled</span>
                </div>
                <div className="setting-row">
                  <span className="label">Voided Items</span>
                  <span className="badge warning">Managers Only</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(null)}>
          <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {showEditModal === "profile" && "Edit Restaurant Profile"}
                {showEditModal === "legal" && "Edit Legal Information"}
                {showEditModal === "hours" && "Edit Operating Hours"}
                {showEditModal === "financial" && "Edit Financial Settings"}
                {showEditModal === "notifications" && "Edit Notifications"}
                {showEditModal === "new_rule" && "Add Custom Rule"}
              </h3>
              <button className="icon-btn" onClick={() => setShowEditModal(null)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body">
              {showEditModal === "profile" && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Restaurant Name</label>
                    <input type="text" defaultValue="Restaurant Casablanca" />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input type="text" defaultValue="123 Marina Blvd, Casablanca" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" defaultValue="+212 522 123 456" />
                  </div>
                  <div className="form-group">
                    <label>Public Email</label>
                    <input type="email" defaultValue="contact@casablanca.ma" />
                  </div>
                </div>
              )}

              {showEditModal === "legal" && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Tax ID (ICE)</label>
                    <input type="text" defaultValue="123456789000012" />
                  </div>
                  <div className="form-group">
                    <label>Commercial Registry (RC)</label>
                    <input type="text" defaultValue="RC 45678" />
                  </div>
                  <div className="form-group">
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
                <div className="form-grid">
                  <div className="form-group">
                    <label>Weekday Opening</label>
                    <input type="time" defaultValue="11:30" />
                  </div>
                  <div className="form-group">
                    <label>Weekday Closing</label>
                    <input type="time" defaultValue="23:30" />
                  </div>
                  <div className="form-group">
                    <label>Weekend Opening</label>
                    <input type="time" defaultValue="11:30" />
                  </div>
                  <div className="form-group">
                    <label>Weekend Closing</label>
                    <input type="time" defaultValue="00:30" />
                  </div>
                </div>
              )}

              {showEditModal === "financial" && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Base Currency</label>
                    <select defaultValue="MAD">
                      <option value="MAD">MAD - Moroccan Dirham</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - US Dollar</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Standard VAT (%)</label>
                    <input type="number" defaultValue="20" />
                  </div>
                  <div className="form-group">
                    <label>Reduced VAT (%)</label>
                    <input type="number" defaultValue="10" />
                  </div>
                </div>
              )}

              {(showEditModal === "notifications" || showEditModal === "new_rule") && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Rule Name</label>
                    <input type="text" placeholder="e.g. Low Stock Alert" />
                  </div>
                  <div className="form-group">
                    <label>Trigger Event</label>
                    <select>
                      <option>Inventory below threshold</option>
                      <option>Voided transaction</option>
                      <option>End of day report ready</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Notify Role</label>
                    <select>
                      <option>All Managers</option>
                      <option>Super Admins</option>
                      <option>Chefs</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="secondary" onClick={() => setShowEditModal(null)}>Cancel</button>
              <button className="primary" onClick={() => setShowEditModal(null)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 16px;
          padding: 24px;
        }
        .setting-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        .setting-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .setting-icon {
          width: 40px;
          height: 40px;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
        }
        .setting-header h3 {
          margin: 0 0 4px 0;
          font-size: 15px;
          color: #0f172a;
        }
        .setting-header p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }
        .setting-header .edit-btn {
          margin-left: auto;
          color: #64748b;
        }
        .setting-header .edit-btn:hover {
          color: #0f172a;
          background: #e2e8f0;
        }
        .setting-body {
          padding: 16px 20px;
        }
        .setting-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px dashed #e2e8f0;
        }
        .setting-row:last-child {
          border-bottom: none;
        }
        .setting-row .label {
          color: #64748b;
          font-size: 14px;
        }
        .setting-row .value {
          color: #0f172a;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
