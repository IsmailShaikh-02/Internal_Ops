# InternalOps — Platform Owner Console
## Product Documentation

**Product:** InternalOps Platform Owner Console
**Audience:** Platform Owner (super-admin) — full access to every screen, every tenant, every configuration.
**Design language:** Enterprise SaaS, inspired by Microsoft 365 Admin Center, Atlassian Admin, Linear, Notion Enterprise, GitHub Enterprise, AWS Console, and Stripe Dashboard.
Frontend Framework: React 19
Build Tool: Vite
Routing: React Router v7
State Management:
- React Context (Authentication, Theme)
- Zustand (only if global client state grows)
Data Fetching:
- Axios
Forms:
- React Hook Form + Zod
Styling:
- Tailwind CSS v4
UI Components:
- shadcn/ui
Charts:
- Recharts
Icons:
- Lucide React
Notifications:
- Sonner
---

## 1. Purpose

InternalOps is the internal control plane for a multi-tenant SaaS business. It gives the Platform Owner and internal operations team a single console to:

- Provision and administer customer tenants
- Manage subscriptions, invoices, and revenue
- Configure product modules, feature flags, and releases
- Govern internal staff, roles, and permissions
- Run customer support (tickets, bugs, KB, announcements)
- Monitor infrastructure health, jobs, and logs
- Enforce security policies and audit every action
- Administer AI usage, prompts, models, and cost
- Manage external integrations, webhooks, and API keys
- Deliver cross-module reports and exports
- Configure platform-wide settings and communications

---

## 2. Global Architecture

### 2.1 Three-level navigation

```
┌───────────┬──────────────┬────────────────────────────────┐
│ Global    │ Module       │ Page (with in-page tabs)       │
│ rail      │ sidebar      │                                │
│ (12 apps) │ (sections)   │ Header · Filters · Content     │
└───────────┴──────────────┴────────────────────────────────┘
```

1. **Global rail** — 12 top-level modules, collapsible to icon-only.
2. **Module sidebar** — sections and sub-screens for the active module.
3. **Page + tabs** — breadcrumb, page header, filters, in-page tab groups.

### 2.2 Top bar (global)

- Global search (⌘K) across tenants, invoices, users, logs
- Quick actions menu (new tenant, plan, invite user, announcement, maintenance)
- Help
- Notifications (with unread indicator)
- Profile chip (Platform Owner identity)

### 2.3 Reusable UI primitives

| Component       | Purpose                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------- |
| `PageHeader`    | Breadcrumb, title, description, primary CTA                                                   |
| `SectionTabs`   | In-page tab groups                                                                            |
| `DataTable`     | Sort · filter · search · column visibility · export · bulk actions · pagination · row actions |
| `StatCard`      | KPI tile with delta and sparkline slot                                                        |
| `StatusChip`    | Semantic status (Active / Suspended / Paid / Overdue / Open / Failed …)                       |
| `DetailDrawer`  | Right-side detail panel                                                                       |
| `EmptyState`    | Zero-data / no-results state                                                                  |
| `FormShell`     | Validation, unsaved-changes guard, save / save+continue / reset                               |
| `ConfirmDialog` | Destructive action confirmation                                                               |
| `Toast`         | Success / warning / error feedback                                                            |

### 2.4 UX patterns

- Every list view: header + breadcrumb + search + filters + column controls + primary CTA
- Every destructive action: confirm modal + success toast
- Every detail record: right-side drawer OR full detail page with inner tabs
- Every form: inline validation, unsaved-changes guard
- Loading, empty, and error states on every screen

---

## 3. Modules & Screens

Twelve top-level modules. Every screen is accessible to the Platform Owner.

---

### 3.1 Dashboard  `/`

Platform-wide KPIs, revenue and health at a glance.

**Sections**
- Overview
  - Platform Overview — MRR/ARR, active tenants, trials, churn, incidents, AI spend, support backlog, live activity feed

---

### 3.2 Tenant Management  `/tenants`

Provision, monitor, and administer customer organizations.

**Sections**
- Tenants
  - All Tenants (list, filters: plan · status · region · MRR band)
  - Create Tenant (multi-step: org · owner · plan · modules · branding)
  - Activity (tenant-scoped activity stream)
  - Audit (tenant-scoped audit log)

**Tenant detail (`/tenants/$id`) — inner tabs**
1. Overview — health, plan, seats, storage, key contacts
2. Subscription — plan, billing cycle, renewal, discounts
3. Users — tenant users, roles, invitations, seat usage
4. Modules — enabled/disabled modules for this tenant
5. Storage — storage quotas, consumption, per-bucket breakdown
6. Branding — logo, colors, custom domain
7. Activity — per-tenant activity feed
8. Audit — per-tenant audit trail
9. Timeline — lifecycle events (created · upgraded · suspended · reactivated)

**Actions:** Suspend · Activate · Impersonate · Reset owner · Force logout · Delete (with confirmation).

---

### 3.3 Subscription & Billing  `/billing`

Plans, invoices, revenue, and finance operations.

**Sections**
- Catalog — Plans, Plan Comparison, Coupons, Taxes
- Money — Subscriptions, Invoices, Payments, Refunds
- Analytics — Revenue Dashboard, Revenue Reports

Details include: invoice line items, payment attempts, refund workflow, coupon redemption history, tax rules per region.

---

### 3.4 Feature Management  `/features`

