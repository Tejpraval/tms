const jwt = require('jsonwebtoken');
const ENV = require('./src/config/env').ENV;
const mongoose = require('mongoose');
const { Tenant } = require('./src/modules/tenant/tenant.model');
const { Policy } = require('./src/modules/policy-versioning/policy.model');

async function test() {
    await mongoose.connect(ENV.DATABASE_URL);
    
    const tenant = await Tenant.findOne({ name: 'Tenant One' });
    console.log('Tenant One ID:', tenant._id.toString());
    
    const policies = await Policy.find({ tenantId: tenant._id.toString() });
    console.log(Found  policies for Tenant One);
    
    // Simulate what the token holds
    const payload = {
      userId: 'admin@test.com',
      role: 'SUPER_ADMIN',
      impersonating: true,
      impersonatedTenantId: tenant._id.toString(),
      impersonatedRole: 'TENANT_ADMIN'
    };
    
    const token = jwt.sign(payload, ENV.JWT_ACCESS_SECRET);
    console.log('\nSimulated Impersonation Token\n', token);
    
    process.exit(0);
}
test();
