import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Ellipsis,
  FileText,
  Pencil,
  Search,
  Table2,
  UserRound,
  Users,
  Utensils,
  X,
} from "lucide-react";
import {
  KEYS,
  RESERVATION_SEED,
  useEscape,
  useStore,
  type Reservation,
  type ReservationStatus,
} from "./store";

const statusClass = (status: ReservationStatus) => status.toLowerCase();
const tagClass = (tag: string) => tag.toLowerCase().replaceAll(" ", "-");

export function ReservationsPage() {
  const [tab, setTab] = useState("Today");
  const [shift, setShift] = useState("Dinner - 18:00");
  const [search, setSearch] = useState("");
  const [items, setItems] = useStore<Reservation[]>(
    KEYS.reservations,
    RESERVATION_SEED
  );
  const [notice, setNotice] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const selected = items.find((item) => item.id === detailId) || null;
  useEscape(detailId !== null, () => setDetailId(null));
  const inShift = (time: string) => {
    if (shift.startsWith("Lunch")) return time < "16:00";
    if (shift.startsWith("Late")) return time >= "21:00";
    return time >= "16:00" && time < "21:00";
  };
  const filtered = useMemo(
    () =>
      items
        .filter((item) =>
          tab === "Upcoming"
            ? item.time >= "19:00"
            : tab === "Waitlist"
              ? item.status === "Late"
              : true
        )
        .filter((item) => inShift(item.time))
        .filter((item) =>
          `${item.name} ${item.table} ${item.tags.join(" ")}`
            .toLowerCase()
            .includes(search.toLowerCase())
        ),
    [items, tab, search, shift]
  );
  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  };
  const update = (id: string, status: ReservationStatus) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
    notify(`Reservation marked ${status.toLowerCase()}`);
  };
  const cancelReservation = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (!confirm(`Cancel the reservation for ${item.name}?`)) return;
    setItems((current) => current.filter((i) => i.id !== id));
    if (detailId === id) setDetailId(null);
    notify(`${item.name}'s reservation cancelled`);
  };
  const action = (id: string, message: string) => {
    setSelectedId(id);
    notify(message);
  };
  return (
    <section className="reservations-page reservation-list-page">
      <div className="reservation-head">
        <div>
          <span className="eyebrow">GUEST FLOW</span>
          <h2>Reservations</h2>
          <p>
            Scan the room, spot special requirements, and move guests through
            service quickly.
          </p>
        </div>
        <div className="shift-control">
          <CalendarDays size={15} />
          <span>08 Oct 2026</span>
          <select
            aria-label="Select shift"
            value={shift}
            onChange={(event) => setShift(event.target.value)}
          >
            <option>Dinner - 18:00</option>
            <option>Lunch - 12:00</option>
            <option>Late - 21:00</option>
          </select>
          <ChevronDown size={13} />
        </div>
      </div>
      <div className="reservation-list-toolbar">
        <div className="module-tabs reservation-tabs">
          {["Today", "Upcoming", "Waitlist"].map((item) => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
            >
              {item}
              {item === "Waitlist" && <b>2</b>}
            </button>
          ))}
        </div>
        <div className="search reservation-search">
          <Search size={15} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reservations..."
          />
        </div>
      </div>
      {notice && (
        <div className="inline-notice">
          <Check size={14} />
          {notice}
        </div>
      )}
      {filtered.length === 0 ? (
        <EmptyState search={search} onReset={() => setSearch("")} />
      ) : (
        <div className="reservation-list">
          {filtered.map((item) => (
            <ReservationCard
              key={item.id}
              item={item}
              selected={selectedId === item.id}
              onSelect={() => setDetailId(item.id)}
              onStatus={update}
              onAction={action}
              onCancel={() => cancelReservation(item.id)}
            />
          ))}
        </div>
      )}
      {selected && (
        <ReservationDetail
          reservation={selected}
          onClose={() => setDetailId(null)}
          onAction={notify}
        />
      )}
    </section>
  );
}
function Summary({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="reservation-summary-card">
      <small>{label}</small>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  );
}
function ReservationCard({
  item,
  selected,
  onSelect,
  onStatus,
  onAction,
  onCancel,
}: {
  item: Reservation;
  selected: boolean;
  onSelect: () => void;
  onStatus: (id: string, status: ReservationStatus) => void;
  onAction: (id: string, message: string) => void;
  onCancel: () => void;
}) {
  return (
    <article
      className={`reservation-card list-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="reservation-card-main">
        <div className="reservation-guest-row">
          <div>
            <h3>{item.name}</h3>
            <div className="guest-tags">
              {item.tags.map((tag) => (
                <Tag key={tag} value={tag} />
              ))}
            </div>
          </div>
          <div className="reservation-time">
            <Clock3 size={14} />
            <strong>{item.time}</strong>
          </div>
        </div>
        <p className="reservation-note">{item.note}</p>
        <div className="reservation-details">
          <span>
            <Utensils size={14} />
            {item.table}
          </span>
          <span>
            <UserRound size={14} />
            {item.party} guests
          </span>
          <span>
            <CalendarDays size={14} />
            Dinner service
          </span>
        </div>
      </div>
      <div className="reservation-card-side">
        <StatusBadge status={item.status} />
        <div className="reservation-card-actions">
          <button
            className={`seat-button ${item.status === "Seated" || item.status === "Finished" ? "disabled" : ""}`}
            disabled={item.status === "Seated" || item.status === "Finished"}
            onClick={(event) => {
              event.stopPropagation();
              onStatus(item.id, "Seated");
            }}
          >
            <Check size={15} />
            {item.status === "Seated"
              ? "Seated"
              : item.status === "Finished"
                ? "Finished"
                : "Seat Guest"}
          </button>
          <MoreMenu
            item={item}
            onView={() =>
              onAction(item.id, `Viewing ${item.name}'s reservation`)
            }
            onEdit={() =>
              onAction(item.id, `Editing ${item.name}'s reservation`)
            }
            onLate={() => onStatus(item.id, "Late")}
            onSeated={() => onStatus(item.id, "Seated")}
            onCancel={onCancel}
            onNote={() => onAction(item.id, `Note added for ${item.name}`)}
          />
        </div>
      </div>
    </article>
  );
}
function Tag({ value }: { value: string }) {
  return <span className={`reservation-tag ${tagClass(value)}`}>{value}</span>;
}
function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span className={`reservation-status ${statusClass(status)}`}>
      <i />
      {status}
    </span>
  );
}
function MoreMenu({
  item,
  onView,
  onEdit,
  onLate,
  onSeated,
  onCancel,
  onNote,
}: {
  item: Reservation;
  onView: () => void;
  onEdit: () => void;
  onLate: () => void;
  onSeated: () => void;
  onCancel: () => void;
  onNote: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const run = (callback: () => void) => {
    callback();
    setOpen(false);
  };
  return (
    <div className="more-menu" ref={menuRef}>
      <button
        className="more-button"
        aria-label={`More actions for ${item.name}`}
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(!open);
        }}
      >
        <Ellipsis size={18} />
      </button>
      {open && (
        <div className="more-dropdown" role="menu">
          <button onClick={() => run(onView)}>
            <FileText size={14} />
            View Reservation
          </button>
          <button onClick={() => run(onEdit)}>
            <Pencil size={14} />
            Edit Reservation
          </button>
          <button onClick={() => run(() => onView())}>
            <Table2 size={14} />
            Change Table
          </button>
          {item.status !== "Late" && (
            <button onClick={() => run(onLate)}>
              <Clock3 size={14} />
              Mark as Late
            </button>
          )}
          {item.status !== "Seated" && (
            <button onClick={() => run(onSeated)}>
              <Check size={14} />
              Mark as Seated
            </button>
          )}
          <button className="danger-action" onClick={() => run(onCancel)}>
            <X size={14} />
            Cancel Reservation
          </button>
          <button onClick={() => run(onNote)}>
            <FileText size={14} />
            Add Note
          </button>
        </div>
      )}
    </div>
  );
}
function EmptyState({
  search,
  onReset,
}: {
  search: string;
  onReset: () => void;
}) {
  return (
    <div className="reservation-empty">
      <Users size={22} />
      <strong>No reservations found</strong>
      <span>
        {search
          ? "Try a different guest name, table, or tag."
          : "There are no reservations in this view."}
      </span>
      {search && <button onClick={onReset}>Clear search</button>}
    </div>
  );
}
function ReservationDetail({
  reservation,
  onClose,
  onAction,
}: {
  reservation: Reservation;
  onClose: () => void;
  onAction: (message: string) => void;
}) {
  return (
    <div
      className="reservation-detail-modal"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="reservation-detail-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="detail-close"
          onClick={onClose}
          aria-label="Close reservation details"
        >
          <X size={17} />
        </button>
        <span className="eyebrow">RESERVATION DETAILS</span>
        <h3>{reservation.name}</h3>
        <StatusBadge status={reservation.status} />
        <div className="detail-grid">
          <span>
            <Table2 size={14} />
            Table {reservation.table}
          </span>
          <span>
            <UserRound size={14} />
            {reservation.party} guests
          </span>
          <span>
            <Clock3 size={14} />
            {reservation.time}
          </span>
        </div>
        <p>{reservation.note}</p>
        <button
          className="primary"
          onClick={() => {
            onAction(`Edit flow opened for ${reservation.name}`);
            onClose();
          }}
        >
          <Pencil size={14} />
          Edit reservation
        </button>
      </div>
    </div>
  );
}
