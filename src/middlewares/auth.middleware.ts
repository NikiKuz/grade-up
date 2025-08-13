import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findUserByEmail } from '@models/user.models.js';
import { ACCESS_SECRET, REFRESH_SECRET } from '@utils/jwt.js';
import { logger } from '@services/logger.service.js';

dotenv.config();

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<any> {
  logger.info(`[AUTH MIDDLEWARE] triggered on: ${req.method} ${req.originalUrl}`);
  const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : req.cookies.ACCESS_SECRET;

    const refreshToken = req.cookies.REFRESH_SECRET || 
                       (req.headers['x-refresh-token'] as string | undefined);

    logger.info(JSON.stringify(authHeader), accessToken, refreshToken, req)

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ valid: false, message: 'Токены отсутствуют' });
    }

    if (accessToken) {
      try {
        jwt.verify(accessToken, ACCESS_SECRET as string);
        return res.status(200).json({ valid: true, message: 'Access token действителен' });
      } catch (accessError) {
        logger.error(accessError)
      }
    }

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET as string) as any;
        const user = await findUserByEmail(decoded.email);
        
        if (!user) {
          return res.status(401).json({ valid: false, message: 'Пользователь не найден' });
        }

        return res.status(200).json({ 
          valid: true, 
          message: 'Refresh token действителен',
          canRefresh: true 
        });
      } catch (refreshError) {
        return res.status(401).json({ valid: false, message: 'Refresh token недействителен' });
      }
    }

    return res.status(401).json({ valid: false, message: 'Токены недействительны' });
}
