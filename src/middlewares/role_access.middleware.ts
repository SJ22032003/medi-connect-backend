import { Response, NextFunction } from "../types/package.type";
import { IRequestWithRole } from "../types/request.type";
import hasRouteAccess from "../utils/role_route_mapper.util";

const roleRouteAccess = async (
  req: IRequestWithRole,
  res: Response,
  next: NextFunction,
) => {
  try {
    const path = sanitizeRequestRoute(req.originalUrl);
    const response = hasRouteAccess(req.method, path, req.role);
    if (!response.routeAccess) {
      return res.status(response.status).json({
        code: response.code,
        message: response.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      code: "INTERNAL SERVER ERROR",
      message: `An internal server error occured. \n ${error.message}`,
    });
  }
  next();
};

const sanitizeRequestRoute = (route: string) => {
  let path: string | string[] = route.split("?")[0];
  path = path.replace("/api/v1", "");
  path = path.split("/");
  const finalPath = [];

  path.forEach((p: string) => {
    if (p === "") return;
    if (p.charAt(0) === ":") {
      finalPath.push("*");
    } else {
      finalPath.push(p);
    }
  });
  const apiPath = `/${finalPath.join("/")}`;
  return apiPath;
};

export default roleRouteAccess;
