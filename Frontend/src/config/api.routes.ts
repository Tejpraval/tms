export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
  },

  POLICIES: {
    LIST: "/api/policies",
    GET: (id: string) => `/api/policies/${id}`,
    SIMULATE: "/api/policies/simulate",
    DRAFT: (id: string) => `/api/policies/${id}/draft`,
    ACTIVATE: (id: string, version: number) =>
      `/api/policies/${id}/activate/${version}`,
    ROLLBACK: (id: string, version: number) =>
      `/api/policies/${id}/rollback/${version}`,
    COMPARE: (id: string) => `/api/policies/${id}/compare`,
    VERSIONS: (id: string) => `/api/policies/${id}/versions`,
  },

  APPROVAL: {
    APPROVE: "/api/policy-approval/approve",
    REJECT: "/api/policy-approval/reject",
    EXECUTE: "/api/policy-approval/execute",
    PENDING: "/api/policy-approval/pending",
  },

  RELEASE: {
    CREATE: "/api/policy-release",
    ACTIVE: "/api/policy-release/active",
    EXPAND: (id: string) => `/api/policy-release/${id}/expand`,
    ROLLBACK: (id: string) => `/api/policy-release/${id}/rollback`,
    POLICY: (policyId: string) =>
  `/api/policy-release/policy/${policyId}`,
    STATUS: (id: string) => `/api/policy-release/${id}/status`,

  },

  EVALUATION: {
    RUN: "/api/policy/evaluate",
  },

  AUDIT: {
    RECENT: "/api/audit/recent",
  },

  TENANT: {
    GET: (id: string) => `/api/tenant/${id}`,
    CREATE: "/api/tenant",
    DELETE: (id: string) => `/api/tenant/${id}`,
  },
};
