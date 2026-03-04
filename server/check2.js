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
            // Get Tenants
            const tenantsReq = http.request('http://localhost:5000/api/tenant', {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token }
            }, (res2) => {
                let body2 = '';
                res2.on('data', chunk => body2 += chunk);
                res2.on('end', () => {
                    const tenants = JSON.parse(body2).data;
                    const firstTenantId = tenants[0]._id;
                    console.log('Targeting:', tenants[0].name);
                    
                    // Impersonate
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
                            console.log('Imp Token:', impToken.substring(0, 15) + '...');
                            
                            // Get Me
                            const meReq = http.request('http://localhost:5000/api/auth/me', {
                                method: 'GET',
                                headers: { 'Authorization': 'Bearer ' + impToken }
                            }, (res4) => {
                                let body4 = '';
                                res4.on('data', chunk => body4 += chunk);
                                res4.on('end', () => {
                                    console.log('GET /auth/me payload:', body4);
                                });
                            });
                            meReq.end();
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
