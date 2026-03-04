import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import { Tenant } from './src/modules/tenant/tenant.model';
import { Role as CustomRole } from './src/modules/role/role.model';
import { Policy } from './src/modules/policy-versioning/policy.model';
import { PolicyVersion } from './src/modules/policy-versioning/policyVersion.model';
import { AuditLog } from './src/modules/audit/audit.model';

async function seed() {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("Connected to MongoDB...");

    // Try multiple possible default names
    let tenant = await Tenant.findOne({ name: 'Tenant One' });
    if (!tenant) tenant = await Tenant.findOne({ name: 'Tenant A' });
    if (!tenant) {
        console.error("Could not find a generic tenant workspace.");
        process.exit(1);
        return;
    }

    const tId = tenant._id.toString();
    console.log(`Injecting rich dataset into [${tenant.name}] (${tId})...`);

    console.log("  -> Injecting Roles...");
    await CustomRole.deleteMany({ tenantId: tId });
    await CustomRole.create({
        name: 'Senior Architect',
        description: 'Read and write all policies, execute deployments.',
        permissions: ['tenant:read', 'policy:create', 'policy:read', 'policy:update', 'policy:delete', 'rollout:create', 'rollout:execute'],
        tenantId: tId,
        isCustom: true
    });

    await CustomRole.create({
        name: 'Auditor',
        description: 'Read-only access across the entire tenant.',
        permissions: ['tenant:read', 'policy:read', 'role:read', 'audit:read'],
        tenantId: tId,
        isCustom: true
    });

    console.log("  -> Injecting Policies...");
    await Policy.deleteMany({ tenantId: tId });

    // We don't delete PolicyVersions globally because we want to preserve history of other tenants just in case, but let's just create some.

    const p1 = await Policy.create({
        name: 'Global Password Complexity',
        policyId: 'SEC-PWD-001-' + Date.now().toString().substring(7),
        tenantId: tId,
        activeVersion: 1,
        latestVersion: 1,
        tags: ['security', 'compliance', 'iam'],
        releaseMode: 'STATIC'
    });

    await PolicyVersion.create({
        policy: p1._id,
        version: 1,
        status: 'active',
        rules: { minLength: 12, requireUppercase: true, requireSpecial: true },
        checksum: 'sha256-abcdef1234567890',
        createdBy: 'admin@test.com',
        activatedAt: new Date()
    });

    const p2 = await Policy.create({
        name: 'S3 Bucket Public Access Block',
        policyId: 'AWS-S3-002-' + Date.now().toString().substring(7),
        tenantId: tId,
        activeVersion: 2,
        latestVersion: 2,
        tags: ['aws', 'infrastructure', 'critical'],
        releaseMode: 'STATIC'
    });

    await PolicyVersion.create({
        policy: p2._id,
        version: 1,
        status: 'deprecated',
        rules: { blockPublicAcls: true },
        checksum: 'sha256-11111111',
        createdBy: 'admin@test.com',
        activatedAt: new Date(Date.now() - 86400000 * 5)
    });

    await PolicyVersion.create({
        policy: p2._id,
        version: 2,
        status: 'active',
        rules: { blockPublicAcls: true, blockPublicPolicy: true, restrictPublicBuckets: true },
        checksum: 'sha256-22222222',
        createdBy: 'admin@test.com',
        activatedAt: new Date()
    });

    const p3 = await Policy.create({
        name: 'GDPR Data Retention Lifecycle',
        policyId: 'EU-GDPR-003-' + Date.now().toString().substring(7),
        tenantId: tId,
        activeVersion: 1,
        latestVersion: 3,
        tags: ['privacy', 'eu-region', 'legal'],
        releaseMode: 'ROLLOUT'
    });

    await PolicyVersion.create({
        policy: p3._id,
        version: 1,
        status: 'active',
        rules: { ttl: "90_days" },
        checksum: 'sha256-33333333',
        createdBy: 'admin@test.com',
        activatedAt: new Date(Date.now() - 86400000 * 30)
    });

    await PolicyVersion.create({
        policy: p3._id,
        version: 2,
        status: 'draft',
        rules: { ttl: "60_days" },
        checksum: 'sha256-44444444',
        createdBy: 'admin@test.com'
    });

    await PolicyVersion.create({
        policy: p3._id,
        version: 3,
        status: 'pending_approval',
        rules: { ttl: "30_days", appliesTo: "eu_citizens" },
        checksum: 'sha256-55555555',
        createdBy: 'admin@test.com'
    });

    console.log("  -> Injecting Mock Telemetry/Audit Logs...");
    await AuditLog.create({
        tenantId: tId,
        action: 'UPDATE_POLICY_VERSION',
        entityType: 'POLICY',
        entityId: p3._id.toString(),
        actorId: 'admin@test.com',
        details: { message: 'Drafted GDPR v3 with stricter 30-day limits.' }
    });

    await AuditLog.create({
        tenantId: tId,
        action: 'ASSIGN_ROLE',
        entityType: 'USER',
        entityId: 'system',
        actorId: 'admin@test.com',
        details: { message: 'Assigned Senior Architect role to user.' }
    });

    console.log("✅ Seed completed successfully! Dashboard should now look fully populated.");
    process.exit(0);
}
seed().catch(console.error);
