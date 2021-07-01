import { NextFunction, Request, Response } from 'express';

function errorHandler(
  error: any,
  request: Request,
  response: Response,
  _next: NextFunction,
): Response {
  const { message, code } = error;

  return response.status(code).json({
    success: false,
    message: code === 500 ? 'Server Error' : message,
  });
}

export default errorHandler;
