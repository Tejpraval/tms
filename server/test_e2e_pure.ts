// Run pure JS fetch simulation to avoid typescript type errors with axios
async function testFlow() {
    try {
        console.log("1. Logging in as Super Admin...");
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'super@platform.com', password: 'password123' })
        }).then(r => r.json());

        const superToken = loginRes.accessToken;

        console.log("2. Fetching Tenant Registry...");
        const registryRes = await fetch('http://localhost:5000/api/tenants', {
            headers: { Authorization: `Bearer ${superToken}` }
        }).then(r => r.json());

        const tenantA = registryRes.data.find((t: any) => t.name === 'Tenant A');
        const tenant1 = registryRes.data.find((t: any) => t.name === 'Tenant One');

        console.log(`\nImpersonating Tenant A (${tenantA._id})...`);
        const impARes = await fetch('http://localhost:5000/api/auth/impersonate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${superToken}` },
            body: JSON.stringify({ targetTenantId: tenantA._id })
        }).then(r => r.json());

        const polARes = await fetch('http://localhost:5000/api/policies', {
            headers: { Authorization: `Bearer ${impARes.accessToken}` }
        }).then(r => r.json());
        console.log(`Tenant A returned ${polARes.data.length} policies.`);


        console.log(`\nImpersonating Tenant One (${tenant1._id})...`);
        const imp1Res = await fetch('http://localhost:5000/api/auth/impersonate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${superToken}` },
            body: JSON.stringify({ targetTenantId: tenant1._id })
        }).then(r => r.json());

        const pol1Res = await fetch('http://localhost:5000/api/policies', {
            headers: { Authorization: `Bearer ${imp1Res.accessToken}` }
        }).then(r => r.json());

        console.log(`Tenant 1 returned ${pol1Res.data.length} policies.`);

    } catch (e: any) {
        console.error("Test failed:", e);
    }
}
testFlow();
