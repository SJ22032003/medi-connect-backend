import { Request, Response } from "./package.type";

export interface IRequestWithRole extends Request {
  id: string;
  role: string;
  type: string;
  file?: any;
  name?: string;
  fullName?: string;
  email?: string;
}

export interface IStatusResponse extends Response {
  statusCode: number;
}

export type TError = {
  statusCode: number;
  message: string;
  name?: string;
  stack?: string;
};
