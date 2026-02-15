import { PolicyVersion } from "../modules/policy-versioning/policyVersion.model";

type CachedPolicy = {
  policyId: string;
  version: number;
  rules: any[];
};

const cache = new Map<string, CachedPolicy>();

function buildKey(policyId: string, version: number) {
  return `policy:${policyId}:v${version}`;
}

/**
 * Get policy version from cache or DB
 */
export async function getPolicyVersionFromCache(
  policyId: string,
  version: number
): Promise<CachedPolicy> {

  const key = buildKey(policyId, version);

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const policyVersion = await PolicyVersion
    .findOne({ policyId, version })
    .lean();

  if (!policyVersion) {
    throw new Error("Policy version not found");
  }

  const cached: CachedPolicy = {
    policyId,
    version,
    rules: policyVersion.rules,
  };

  cache.set(key, cached);

  return cached;
}

/**
 * Invalidate single version
 */
export function invalidatePolicyVersionCache(
  policyId: string,
  version: number
) {
  const key = buildKey(policyId, version);
  cache.delete(key);
}

/**
 * Invalidate entire policy (all versions)
 */
export function invalidatePolicyCacheByPolicyId(policyId: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(`policy:${policyId}:`)) {
      cache.delete(key);
    }
  }
}
