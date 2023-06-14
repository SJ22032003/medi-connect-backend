/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request } from "../types/package.type";
import { TError, IStatusResponse } from "../types/request.type";
import { MongoServerError, Error } from "../models/mongoose_export";

const environment = process.env.NODE_ENV || "devlopment";

const errorHandler = (
  err: TError,
  req: Request,
  res: IStatusResponse,
  next: NextFunction,
) => {
  let status: number = 400;
  if (err instanceof MongoServerError) {
    status = 500;
    console.error("MongoServer Error", err);
  } else if (err instanceof Error) {
    status = 400;
    console.warn(`MoongooseError\n${err}\nIP = ${req.ip}`);
  } else {
    console.error(err);
  }

  res.status(status).json({
    message: err.message || "Something went wrong",
    stack: err.stack,
  });
};

export default errorHandler;
