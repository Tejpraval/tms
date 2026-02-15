import { Request, Response, NextFunction } from 'express';

export function requireRole(role: 'ADMIN') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.sendStatus(403);
    }
    next();
  };
}
