const http = require('http');

async function check() {
    const loginData = JSON.stringify({ email: 'superadmin@test.com', password: 'password123' });
    const loginReq = http.request('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginData)
        }
    }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            const token = JSON.parse(body).accessToken;
            const tenantsReq = http.request('http://localhost:5000/api/tenant', {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token }
            }, (res2) => {
                let body2 = '';
                res2.on('data', chunk => body2 += chunk);
                res2.on('end', () => {
                    const tenants = JSON.parse(body2).data;
                    const firstTenantId = tenants[0]._id;
                    const impData = JSON.stringify({ targetTenantId: firstTenantId });
                    const impReq = http.request('http://localhost:5000/api/auth/impersonate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token,
                            'Content-Length': Buffer.byteLength(impData)
                        }
                    }, (res3) => {
                        let body3 = '';
                        res3.on('data', chunk => body3 += chunk);
                        res3.on('end', () => {
                            const impToken = JSON.parse(body3).accessToken;
                            const payloadBase64 = impToken.split('.')[1];
                            const payload = Buffer.from(payloadBase64, 'base64').toString('utf8');
                            console.log('RAW JWT PAYLOAD:', JSON.parse(payload));
                            
                            // Let's do a fast GET /tenant/:id manually
                            const tenantReq = http.request('http://localhost:5000/api/tenant/' + firstTenantId, {
                                method: 'GET',
                                headers: { 'Authorization': 'Bearer ' + token }
                            }, (res5) => {
                                let body5 = '';
                                res5.on('data', chunk => body5 += chunk);
                                res5.on('end', () => {
                                    console.log('GET /tenant/:id:', body5);
                                });
                            });
                            tenantReq.end();
                        });
                    });
                    impReq.write(impData);
                    impReq.end();
                });
            });
            tenantsReq.end();
        });
    });
    loginReq.write(loginData);
    loginReq.end();
}
check();
