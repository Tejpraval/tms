import { pinoHttp } from 'pino-http';
import { logger } from './logger';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

/**
 * HTTP Request Logger Middleware
 * Automatically logs request/response details with correlation IDs.
 */
export const requestLogger = pinoHttp({
    logger,

    // Generate correlation ID if missing
    genReqId: (req: any) => req.headers['x-request-id'] || randomUUID(),

    // Custom log levels based on response status
    customLogLevel: (req: any, res: any, err: any) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },

    // Structured serializers
    serializers: {
        req: (req: any) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            ip: req.remoteAddress,
            userAgent: req.headers['user-agent'],
        }),
        res: (res: any) => ({
            statusCode: res.statusCode,
        }),
    },

    // Reduce noise for health checks
    autoLogging: {
        ignore: (req: any) => req.url === '/health' || req.url === '/active',
    },
});
