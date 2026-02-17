//D:\resumeproject\Frontend\src\modules\policy-versioning\hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listPolicies,
  getPolicyById,
  listVersions,
  createDraft,
  activateVersion,
  rollbackVersion,
} from "./api";

import { useParams } from "react-router-dom";


/* --------------------------------------------
   Query Keys
--------------------------------------------- */

const POLICY_KEYS = {
  all: ["policies"] as const,
  detail: (id: string) => ["policy", id] as const,
  versions: (id: string) => ["policy-versions", id] as const,
};

/* --------------------------------------------
   List Policies
--------------------------------------------- */

export const usePolicies = () => {
  return useQuery({
    queryKey: POLICY_KEYS.all,
    queryFn: listPolicies,
  });
};


/* --------------------------------------------
   Get Single Policy
--------------------------------------------- */

export const usePolicy = (id: string) => {
  return useQuery({
    queryKey: POLICY_KEYS.detail(id),
    queryFn: () => getPolicyById(id),
    enabled: !!id,
  });
};

/* --------------------------------------------
   List Versions
--------------------------------------------- */

export const usePolicyVersions = (id: string) => {
  return useQuery({
    queryKey: POLICY_KEYS.versions(id),
    queryFn: () => listVersions(id),
    enabled: !!id,
  });
};

/* --------------------------------------------
   Create Draft
--------------------------------------------- */

export const useCreateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      rules,
    }: {
      id: string;
      rules: unknown;
    }) => createDraft(id, rules),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: POLICY_KEYS.versions(variables.id),
      });
    },
  });
};

/* --------------------------------------------
   Activate Version
--------------------------------------------- */

export const useActivateVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      version,
    }: {
      id: string;
      version: number;
    }) => activateVersion(id, version),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: POLICY_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: POLICY_KEYS.versions(variables.id),
      });
    },
  });
};

/* --------------------------------------------
   Rollback Version
--------------------------------------------- */

export const useRollbackVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      version,
    }: {
      id: string;
      version: number;
    }) => rollbackVersion(id, version),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: POLICY_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: POLICY_KEYS.versions(variables.id),
      });
    },
  });
};

/* --------------------------------------------
   Policy Details Aggregator
--------------------------------------------- */

export const usePolicyDetails = () => {
  const { id } = useParams<{ id: string }>();

  const policyQuery = useQuery({
    queryKey: POLICY_KEYS.detail(id!),
    queryFn: () => getPolicyById(id!),
    enabled: !!id,
  });

  const versionsQuery = useQuery({
    queryKey: POLICY_KEYS.versions(id!),
    queryFn: () => listVersions(id!),
    enabled: !!id,
  });

  return {
    policy: policyQuery.data,
    versions: versionsQuery.data ?? [],
    isLoading: policyQuery.isLoading || versionsQuery.isLoading,
  };
};
