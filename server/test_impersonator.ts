import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import { Tenant } from './src/modules/tenant/tenant.model';
import { Policy } from './src/modules/policy-versioning/policy.model';
import jwt from 'jsonwebtoken';
import { ENV } from './src/config/env';

async function test() {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("Connected to MongoDB...");

    let tenant = await Tenant.findOne({ name: 'Tenant One' });
    if (!tenant) {
        console.error("No Tenant One found");
        process.exit(1);
        return;
    }
    const tId = tenant._id.toString();
    console.log(`Tenant One ID: ${tId}`);

    const policies = await Policy.find({ tenantId: tId });
    console.log(`Found ${policies.length} native policies for Tenant One`);

    const payload = {
        userId: 'superadmin@test.com',
        role: 'SUPER_ADMIN',
        impersonating: true,
        impersonatedTenantId: tId,
        impersonatedRole: 'TENANT_ADMIN'
    };

    // Test signing tokens
    const token = jwt.sign(payload, ENV.JWT_ACCESS_SECRET);
    console.log("Mock Token:", token);

    process.exit(0);
}
test().catch(console.error);
