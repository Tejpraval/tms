import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import { Tenant } from './src/modules/tenant/tenant.model';
import { Policy } from './src/modules/policy-versioning/policy.model';

async function verify() {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB...");

    const tenants = await Tenant.find({});
    console.log(`\nFound ${tenants.length} tenants:`);

    for (const t of tenants) {
        const policies = await Policy.find({ tenantId: t._id.toString() });
        console.log(`\n-----------------------------------`);
        console.log(`[${t.name}] (${t._id.toString()})`);
        console.log(`Policies: ${policies.length}`);
        if (policies.length > 0) {
            policies.forEach(p => console.log(`  - ${p.name}`));
        }
    }

    process.exit(0);
}
verify().catch(console.error);
