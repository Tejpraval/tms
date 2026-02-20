import pino from 'pino';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'


/**
 * Structured Logger using Pino
 * Configured for production-grade JSON logging
 */
export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',

    // 🔒 Redaction for sensitive fields
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.token',
            'req.body.refreshToken',
            'password',
            'token',
            'authorization',
            'cookie'
        ],
        remove: true, // Completely remove sensitive keys
    },

    // Metadata injected into every log
    base: {
        env: process.env.NODE_ENV,
        service: 'backend-api'
    },

    // Timestamp format
    timestamp: pino.stdTimeFunctions.isoTime,
});
