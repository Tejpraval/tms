const mongoose = require('mongoose');
const { Tenant } = require('./src/modules/tenant/tenant.model');
const { Policy } = require('./src/modules/policy-management/policy.model');
const { Role } = require('./src/modules/role/role.model');
const { AuditLog } = require('./src/modules/audit/audit.model');
const ENV = require('./src/config/env').ENV;

async function seed() {
    await mongoose.connect(ENV.DATABASE_URL);
    console.log('Connected to DB');

    // Find the first tenant (Tenant One)
    const tenant = await Tenant.findOne({ name: 'Tenant One' });
    if (!tenant) return console.log('Tenant One not found');

    const tenantId = tenant._id;

    // Seed some custom roles
    await Role.deleteMany({ tenantId });
    const viewerRole = await Role.create({
        name: 'Auditor',
        description: 'Read-only access to all governance systems',
        permissions: ['tenant:read', 'policy:read', 'role:read'],
        tenantId,
        isCustom: true
    });
    
    const engRole = await Role.create({
        name: 'Lead Engineer',
        description: 'Can author and manage policies but cannot deploy natively.',
        permissions: ['policy:read', 'policy:create', 'policy:update'],
        tenantId,
        isCustom: true
    });

    // Seed some policies
    await Policy.deleteMany({ tenantId });
    
    await Policy.create({
        name: 'PCI-DSS Data Compliance',
        description: 'Requires all credit card related fields to be encrypted at rest and masked in transit.',
        tags: ['compliance', 'pci-dss', 'security'],
        content: JSON.stringify({ version: "1.0", rules: [{ action: "mask", field: "credit_card" }] }),
        author: 'superadmin@test.com',
        tenantId,
        status: 'published',
        version: 1
    });

    await Policy.create({
        name: 'GDPR Right to Forgive',
        description: 'Maintains data retention lifecycle for EU customers based on strict 30-day deletion bounds.',
        tags: ['privacy', 'gdpr', 'eu-region'],
        content: JSON.stringify({ version: "1.0", rules: [{ ttl: "30_days", appliesTo: "eu_users" }] }),
        author: 'superadmin@test.com',
        tenantId,
        status: 'draft',
        version: 1
    });
    
    await Policy.create({
        name: 'IAM Rotation Policy',
        description: 'Forces all service account keys to expire automatically every 90 days.',
        tags: ['iam', 'security', 'critical'],
        content: JSON.stringify({ version: "1.0", rules: [{ auth_key_max_age_days: 90 }] }),
        author: 'superadmin@test.com',
        tenantId,
        status: 'published',
        version: 5
    });

    console.log('Seeded roles and policies for:', tenant.name);
    process.exit(0);
}
seed();
