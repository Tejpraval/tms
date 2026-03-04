import { Permission } from "../../constants/permissions";
import { RuleMatrix } from "./roleValidation.rules";

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Validates a proposed permission array against the RuleMatrix dependencies.
 * - Safely ignores unknown permissions (Future Proofing)
 * - Returns specific, structural error messages
 */
export const validateRolePermissions = (
    permissions: Permission[]
): ValidationResult => {
    const errors: string[] = [];
    const permissionSet = new Set(permissions);

    for (const perm of permissions) {
        // 1. Future Proof: If perm is not in matrix, skip dependency check
        const requiredDependencies = RuleMatrix[perm];
        if (!requiredDependencies) continue;

        // 2. Validate dependencies
        for (const dependency of requiredDependencies) {
            if (!permissionSet.has(dependency)) {
                errors.push(
                    `Structural Inconsistency: Role requires '${dependency}' in order to grant '${perm}'.`
                );
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
