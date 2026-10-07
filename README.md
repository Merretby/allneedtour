# Maison Atlas — Unified Business Platform

Frontend demonstration of a multi-business management platform. One owner account can switch between Restaurant, Travel Agency, Transport, Activities, and Accommodation.

The platform includes mandatory login, a global business selector, an All Businesses dashboard, business-specific navigation, restaurant RBAC, role-aware access, and logout session clearing.

## Start

Requirements: Node 22.12+.

```bash
npm install
npm test
npm run build
npm run dev
```

Open the Vite URL shown in the terminal. The demo normally runs on `http://localhost:5173/` or the next available port.

## Demo Login

All demo accounts use:

```text
Password: demo-owner
```

These are demonstration identities only. They are not real mailboxes and no email is sent.

### Global Account

| Role | Email | Access |
| --- | --- | --- |
| Super Admin / Owner | `sofia.owner@maisonatlas.com` | All businesses, global dashboard, users, roles, permissions, reports, settings and audit logs |

### Restaurant — Maison Atlas

| Role | Email |
| --- | --- |
| Super Admin / Owner | `sofia.restaurant-owner@maisonatlas.com` |
| Direction / Manager | `karim.direction@maisonatlas.com` |
| Restaurant Manager | `nora.restaurant-manager@maisonatlas.com` |
| Head Waiter / Supervisor | `yassine.supervisor@maisonatlas.com` |
| Chef / Kitchen Manager | `lina.chef@maisonatlas.com` |
| Kitchen Staff | `adam.kitchen@maisonatlas.com` |
| Cashier | `thomas.cashier@maisonatlas.com` |
| Purchasing / Stock Manager | `ines.purchasing@maisonatlas.com` |
| HR / Administration | `salma.hr@maisonatlas.com` |
| Employee / Staff | `mehdi.staff@maisonatlas.com` |

Restaurant navigation includes dashboard, reservations, floor plan, tables, services, menu, technical sheets, stock, purchases, suppliers, merchandise reception, inventories, losses and waste, payments, expenses, team, documents, reports, settings, users, roles, permissions and audit logs.

### Travel Agency — Atlas Travel Agency

| Role | Email |
| --- | --- |
| Travel Agency Owner | `sofia.travel-owner@maisonatlas.com` |
| Agency Manager | `nabil.travel-manager@maisonatlas.com` |
| Travel Agent | `aya.travel-agent@maisonatlas.com` |
| Accountant | `youssef.travel-accountant@maisonatlas.com` |
| Operations Manager | `meryem.travel-operations@maisonatlas.com` |
| Agency Staff | `omar.travel-staff@maisonatlas.com` |

Navigation includes today, client requests, dossiers, quotes, reservations, trips and circuits, services, suppliers, planning, clients, payments, documents, team, reports and settings.

### Transport — Atlas Transport

| Role | Email |
| --- | --- |
| Transport Owner | `sofia.transport-owner@maisonatlas.com` |
| Transport Manager | `hamza.transport-manager@maisonatlas.com` |
| Dispatch Manager | `amina.dispatch@maisonatlas.com` |
| Fleet Manager | `rachid.fleet@maisonatlas.com` |
| Driver | `ahmed.driver@maisonatlas.com` |
| Accountant | `nadia.transport-accountant@maisonatlas.com` |
| Transport Staff | `bilal.transport-staff@maisonatlas.com` |

Navigation includes today, transfers and trips, reservations, dispatch planning, vehicles, drivers, clients, payments, maintenance, incidents, reports and settings.

### Activities — Atlas Activities

| Role | Email |
| --- | --- |
| Activities Owner | `sofia.activities-owner@maisonatlas.com` |
| Activities Manager | `ikram.activities-manager@maisonatlas.com` |
| Activity Coordinator | `yanis.activity-coordinator@maisonatlas.com` |
| Guide / Instructor | `hajar.guide@maisonatlas.com` |
| Equipment Manager | `mehdi.equipment@maisonatlas.com` |
| Accountant | `siham.activities-accountant@maisonatlas.com` |
| Activity Staff | `soufiane.activity-staff@maisonatlas.com` |

Navigation includes today, activities, sessions and slots, reservations, participants, planning, guides, equipment, payments, incidents, reports and settings.

### Accommodation — Atlas Hébergement

| Role | Email |
| --- | --- |
| Accommodation Owner | `sofia.accommodation-owner@maisonatlas.com` |
| Hotel / Accommodation Manager | `karim.accommodation-manager@maisonatlas.com` |
| Receptionist | `loubna.reception@maisonatlas.com` |
| Housekeeping Manager | `fatima.housekeeping-manager@maisonatlas.com` |
| Housekeeping Staff | `amina.housekeeping@maisonatlas.com` |
| Maintenance | `rachid.maintenance@maisonatlas.com` |
| Accountant | `imad.accommodation-accountant@maisonatlas.com` |
| Accommodation Staff | `sara.accommodation-staff@maisonatlas.com` |

Navigation includes today, reservations, planning, rooms and units, guests, check-in and check-out, housekeeping, services, payments, team, documents, reports and settings.

## Owner Workflow

1. Open `/login`.
2. Sign in with `sofia.owner@maisonatlas.com` and `demo-owner`.
3. The All Businesses dashboard opens after authentication.
4. Open the business selector in the header.
5. Search or select a business.
6. The dashboard, navigation and business context update together.
7. Select All Businesses to return to the portfolio dashboard.
8. Use Log out to clear the demo session and return to `/login`.

## Protected Routes

```text
/login
/businesses
/business/restaurant/dashboard
/business/travel-agency/dashboard
/business/transport/dashboard
/business/activities/dashboard
/business/accommodation/dashboard
```

Opening a protected URL without an authenticated session renders the login screen. The active business is kept in session storage and cleared on logout.

## Important Limitation

This repository is currently a frontend demonstration. Authentication, business selection and demo permissions use local browser state. There is no production backend, database, mail provider, password hashing, API authorization layer, or server-side tenant isolation yet.

Before production use, add server-side authentication, business memberships, business-scoped database queries, API authorization, password reset and invitation emails, server-side audit logs, and database-level cross-business isolation.

Never use these demo emails or password for real customer, employee, financial or reservation data.

## Verification

```bash
npm test
npm run typecheck
npm run build
```
