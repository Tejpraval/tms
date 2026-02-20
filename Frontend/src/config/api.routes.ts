export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },

  POLICIES: {
    LIST: "/policies",
    GET: (id: string) => `/policies/${id}`,
    SIMULATE: "/policies/simulate",
    DRAFT: (id: string) => `/policies/${id}/draft`,
    ACTIVATE: (id: string, version: number) =>
      `/policies/${id}/activate/${version}`,
    ROLLBACK: (id: string, version: number) =>
      `/policies/${id}/rollback/${version}`,
    COMPARE: (id: string) => `/policies/${id}/compare`,
    VERSIONS: (id: string) => `/policies/${id}/versions`,
  },

  APPROVAL: {
    APPROVE: "/policy-approval/approve",
    REJECT: "/policy-approval/reject",
    EXECUTE: "/policy-approval/execute",
    PENDING: "/policy-approval/pending",
  },

  RELEASE: {
    CREATE: "/policy-release",
    ACTIVE: "/policy-release/active",
    EXPAND: (id: string) => `/policy-release/${id}/expand`,
    ROLLBACK: (id: string) => `/policy-release/${id}/rollback`,
    POLICY: (policyId: string) =>
      `/policy-release/policy/${policyId}`,
    STATUS: (id: string) => `/policy-release/${id}/status`,

  },

  EVALUATION: {
    RUN: "/policy/evaluate",
  },

  AUDIT: {
    RECENT: "/audit/recent",
  },

  TENANT: {
    GET: (id: string) => `/tenant/${id}`,
    CREATE: "/tenant",
    DELETE: (id: string) => `/tenant/${id}`,
  },
};
