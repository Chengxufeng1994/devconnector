import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IDecoded {
  id: Record<string, unknown>;
}

const isAuthenticate = (
  request: Request,
  response: Response,
  next: NextFunction,
): unknown => {
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as IDecoded;
    const { id: userId } = decoded;

    request.userId = userId;
    return next();
  } catch (err) {
    return response.status(403).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

export default isAuthenticate;
