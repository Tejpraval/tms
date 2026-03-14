const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const loginRes = JSON.parse(data);
    const saToken = loginRes.accessToken;
    console.log('[1] SA Token:', saToken ? 'OK' : 'FAIL');

    if (!saToken) return;

    // Get tenants
    const impOpts = {
      hostname: 'localhost', port: 5000, path: '/api/tenants',
      method: 'GET', headers: { 'Authorization': 'Bearer ' + saToken }
    };
    http.request(impOpts, (tRes) => {
        let tData = '';
        tRes.on('data', (chunk) => { tData += chunk; });
        tRes.on('end', () => {
            const tenants = JSON.parse(tData).data;
            const ta = tenants.find(t => t.name === 'Tenant A');
            console.log('[2] Found Tenant A:', ta ? ta._id : 'FAIL');

            // Impersonate
            const doImpOpts = {
                hostname: 'localhost', port: 5000, path: '/api/auth/impersonate',
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + saToken }
            };
            const impReq = http.request(doImpOpts, (iRes) => {
                let iData = '';
                iRes.on('data', (c) => { iData += c; });
                iRes.on('end', () => {
                   const impToken = JSON.parse(iData).accessToken;
                   console.log('[3] Impersonation Token:', impToken ? 'OK' : 'FAIL');
                   
                   // Fetch policies
                   const polOpts = {
                      hostname: 'localhost', port: 5000, path: '/api/policies',
                      method: 'GET', headers: { 'Authorization': 'Bearer ' + impToken }
                   };
                   http.request(polOpts, (pRes) => {
                       let pData = '';
                       pRes.on('data', (c) => pData += c);
                       pRes.on('end', () => {
                           console.log('[4] Tenant A Policies Result:');
                           console.log(JSON.parse(pData));
                       });
                   }).end();

                });
            });
            impReq.write(JSON.stringify({ targetTenantId: ta._id }));
            impReq.end();
        });
    }).end();


  });
});

req.on('error', (e) => {
  console.error(Problem: );
});

req.write(JSON.stringify({ email: 'super@platform.com', password: 'password123' }));
req.end();

