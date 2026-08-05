import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../services/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized. Missing or invalid Authorization header.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized. Empty Bearer token.' });
      return;
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      // Demo / development fallback for test tokens
      if (process.env.NODE_ENV !== 'production' && token.startsWith('demo-user-token-')) {
        const userId = token.replace('demo-user-token-', '');
        req.user = {
          id: userId,
          email: 'demo@careerpilot.ai',
        };
        return next();
      }

      res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res.status(500).json({ error: 'Internal server error during authentication check.' });
  }
};
