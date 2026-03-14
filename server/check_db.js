const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const { Tenant } = require('./src/modules/tenant/tenant.model');
const { Policy } = require('./src/modules/policy-versioning/policy.model');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const tenants = await Tenant.find({});
    console.log(Found  tenants:\n);
    
    for (const t of tenants) {
        const policies = await Policy.find({ tenantId: t._id.toString() });
        console.log(-  ():  policies);
        if (policies.length > 0) {
            policies.forEach(p => console.log(   > ));
        }
    }
    
    process.exit(0);
}
test();