Modules, feature flags, plan mapping, and releases.

**Sections**
- Product
  - Modules — enable/disable product modules platform-wide
  - Feature Flags — targeted rollout (percentage, tenant list, plan)
  - Tenant Overrides — per-tenant flag overrides
  - Plan Feature Mapping — which features belong to which plans
  - Release Management — release notes, rollout schedule, kill-switch

---

### 3.5 Platform Users  `/users`

Internal team members, roles, and permissions.

**Sections**
- People — Users, Roles, Permission Groups, Permissions, Role Assignment
- Governance — Security Policies

Includes: invite flow, MFA enforcement, session termination, permission matrix, role clone, granular permission editor.

---

### 3.6 Support Center  `/support`

Customer tickets, bug reports, and knowledge base.

**Sections**
- Queues — Support Dashboard, Support Tickets, Bug Reports, Feature Requests, Customer Requests
- Content — Announcements, Knowledge Articles

Ticket detail: conversation thread, internal notes, SLA timer, attachments, linked tenant, escalation, merge, status workflow.

---

### 3.7 Monitoring  `/monitoring`

System health, infrastructure, and log inspection.

**Sections**
- Infrastructure — System Health, Server Monitoring, API Monitoring, Queue Monitoring, Redis Monitoring, Storage Monitoring, Database Monitoring
- Jobs & Logs — Background Jobs, Scheduler, Error Logs, Application Logs, Live Logs

Each screen: time-series charts, threshold alerts, drill-down log table with structured filters (level · service · request-id · tenant).

---

### 3.8 Security  `/security`

Access audit trail, sessions, and platform policies.

**Sections**
- Access — Security Dashboard, Login History, Failed Logins, Sessions, Blocked IPs, Impersonation, MFA
- Governance — Audit Logs, Security Policies

Includes: force logout, block IP, revoke session, MFA reset, impersonation audit trail (who impersonated which tenant, when, why).

---

### 3.9 AI Administration  `/ai`

Models, prompts, and AI cost governance.

**Sections**
- Usage — AI Dashboard, AI Usage, Token Usage, AI Analytics, Cost Analytics
- Configuration — Prompt Library, Prompt Templates, Model Configuration

Includes: per-tenant token spend, per-prompt success rate, model routing rules, prompt versioning, cost caps.

---

### 3.10 Integrations  `/integrations`

External providers, webhooks, and API keys.

**Sections**
- Providers — Email Providers, SMS Providers, WhatsApp, Cloudflare R2, OpenAI, OAuth Providers, Payment Gateways
- Developer — Webhooks, API Keys

Includes: test-connection, rotation, delivery logs, retry queue, scopes, revocation.

---

### 3.11 Reports  `/reports`

Cross-module reporting and data export.

**Sections**
- Revenue Reports — MRR waterfall, ARR by plan, churn cohort, expansion, refunds, coupon impact
- Tenant Reports — growth, provisioning funnel, activation, storage per plan
- Subscription Reports — active subs, trial conversion, renewals due, downgrades
- Usage Reports — module adoption, feature usage, seat utilization, storage utilization
- AI Reports — tokens per tenant, cost per prompt, success rate, latency percentiles
- Support Reports — ticket volume, first response SLA, resolution SLA, CSAT trend
- Security Reports — failed logins, MFA coverage, impersonation events, blocked IPs
- Export Center — CSV / PDF / XLSX exports, scheduled delivery, re-run history

---

### 3.12 Settings  `/settings`

Platform-wide configuration and templates.

**Sections**
- Platform — General Settings, Branding, Localization, System Preferences, Maintenance Mode
- Communications — Email Templates, Notification Templates
- Operations — Backup & Restore

---

## 4. Screen Inventory (Quick Reference)

| # | Module | Screens |
|---|---|---|
| 1 | Dashboard | 1 |
| 2 | Tenant Management | 4 list + 9-tab detail |
| 3 | Subscription & Billing | 10 |
| 4 | Feature Management | 5 |
| 5 | Platform Users | 6 |
| 6 | Support Center | 7 |
| 7 | Monitoring | 12 |
| 8 | Security | 9 |
| 9 | AI Administration | 8 |
| 10 | Integrations | 9 |
| 11 | Reports | 8 |
| 12 | Settings | 8 |

**Total:** ~95 top-level screens + 9 tenant-detail tabs, all built on the shared design system.

---

## 5. Roles & Access

**Platform Owner** — super-admin. Full permissions across every module and every tenant. No feature is hidden.

Additional internal roles (managed under Platform Users → Roles) inherit a subset of these permissions and are governed by the permission matrix. Tenants have their own users, managed inside each tenant record.

---

## 6. Design System

- **Palette:** neutral enterprise (near-white surface, ink foreground) + one restrained accent. No purple gradients.
- **Radii:** `rounded-xl` on cards, `rounded-lg` on controls.
- **Shadow:** single soft elevation token (`--shadow-soft`).
- **Type:** tight scale, sans-serif; numeric tabular for tables and KPIs.
- **Density:** comfortable table row height, generous section spacing, consistent 24px page gutter.
- **States:** every screen ships loading skeletons, empty states, and error states.

---

## 7. Non-Goals

- No backend logic in this deliverable — data is typed mock data.
- No marketing / landing pages.
- No end-customer (tenant-user) UI — this console is for the platform operator.

