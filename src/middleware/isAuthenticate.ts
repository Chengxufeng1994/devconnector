import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const isAuthenticate = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { authorization } = request.headers;
  if (!authorization) {
    return response.status(401).json({
      success: false,
      message: 'Unauthorized.',
    });
  }

  const token = authorization.replace('Bearer ', '');
  if (!token) {
    return response.status(403).json({
      success: false,
      message: 'No token provided.',
    });
  }

  // 驗證 Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const { id: userId } = decoded;

    request.userId = userId;
    next();
  } catch (err) {
    return response.status(403).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

export default isAuthenticate;
