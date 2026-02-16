import { apiClient } from "@/lib/axios";
import { API } from "@/config/api.routes";
import type { ApiResponse } from "@/types/api.types";
import type {
  Policy,
  PolicyVersion,
  PolicyComparisonResult,
} from "./types";

/* --------------------------------------------
   List Policies
--------------------------------------------- */

export const listPolicies = async (): Promise<Policy[]> => {
  const { data } = await apiClient.get<
    ApiResponse<Policy[]>
  >(API.POLICIES.LIST);

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

/* --------------------------------------------
   Get Policy By ID
--------------------------------------------- */

export const getPolicyById = async (
  id: string
): Promise<Policy> => {
  const { data } = await apiClient.get<
    ApiResponse<Policy>
  >(API.POLICIES.GET(id));

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

/* --------------------------------------------
   List Versions
--------------------------------------------- */

export const listVersions = async (
  id: string
): Promise<PolicyVersion[]> => {
  const { data } = await apiClient.get<
    PolicyVersion[]
  >(API.POLICIES.VERSIONS(id));

  return data;
};

/* --------------------------------------------
   Compare Versions
--------------------------------------------- */

export const compareVersions = async (
  id: string,
  v1: number,
  v2: number
): Promise<PolicyComparisonResult> => {
  const { data } = await apiClient.get<
    PolicyComparisonResult
  >(API.POLICIES.COMPARE(id), {
    params: { v1, v2 },
  });

  return data;
};

/* --------------------------------------------
   Create Draft
--------------------------------------------- */

export const createDraft = async (
  id: string,
  rules: unknown
): Promise<PolicyVersion> => {
  const { data } = await apiClient.post<
    PolicyVersion
  >(API.POLICIES.DRAFT(id), { rules });

  return data;
};

/* --------------------------------------------
   Activate Version
--------------------------------------------- */

export const activateVersion = async (
  id: string,
  version: number
): Promise<unknown> => {
  const { data } = await apiClient.post(
    API.POLICIES.ACTIVATE(id, version)
  );

  return data;
};

/* --------------------------------------------
   Rollback Version
--------------------------------------------- */

export const rollbackVersion = async (
  id: string,
  version: number
): Promise<unknown> => {
  const { data } = await apiClient.post(
    API.POLICIES.ROLLBACK(id, version)
  );

  return data;
};
