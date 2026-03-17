🚀 Governance Control Plane
Multi-Tenant Policy Lifecycle & Approval Engine (RBAC + ABAC)

A production-grade SaaS Governance Platform that simulates, evaluates, approves, executes, and rolls back policy changes across tenants with strict state machine enforcement and zero-trust route protection.

🧠 What This Is

A full-stack Governance Control Plane designed to:

* Simulate RBAC & ABAC policy changes before activation
* Quantify risk impact and blast radius
* Enforce structured approval workflows
* Execute policies atomically with rollback support
* Provide real-time governance visibility

This is not a CRUD app.
It is a lifecycle-driven policy orchestration engine.

---

### 🚀 Live Demo & Portfolio Access

> **Live Application URL:** [https://tms-pi-silk.vercel.app](https://tms-pi-silk.vercel.app)

**Enterprise Security Architecture Notice:**
Because this platform manages destructive, administrative-level governance data with strict multi-tenant isolation, **public sign-ups are intentionally disabled via a Zero-Trust Invitation Model.**

**How to review this project:**
To test the full capability of the Control Plane (including Super Admin cross-tenant simulations and Manager approval workflows), **please reach out to me directly:**

* **LinkedIn:** [Tej Praval Pula](https://www.linkedin.com/in/tej-praval-pula/)
* **Email:** [tejpraval32@gmail.com](mailto:tejpraval32@gmail.com)
* **GitHub:** [Tejpraval](https://github.com/Tejpraval)

I will use the platform's orchestration engine to provision an isolated sandbox environment and generate a secure, single-use cryptographic invite link specifically for you.

---

## 🌟 Master Feature List (End-to-End)

This section details every feature built into the Governance Control Plane from the ground up:

### 1. Authentication & Security (Zero-Trust Model)
- **JWT-Based Authentication:** Secure access and refresh token lifecycle.
- **CSRF Protection:** Hardened state mutations using synchronized CSRF tokens.
- **Strict Registration/Login:** Only invited users or explicitly generated credentials can access the system.
- **Secure Logout:** Token revocation to instantly kill active sessions.

### 2. Multi-Tenant Architecture
- **Tenant Isolation:** Every user, role, policy, and audit log is strictly scoped to a `tenantId`. A user from Tenant A physically cannot query data from Tenant B.
- **Tenant Provisioning:** Ability to create new isolated tenant spaces with their own default configurations.
- **Soft Deletes & Suspensions:** Tenants can be marked as `SUSPENDED` or `ARCHIVED` without destroying relational data.

### 3. Identity & Zero-Trust User Invites
- **Super Admin Provisioning:** Super Admins can securely invite initial Tenant Admins.
- **Cryptographic Invite Links:** Single-use, expiratory invite logic bypassing public sign-ups for enterprise security.
- **User Management:** Tenant Admins can provision Managers and ordinary Users within their boundary.
- **Super Admin Impersonation:** Platform Admins can generate a scoped impersonation token to securely log in as a Tenant Admin for support/troubleshooting without credentials, protected by anti-loop guards.

### 4. Hybrid Authorization (RBAC + ABAC)
- **Static RBAC Matrix:** Built-in unalterable roles (`SUPER_ADMIN`, `TENANT_ADMIN`, `MANAGER`, `USER`).
- **Dynamic Custom Roles:** Tenants can compose and assign custom roles dynamically.
- **Attribute-Based Access Control (ABAC):** Fine-grained constraint checking (e.g., checking if an action relies on the status of a specific resource).

### 5. Policy Lifecycle Engine (The Core)
- **Version Control:** Policies exist as immutable versions (`DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `EXECUTED`).
- **Draft Creation:** Propose access changes without impacting live production configurations.
- **Hybrid Simulation Engine:** Simulates proposed changes against existing users/resources.
- **Blast Radius Calculation:** Quantifies exactly how many users will gain or lose permissions visually.
- **Risk Scoring Algorithm:** Dynamically categorizes changes into `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL` risk severity.
- **Human-Readable Explanations:** Explains *why* a diff occurred in plain English (e.g., "User lost READ access because Custom Role XYZ was detached").

### 6. Risk-Based Approval Workflows
- **Authority Enforcement Engine:** Only `MANAGER` can approve MEDIUM risk. Only `TENANT_ADMIN` can approve HIGH risk. Only `SUPER_ADMIN` can approve CRITICAL risk.
- **Approval Dashboards:** Queues showing pending policy changes awaiting a decision.
- **Performance Metrics:** Tracks the average time it takes for an authority figure to approve/reject a change.

### 7. Execution & Deterministic Rollback
- **Atomic Execution:** Approved policies are pushed live via MongoDB distributed transactions ensuring data consistency.
- **Cache Invalidation:** Instantly purges cached policy trees to enforce changes in real-time.
- **Deterministic Rollback:** If a live policy causes issues, admins can revert it. Instead of a destructive restore, the engine generates an additive new version bringing the state perfectly back to the prior safe configuration.

### 8. Rollout Intelligence & Monitoring
- **Canary Policy Distributions:** Simulates rolling out policy changes progressively (e.g., 10% → 50% → 100%).
- **Live Rollout Dashboards:** Real-time polling to monitor active policy distributions hitting the tenant boundary.
- **Anomaly Detection & Target Risk:** Tracks expansion histories to pause policy distributions if unexpected risks are detected during the rollout simulation.

### 9. Governance Observability & Dashboards
- **Executive Aggregation Layer:** High-level metrics showing Total Policies, Active Policies, Rollbacks within a 30-day window, and pending approvals.
- **Immutable Audit Trails:** Every simulation, approval, and execution event logged with timestamps and actor identities.
- **Risk Distribution Visualization:** Charts breaking down the system's current footprint (React Recharts integration).

---

🏗 Architecture Overview
Frontend (React + TypeScript)
        ↓
Backend (Node.js + Express)
        ↓
MongoDB (Strictly Normalized Domain Models)
Core Domain Models

Policy

PolicyVersion

PolicyApproval

User

Role

All governance analytics are derived from persisted lifecycle state — no shadow collections.

🔐 Security Model

Hybrid Authorization Architecture:

Static RBAC Matrix

Dynamic Tenant Custom Roles

Permission-based route protection

Zero-trust API enforcement

JWT Authentication

Tenant-level isolation at query layer

Strict state transition validation

Every policy mutation must pass:

DRAFT → PENDING_APPROVAL → APPROVED → EXECUTED

Rollback only allowed from ACTIVE.

Illegal transitions return structured 400 responses.

🔁 Policy Lifecycle Engine
1️⃣ Draft Creation

New policy version created as draft

2️⃣ Simulation

RBAC + ABAC diff engine

Risk scoring (LOW / MEDIUM / HIGH / CRITICAL)

Blast radius calculation

Human-readable explanation engine

Generates immutable simulationId

3️⃣ Approval

Risk-based authority enforcement:

MEDIUM → MANAGER

HIGH → ADMIN

CRITICAL → SUPER_ADMIN

Average approval time tracked

4️⃣ Execution

Atomic MongoDB transaction

Previous versions deprecated

New version activated

Cache invalidation

Approval marked executed

5️⃣ Rollback

Creates new version

Reverts state deterministically

📊 Governance Dashboard

Executive SaaS-style overview layer:

Total Policies

Active Policies

Pending Approvals

Rollbacks (30-day window)

Risk distribution visualization

Approval performance metrics

Recent governance activity feed

All derived from normalized domain state.

🧩 Feature Modules
Backend
modules/
  auth/
  tenant/
  user/
  role/
  policy-versioning/
  policy-simulation/
  policy-approval/
  policy-evaluation/
  governance-dashboard/
  audit/
Frontend
modules/
  policy-management/
  governance-dashboard/
  simulation/

Feature-based architecture.
No global monolith logic.

⚙️ Tech Stack
Backend

Node.js

Express

TypeScript

MongoDB (Mongoose)

JWT Authentication

MongoDB Transactions

Aggregation Pipelines

Frontend

React

TypeScript

React Query

Recharts

Feature-based modular architecture

Strict typing (no any)

🧪 Testing Flow (Manual Lifecycle Example)

Create Draft Policy

Simulate

Verify Risk Output

Approve

Execute

Validate Active Version

Rollback

Confirm Version Integrity

All state transitions enforced server-side.

🧠 Design Principles

Zero-trust architecture

Explicit state machine enforcement

Idempotent execution

Multi-tenant isolation

Additive-only evolution

No hidden side effects

Deterministic lifecycle orchestration

🚀 Running Locally
Backend
cd server
npm install
npm run dev

Environment:

PORT=5000
MONGO_URI=<your-mongo-uri>
JWT_ACCESS_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
Frontend
cd frontend
npm install
npm run dev
📈 Scalability Considerations

Designed for:

Cross-tenant governance analytics

Canary releases

Progressive rollouts

Audit streaming

SaaS billing integration (future-ready)

Observability expansion

🎯 Resume Highlights

Hybrid RBAC + ABAC simulation engine

Risk-based approval authority enforcement

Atomic lifecycle execution with rollback

Multi-tenant secure architecture

Strict policy state machine validation

Executive analytics aggregation layer

📌 Why This Matters

Governance systems fail when:

State transitions are implicit

Authorization is role-name based

Policy changes lack simulation

Rollbacks are destructive

This system prevents that.

It treats governance as an engineered lifecycle.
## 🔥 Production-Grade Governance Control Plane

Designed and implemented end-to-end with:

- Hybrid RBAC + ABAC simulation engine
- Risk-based approval authority enforcement
- Explicit policy state machine
- Atomic execution + rollback
- Multi-tenant isolation


