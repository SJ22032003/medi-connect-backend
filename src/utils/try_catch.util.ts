import { NextFunction } from "../types/package.type";
import { IRequestWithRole, IStatusResponse } from "../types/request.type";

type ControllerFunction<T> = (
  req: IRequestWithRole,
  res: IStatusResponse,
) => Promise<T>;

const tryCatch = <T>(controller: ControllerFunction<T>) => async (req: IRequestWithRole, res: IStatusResponse, next: NextFunction) => {
  try {
    await controller(req, res);
  } catch (error) {
    next(error);
  }
};

export default tryCatch;
