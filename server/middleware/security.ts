import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

// General API Rate Limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 300, // Limit each IP to 300 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// Auth Rate Limiter (Stricter)
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 20, // Limit each IP to 20 login/register attempts per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts, please try again later.' }
});

// Security Headers
export const securityHeaders = helmet({
    contentSecurityPolicy: false, // often conflicts with map tiles, images, scripts in dev
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin for dev
});

// Zod Validation Middleware
export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors.map(e => `${e.path.slice(1).join('.')}: ${e.message}`)
            });
        }
        return res.status(400).json({ error: 'Invalid input' });
    }
};
