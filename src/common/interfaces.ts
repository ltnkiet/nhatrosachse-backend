import { Request } from 'express';

export interface AppRequest extends Request {
  id: string;
  user: any;
}

export interface PaginationResult<T = any> {
  rows: T[];
  total: number;
  limit: number;
  offset: number;
}
