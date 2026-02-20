import client from 'prom-client';

// Create a Registry
export const register = new client.Registry();

// Enable default metrics (CPU, RAM, GC, etc.)
// These will be collected automatically
client.collectDefaultMetrics({
    register,
    labels: {
        service: 'backend-api',
        env: process.env.NODE_ENV || 'development'
    },
});

// Export client for custom metric creation later
export const metrics = client;
