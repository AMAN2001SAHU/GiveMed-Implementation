import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (token === '' || token === null) {
    return res.status(403).json({
      error: 'Unauthorized',
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    res.locals.userId = decoded.id;

    next();
  } catch (e) {
    return res.status(404).json({
      error: 'Some internal server error occured',
    });
  }
};
