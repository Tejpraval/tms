import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import { Tenant } from './src/modules/tenant/tenant.model';
import { Role as CustomRole } from './src/modules/role/role.model';
import { Policy } from './src/modules/policy-versioning/policy.model';
import { PolicyVersion } from './src/modules/policy-versioning/policyVersion.model';
import { AuditLog } from './src/modules/audit/audit.model';

async function seed() {
    await mongoose.connect(process.env.MONGO_URI as string);
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
        permissions: ['TENANT_READ', 'POLICY_WRITE', 'POLICY_READ', 'POLICY_ADMIN'],
        tenantId: tId
    });

    await CustomRole.create({
        name: 'Auditor',
        permissions: ['TENANT_READ', 'POLICY_READ'],
        tenantId: tId
    });

    console.log("  -> Injecting Policies...");
    await Policy.deleteMany({ tenantId: tId });

    // Clean up completely for local demo
    await PolicyVersion.deleteMany({});

    // Drop the ghost index from earlier schema versions to avoid null collisions
    await PolicyVersion.collection.dropIndex('policyId_1_version_1').catch(() => console.log('No ghost index found.'));

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
        policy: p1.id,
        policyId: p1.id, // Ghost index bypass
        version: 1,
        status: 'active',
        rules: { minLength: 12, requireUppercase: true, requireSpecial: true },
        checksum: 'sha256-abcdef1234567890',
        createdBy: 'admin@test.com',
        activatedAt: new Date()
    } as any);

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
        policy: p2.id,
        policyId: p2.id,
        version: 1,
        status: 'deprecated',
        rules: { blockPublicAcls: true },
        checksum: 'sha256-11111111',
        createdBy: 'admin@test.com',
        activatedAt: new Date(Date.now() - 86400000 * 5)
    } as any);

    await PolicyVersion.create({
        policy: p2.id,
        policyId: p2.id,
        version: 2,
        status: 'active',
        rules: { blockPublicAcls: true, blockPublicPolicy: true, restrictPublicBuckets: true },
        checksum: 'sha256-22222222',
        createdBy: 'admin@test.com',
        activatedAt: new Date()
    } as any);

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
        policy: p3.id,
        policyId: p3.id,
        version: 1,
        status: 'active',
        rules: { ttl: "90_days" },
        checksum: 'sha256-33333333',
        createdBy: 'admin@test.com',
        activatedAt: new Date(Date.now() - 86400000 * 30)
    } as any);

    await PolicyVersion.create({
        policy: p3.id,
        policyId: p3.id,
        version: 2,
        status: 'draft',
        rules: { ttl: "60_days" },
        checksum: 'sha256-44444444',
        createdBy: 'admin@test.com'
    } as any);

    await PolicyVersion.create({
        policy: p3.id,
        policyId: p3.id,
        version: 3,
        status: 'pending_approval',
        rules: { ttl: "30_days", appliesTo: "eu_citizens" },
        checksum: 'sha256-55555555',
        createdBy: 'admin@test.com'
    } as any);

    console.log("  -> Injecting Mock Telemetry/Audit Logs...");
    // AuditLogs are strictly immutable. We just append the mock logs.
    await AuditLog.create({
        tenantId: tId,
        action: 'UPDATE_POLICY_VERSION',
        entityType: 'POLICY',
        entityId: p3.id,
        userId: 'admin@test.com',
        metadata: { message: 'Drafted GDPR v3 with stricter 30-day limits.' }
    });

    await AuditLog.create({
        tenantId: tId,
        action: 'ASSIGN_ROLE',
        entityType: 'USER',
        entityId: 'system',
        userId: 'admin@test.com',
        metadata: { message: 'Assigned Senior Architect role to user.' }
    });

    console.log("✅ Seed completed successfully! Dashboard should now look fully populated.");
    process.exit(0);
}
seed().catch(err => {
    require('fs').writeFileSync('seed_error.json', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    console.error(err);
});
