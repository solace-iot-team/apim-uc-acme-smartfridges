import { NextFunction, Request, Response } from 'express';

/** A server error. */
export class ServerError extends Error {
  status: number;
  details?: any;
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** The standard error handler. */
export default function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction) {

  if (error instanceof ServerError) {
    res.status(error.status).json({ message: error.message, details: error.details });
  } else {
    res.status(error.status || 500).json({ message: error.message });
  }
}
