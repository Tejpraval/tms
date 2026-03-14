import * as http from 'http';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Tenant } from './src/modules/tenant/tenant.model';
import { ENV } from './src/config/env';

async function test() {
    await mongoose.connect(process.env.DATABASE_URL as string);
    let tenant = await Tenant.findOne({ name: 'Tenant One' });
    if (!tenant) tenant = await Tenant.findOne({ name: 'Tenant A' });

    if (!tenant) {
        console.error("No tenant found");
        process.exit(1);
    }

    const payload = {
        userId: 'superadmin@test.com', // Replace with real ID
        role: 'SUPER_ADMIN',
        impersonating: true,
        impersonatedTenantId: tenant._id.toString(),
        impersonatedRole: 'TENANT_ADMIN'
    };

    const token = jwt.sign(payload, ENV.JWT_ACCESS_SECRET);

    const options = {
        hostname: 'localhost',
        port: parseInt(process.env.PORT || '5000', 10),
        path: '/api/policies',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    console.log("Requesting with token:");

    const req = http.request(options, res => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
            console.log('HTTP Status:', res.statusCode);
            console.log('Response body:', data);
            process.exit(0);
        });
    });

    req.on('error', e => {
        console.error('Request error:', e.message);
        process.exit(1);
    });

    req.end();
}
test().catch(console.error);
