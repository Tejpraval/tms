import { Histogram } from 'prom-client';
import { register } from './metricsRegistry';
import { Request, Response, NextFunction } from 'express';

// Define Histogram
const httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    registers: [register],
});

/**
 * Middleware to track HTTP request duration
 */
export const httpMetricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const diff = process.hrtime(start);
        const durationInSeconds = (diff[0] * 1e9 + diff[1]) / 1e9;

        const route = req.route?.path || req.path;

        httpRequestDuration.observe(
            {
                method: req.method,
                route: route,
                status: res.statusCode.toString(),
            },
            durationInSeconds
        );
    });

    next();
};
