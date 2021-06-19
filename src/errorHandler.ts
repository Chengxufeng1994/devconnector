import { NextFunction, Request, Response } from 'express';

function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
): Response {
  return response.status(500).json({
    success: false,
    message: 'Server Error',
    error,
  });
}

export default errorHandler;
