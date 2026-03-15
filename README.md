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


