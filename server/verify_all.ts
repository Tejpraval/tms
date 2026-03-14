import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import { Tenant } from './src/modules/tenant/tenant.model';
import { Policy } from './src/modules/policy-versioning/policy.model';

async function verify() {
    await mongoose.connect(process.env.MONGO_URI as string);
    const policies = await Policy.find({});
    console.log(\nALL POLICIES IN DB:);
    policies.forEach(p => console.log([Tenant: ] ));
    process.exit(0);
}
verify().catch(console.error);
