// @ts-nocheck
const http = require('http');

function makeRequest(opts: any, body?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = http.request(opts, (res: any) => {
            let data = '';
            res.on('data', (chunk: any) => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function testApi() {
    try {
        console.log("1. Logging in...");
        const loginData = await makeRequest({
            hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, JSON.stringify({ email: 'super@platform.com', password: 'password123' }));
        const saToken = JSON.parse(loginData).accessToken;

        console.log("2. Fetching Tenants...");
        const tenantsData = await makeRequest({
            hostname: 'localhost', port: 5000, path: '/api/tenants', method: 'GET',
            headers: { 'Authorization': `Bearer ${saToken}` }
        });
        const tenants = JSON.parse(tenantsData).data;
        const tenantA = tenants.find((t: any) => t.name === 'Tenant A');
        const tenantOne = tenants.find((t: any) => t.name === 'Tenant One');

        console.log(`3. Impersonating Tenant A: ${tenantA._id}`);
        const impDataA = await makeRequest({
            hostname: 'localhost', port: 5000, path: '/api/auth/impersonate', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${saToken}` }
        }, JSON.stringify({ targetTenantId: tenantA!._id }));
        const impTokenA = JSON.parse(impDataA).accessToken;

        console.log("4. Fetching Policies with Impersonated Token A...");
        const polDataA = await makeRequest({
            hostname: 'localhost', port: 5000, path: '/api/policies', method: 'GET',
            headers: { 'Authorization': `Bearer ${impTokenA}` }
        });

        console.log(`\n--- RESULTS FOR TENANT A (${tenantA!._id}) ---`);
        console.log(polDataA);


        console.log(`\n5. Impersonating Tenant One: ${tenantOne!._id}`);
        const impDataOne = await makeRequest({
            hostname: 'localhost', port: 5000, path: '/api/auth/impersonate', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${saToken}` }
        }, JSON.stringify({ targetTenantId: tenantOne!._id }));
        const impTokenOne = JSON.parse(impDataOne).accessToken;

        console.log("6. Fetching Policies with Impersonated Token One...");
        const polDataOne = await makeRequest({
            hostname: 'localhost', port: 5000, path: '/api/policies', method: 'GET',
            headers: { 'Authorization': `Bearer ${impTokenOne}` }
        });

        console.log(`\n--- RESULTS FOR TENANT ONE (${tenantOne!._id}) ---`);
        console.log(polDataOne);

    } catch (err) {
        console.error("Test failed", err);
    }
}
testApi();
