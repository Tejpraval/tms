const http = require('http');

const SA_TOKEN = ''; // We will login first

async function test() {
    let saToken = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'super@platform.com', password: 'password123' })
    }).then(r => r.json()).then(d => d.accessToken);

    console.log('[1] SA Token Acquired');

    let tenants = await fetch('http://localhost:5000/api/tenants', {
        headers: { 'Authorization': 'Bearer ' + saToken }
    }).then(r => r.json());

    const t1 = tenants.data.find(t => t.name === 'Tenant One');
    const ta = tenants.data.find(t => t.name === 'Tenant A');

    console.log([2] Impersonating Tenant A: );

    let impTokenA = await fetch('http://localhost:5000/api/auth/impersonate', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + saToken },
        body: JSON.stringify({ targetTenantId: ta._id })
    }).then(r => r.json()).then(d => d.accessToken);

    let policiesA = await fetch('http://localhost:5000/api/policies', {
        headers: { 'Authorization': 'Bearer ' + impTokenA }
    }).then(r => r.json());

    console.log([3] Tenant A Policies: );
}
test();
