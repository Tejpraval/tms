const http = require('http');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: './.env' });
const secret = process.env.JWT_ACCESS_SECRET;
const mongoose = require('mongoose');

const { Tenant } = require('./src/modules/tenant/tenant.model');

async function test() {
    await mongoose.connect(process.env.DATABASE_URL);
    let tenant = await Tenant.findOne({ name: 'Tenant One' });
    if (!tenant) tenant = await Tenant.findOne({ name: 'Tenant A' });

    const payload = {
        userId: 'superadmin@test.com', // Replace with real ID
        role: 'SUPER_ADMIN',
        impersonating: true,
        impersonatedTenantId: tenant._id.toString(),
        impersonatedRole: 'TENANT_ADMIN'
    };
    
    const token = jwt.sign(payload, secret);
    
    const options = {
        hostname: 'localhost',
        port: process.env.PORT || 5000,
        path: '/api/policies',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    
    console.log("Token generated for tenant:", tenant._id.toString());
    const req = http.request(options, res => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
            console.log('HTTP Status:', res.statusCode);
            console.log('Response:', data);
            process.exit(0);
        });
    });
    
    req.end();
}

test();
