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
import { useToast } from "./components/ToastProvider";
import { downloadCsv, useEscape } from "./store";

const SETTINGS_KEY = "allneeds.settings";

const DEFAULT_TOGGLES: Record<string, boolean> = {
  "pay-cash": true,
  "pay-card": true,
  "pay-mobile": false,
  "pay-contactless": true,
  "alert-low-stock": true,
  "alert-daily-reports": true,
  "alert-voided": false,
  "alert-reservations": true,
  "ch-inapp": true,
  "ch-email": false,
  "ch-sms": false,
  "ch-push": true,
};

export function SystemSettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return { ...DEFAULT_TOGGLES, ...(parsed.toggles || {}) };
    } catch {
      return { ...DEFAULT_TOGGLES };
    }
  });

  const closeModal = () => setShowEditModal(null);
  useEscape(showEditModal !== null, closeModal);

  const persist = (
    nextSettings: Record<string, string>,
    nextToggles: Record<string, boolean>
  ) => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ settings: nextSettings, toggles: nextToggles })
      );
    } catch {
      /* ignore */
    }
  };

  const toggle = (key: string, label: string) => {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      persist(settings, next);
      showToast({
        type: "info",
        title: `${label} ${next[key] ? "enabled" : "disabled"}`,
      });
      return next;
    });
  };

  const handleExportConfig = () => {
    downloadCsv("allneed-config.csv", [
      ["Section", "Key", "Value"],
      ...Object.entries(settings).map(([k, v]) => ["settings", k, v]),
      ...Object.entries(toggles).map(([k, v]) => [
        "toggle",
        k,
        v ? "on" : "off",
      ]),
    ]);
    showToast({
      type: "success",
      title: "Configuration exported",
      message: "allneed-config.csv",
    });
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = { ...settings };
    data.forEach((value, key) => {
      next[key] = String(value);
    });
    // Compose combined display values from separate time inputs.
    if (next["hours.weekOpen"] || next["hours.weekClose"]) {
      next["hours.weekday"] = `${next["hours.weekOpen"] ?? "11:30"} – ${
        next["hours.weekClose"] ?? "23:30"
      }`;
    }
    if (next["hours.wkndOpen"] || next["hours.wkndClose"]) {
      next["hours.weekend"] = `${next["hours.wkndOpen"] ?? "11:30"} – ${
        next["hours.wkndClose"] ?? "00:30"
      }`;
    }
    if (next["rules.turnover"]) next["rules.turnover"] = `${next["rules.turnover"]} minutes`;
    if (next["rules.grace"]) next["rules.grace"] = `${next["rules.grace"]} minutes`;
    if (next["rules.maxparty"]) next["rules.maxparty"] = `${next["rules.maxparty"]} guests`;
    if (next["fin.vat"]) next["fin.vat"] = `${next["fin.vat"]}%`;
    if (next["fin.reduced"]) next["fin.reduced"] = `${next["fin.reduced"]}%`;
    setSettings(next);
    persist(next, toggles);
    closeModal();
    showToast({ type: "success", title: "Settings saved" });
  };

  const initial = (key: string, fallback: string) => settings[key] ?? fallback;

  const q = searchQuery.trim().toLowerCase();
  const match = (text: string) => !q || text.toLowerCase().includes(q);

  const Toggle = ({ k, label }: { k: string; label: string }) => (
    <button
      type="button"
      className={`ss-toggle ${toggles[k] ? "ss-toggle-on" : "ss-toggle-off"}`}
      onClick={() => toggle(k, label)}
      aria-pressed={toggles[k]}
      aria-label={`${label}: ${toggles[k] ? "on" : "off"}`}
    >
      {toggles[k] ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
    </button>
  );

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
          <button className="ss-btn ss-btn-outline" onClick={handleExportConfig}>
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
            <div
              className="ss-card"
              style={{
                display: match(
                  "restaurant profile name address phone email status identity"
                )
                  ? undefined
                  : "none",
              }}
            >
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
                  <span className="ss-value">
                    {initial("profile.name", "Restaurant Casablanca")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Address</span>
                  <span className="ss-value">
                    {initial("profile.address", "123 Marina Blvd, Casablanca")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Phone</span>
                  <span className="ss-value">
                    {initial("profile.phone", "+212 522 123 456")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Email</span>
                  <span className="ss-value">
                    {initial("profile.email", "contact@casablanca.ma")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Status</span>
                  <span className="ss-badge ss-badge-positive">Active</span>
                </div>
              </div>
            </div>

            <div
              className="ss-card"
              style={{
                display: match(
                  "legal registration tax id ice commercial registry rc company type sarl"
                )
                  ? undefined
                  : "none",
              }}
            >
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
                  <span className="ss-value">
                    {initial("legal.ice", "123456789000012")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Commercial Registry</span>
                  <span className="ss-value">
                    {initial("legal.rc", "RC 45678")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Company Type</span>
                  <span className="ss-value">{initial("legal.type", "SARL")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Service & Hours" && (
          <div className="ss-grid">
            <div
              className="ss-card"
              style={{
                display: match(
                  "operating hours schedule shifts weekday weekend holidays timezone"
                )
                  ? undefined
                  : "none",
              }}
            >
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
                  <span className="ss-value">
                    {initial("hours.weekday", "11:30 – 23:30")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Saturday – Sunday</span>
                  <span className="ss-value">
                    {initial("hours.weekend", "11:30 – 00:30")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Holidays</span>
                  <span className="ss-badge ss-badge-neutral">
                    Special Schedule
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Timezone</span>
                  <span className="ss-value">
                    {initial("hours.timezone", "Africa/Casablanca")}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="ss-card"
              style={{
                display: match(
                  "service rules table turnover grace period max party size seating"
                )
                  ? undefined
                  : "none",
              }}
            >
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
                  <span className="ss-value">
                    {initial("rules.turnover", "90 minutes")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Grace Period</span>
                  <span className="ss-value">
                    {initial("rules.grace", "15 minutes")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Max Party Size</span>
                  <span className="ss-value">
                    {initial("rules.maxparty", "10 guests")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Financials" && (
          <div className="ss-grid">
            <div
              className="ss-card"
              style={{
                display: match(
                  "currency taxes financial base vat rounding"
                )
                  ? undefined
                  : "none",
              }}
            >
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
                  <span className="ss-value">
                    {initial("fin.currency", "MAD (Moroccan Dirham)")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Standard VAT</span>
                  <span className="ss-value">{initial("fin.vat", "20%")}</span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Reduced VAT (Food)</span>
                  <span className="ss-value">
                    {initial("fin.reduced", "10%")}
                  </span>
                </div>
                <div className="ss-row">
                  <span className="ss-label">Rounding Rule</span>
                  <span className="ss-value">
                    {initial("fin.rounding", "Nearest 0.05 MAD")}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="ss-card"
              style={{
                display: match(
                  "payment methods cash credit card mobile payment contactless"
                )
                  ? undefined
                  : "none",
              }}
            >
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
                  <Toggle k="pay-cash" label="Cash" />
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Credit Card</span>
                  <Toggle k="pay-card" label="Credit Card" />
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Mobile Payment</span>
                  <Toggle k="pay-mobile" label="Mobile Payment" />
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Contactless</span>
                  <Toggle k="pay-contactless" label="Contactless" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="ss-grid">
            <div
              className="ss-card"
              style={{
                display: match(
                  "system alerts low stock daily reports voided items reservation reminders notifications"
                )
                  ? undefined
                  : "none",
              }}
            >
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
                  <Toggle k="alert-low-stock" label="Low Stock Alerts" />
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Daily Reports</span>
                  <Toggle k="alert-daily-reports" label="Daily Reports" />
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Voided Items</span>
                  <Toggle k="alert-voided" label="Voided Items" />
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Reservation Reminders</span>
                  <Toggle k="alert-reservations" label="Reservation Reminders" />
                </div>
              </div>
            </div>

            <div
              className="ss-card"
              style={{
                display: match(
                  "notification channels in-app email sms push delivery"
                )
                  ? undefined
                  : "none",
              }}
            >
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
                  <Toggle k="ch-inapp" label="In-App" />
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Email</span>
                  <Toggle k="ch-email" label="Email" />
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">SMS</span>
                  <Toggle k="ch-sms" label="SMS" />
                </div>
                <div className="ss-row ss-row-toggle">
                  <span className="ss-label">Push</span>
                  <Toggle k="ch-push" label="Push" />
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

            <form
              id="ss-settings-form"
              onSubmit={handleSave}
              className="ss-modal-body"
            >
              {showEditModal === "profile" && (
                <div className="ss-form-grid">
                  <div className="ss-form-group ss-full-width">
                    <label>Restaurant Name</label>
                    <input
                      type="text"
                      name="profile.name"
                      defaultValue={initial("profile.name", "Restaurant Casablanca")}
                    />
                  </div>
                  <div className="ss-form-group ss-full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      name="profile.address"
                      defaultValue={initial(
                        "profile.address",
                        "123 Marina Blvd, Casablanca"
                      )}
                    />
                  </div>
                  <div className="ss-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="profile.phone"
                      defaultValue={initial("profile.phone", "+212 522 123 456")}
                    />
                  </div>
                  <div className="ss-form-group">
                    <label>Public Email</label>
                    <input
                      type="email"
                      name="profile.email"
                      defaultValue={initial(
                        "profile.email",
                        "contact@casablanca.ma"
                      )}
                    />
                  </div>
                </div>
              )}

              {showEditModal === "legal" && (
                <div className="ss-form-grid">
                  <div className="ss-form-group ss-full-width">
                    <label>Tax ID (ICE)</label>
                    <input
                      type="text"
                      name="legal.ice"
                      defaultValue={initial("legal.ice", "123456789000012")}
                    />
                  </div>
                  <div className="ss-form-group">
                    <label>Commercial Registry (RC)</label>
                    <input
                      type="text"
                      name="legal.rc"
                      defaultValue={initial("legal.rc", "RC 45678")}
                    />
                  </div>
                  <div className="ss-form-group">
                    <label>Company Type</label>
                    <select
                      name="legal.type"
                      defaultValue={initial("legal.type", "SARL")}
                    >
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
                    <input
                      type="time"
                      name="hours.weekOpen"
                      defaultValue={initial("hours.weekOpen", "11:30")}
                    />
                  </div>
                  <div className="ss-form-group">
                    <label>Weekday Closing</label>
                    <input
                      type="time"
                      name="hours.weekClose"
                      defaultValue={initial("hours.weekClose", "23:30")}
                    />
                  </div>
                  <div className="ss-form-group">
                    <label>Weekend Opening</label>
                    <input
                      type="time"
                      name="hours.wkndOpen"
                      defaultValue={initial("hours.wkndOpen", "11:30")}
                    />
                  </div>
                  <div className="ss-form-group">
                    <label>Weekend Closing</label>
                    <input
                      type="time"
                      name="hours.wkndClose"
                      defaultValue={initial("hours.wkndClose", "00:30")}
                    />
                  </div>
                </div>
              )}

              {showEditModal === "rules" && (
                <div className="ss-form-grid">
                  <div className="ss-form-group">
                    <label>Table Turnover (minutes)</label>
                    <input
                      type="number"
                      name="rules.turnover"
                      defaultValue={initial("rules.turnover", "90 minutes").replace(
                        /[^0-9]/g,
                        ""
                      ) || "90"}
                    />
                  </div>
                  <div className="ss-form-group">
                    <label>Grace Period (minutes)</label>
                    <input
                      type="number"
                      name="rules.grace"
                      defaultValue={initial("rules.grace", "15 minutes").replace(
                        /[^0-9]/g,
                        ""
                      ) || "15"}
                    />
                  </div>
                  <div className="ss-form-group">
                    <label>Max Party Size</label>
                    <input
                      type="number"
                      name="rules.maxparty"
                      defaultValue={initial("rules.maxparty", "10 guests").replace(
                        /[^0-9]/g,
                        ""
                      ) || "10"}
                    />
                  </div>
                </div>
              )}

              {showEditModal === "financial" && (
                <div className="ss-form-grid">
                  <div className="ss-form-group ss-full-width">
                    <label>Base Currency</label>
                    <select
                      name="fin.currency"
                      defaultValue={initial("fin.currency", "MAD")}
                    >
                      <option value="MAD">MAD – Moroccan Dirham</option>
                      <option value="EUR">EUR – Euro</option>
                      <option value="USD">USD – US Dollar</option>
                    </select>
                  </div>
                  <div className="ss-form-group">
                    <label>Standard VAT (%)</label>
                    <input
                      type="number"
                      name="fin.vat"
                      defaultValue={initial("fin.vat", "20%").replace(/[^0-9]/g, "") || "20"}
                    />
                  </div>
                  <div className="ss-form-group">
                    <label>Reduced VAT (%)</label>
                    <input
                      type="number"
                      name="fin.reduced"
                      defaultValue={initial("fin.reduced", "10%").replace(/[^0-9]/g, "") || "10"}
                    />
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
            </form>

            <div className="ss-modal-footer">
              <button
                type="button"
                className="ss-btn ss-btn-outline"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="ss-settings-form"
                className="ss-btn ss-btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        :root {
          --ss-primary: var(--brand-blue);
          --ss-primary-hover: var(--brand-blue-hover);
          --ss-bg: var(--brand-bg);
          --ss-card: #ffffff;
          --ss-border: var(--brand-border);
          --ss-text: var(--brand-navy);
          --ss-text-muted: var(--brand-text-muted);
          --ss-success: var(--success);
          --ss-warning: var(--warning);
          --ss-danger: var(--error);
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
          background: var(--brand-surface);
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
          background: var(--brand-surface);
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
          background: var(--brand-surface);
        }

        .ss-tab-active {
          color: var(--ss-primary);
          border-bottom: 2px solid var(--ss-primary);
          background: var(--brand-surface);
        }

        .ss-search {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding: 0 14px;
          background: var(--brand-surface);
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
          border-color: var(--brand-border);
          box-shadow: 0 12px 32px rgba(11, 23, 57, 0.08);
        }

        .ss-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          background: var(--brand-bg);
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

        .ss-card-icon.building { background: var(--brand-surface); color: var(--brand-blue); }
        .ss-card-icon.legal { background: var(--error-bg); color: var(--error); }
        .ss-card-icon.hours { background: var(--brand-surface); color: var(--brand-blue); }
        .ss-card-icon.rules { background: var(--error-bg); color: var(--error); }
        .ss-card-icon.currency { background: var(--success-bg); color: var(--success); }
        .ss-card-icon.payments { background: var(--warning-bg); color: var(--warning); }
        .ss-card-icon.alerts { background: var(--warning-bg); color: var(--warning); }
        .ss-card-icon.channels { background: var(--brand-surface); color: var(--brand-blue); }

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
          background: var(--brand-bg);
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
          border-bottom: 1px dashed var(--brand-border);
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
          background: var(--success-bg);
          color: var(--success);
        }

        .ss-badge-neutral {
          background: var(--brand-bg);
          color: var(--brand-text-muted);
        }

        .ss-toggle {
          display: grid;
          place-items: center;
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: var(--brand-border);
          transition: all 0.2s ease;
        }

        .ss-toggle-on {
          background: var(--ss-primary);
          color: #ffffff;
        }

        .ss-toggle-off {
          background: var(--brand-border);
        }

        .ss-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11, 23, 57, 0.45);
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
          box-shadow: 0 24px 48px rgba(11, 23, 57, 0.18);
          border: 1px solid var(--ss-border);
          overflow: hidden;
        }

        .ss-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--ss-border);
          background: var(--brand-bg);
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
          box-shadow: 0 0 0 3px rgba(0, 140, 255, 0.15);
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
          background: var(--brand-bg);
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
