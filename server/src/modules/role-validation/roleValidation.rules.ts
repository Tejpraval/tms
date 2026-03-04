import { Permission } from "../../constants/permissions";

/**
 * The RuleMatrix defines the structural integrity requirements for Roles.
 * If a Role contains the KEY permission, it MUST also contain the VALUE permissions.
 */
export const RuleMatrix: Partial<Record<Permission, Permission[]>> = {
    [Permission.POLICY_WRITE]: [Permission.POLICY_READ],
    [Permission.POLICY_APPROVE]: [Permission.POLICY_READ],
    [Permission.USER_MANAGE]: [Permission.TENANT_READ],
    [Permission.TENANT_UPDATE]: [Permission.TENANT_READ],
    [Permission.TENANT_DELETE]: [Permission.TENANT_READ],
    [Permission.PROPERTY_MANAGE]: [Permission.TENANT_READ] // Assumes property management requires tenant context
};
