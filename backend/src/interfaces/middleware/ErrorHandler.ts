import { Request, Response, NextFunction } from 'express';

export class ErrorHandler {
  static handle(error: Error, req: Request, res: Response, next: NextFunction): void {
    console.error('Unhandled error:', error);

    if (res.headersSent) {
      return next(error);
    }

    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
