import axios from 'axios';

async function testFlow() {
    try {
        console.log("1. Logging in as Super Admin...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'super@platform.com',
            password: 'password123'
        });
        const superToken = loginRes.data.accessToken;

        console.log("2. Fetching Tenant Registry...");
        const registryRes = await axios.get('http://localhost:5000/api/tenants', {
            headers: { Authorization: `Bearer ${superToken}` }
        });

        const tenantA = registryRes.data.data.find((t: any) => t.name === 'Tenant A');
        const tenant1 = registryRes.data.data.find((t: any) => t.name === 'Tenant One');

        console.log(`\nImpersonating Tenant A (${tenantA._id})...`);
        const impARes = await axios.post('http://localhost:5000/api/auth/impersonate', { targetTenantId: tenantA._id }, {
            headers: { Authorization: `Bearer ${superToken}` }
        });

        const polARes = await axios.get('http://localhost:5000/api/policies', {
            headers: { Authorization: `Bearer ${impARes.data.accessToken}` }
        });
        console.log(`Tenant A returned ${polARes.data.data.length} policies.`);
        polARes.data.data.forEach((p: any) => console.log(`   - ${p.name}`));


        console.log(`\nImpersonating Tenant One (${tenant1._id})...`);
        const imp1Res = await axios.post('http://localhost:5000/api/auth/impersonate', { targetTenantId: tenant1._id }, {
            headers: { Authorization: `Bearer ${superToken}` }
        });

        const pol1Res = await axios.get('http://localhost:5000/api/policies', {
            headers: { Authorization: `Bearer ${imp1Res.data.accessToken}` }
        });
        console.log(`Tenant 1 returned ${pol1Res.data.data.length} policies.`);
        pol1Res.data.data.forEach((p: any) => console.log(`   - ${p.name}`));

    } catch (e: any) {
        console.error("Test failed:", e.response?.data || e.message);
    }
}
testFlow();
