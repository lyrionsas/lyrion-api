import { Request, Response, NextFunction } from 'express';

export function swaggerAuth(username: string, password: string) {
  return function(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || '';
    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic' || !credentials) {
      res.setHeader('WWW-Authenticate', 'Basic');
      return res.status(401).send('Authentication required.');
    }

    const decoded = Buffer.from(credentials, 'base64').toString('utf-8');
    const [user, pass] = decoded.split(':');

    if (user === username && pass === password) {
      return next();
    }

    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Invalid credentials.');
  };
}
