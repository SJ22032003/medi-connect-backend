import roleRoutes from "../routes/role_routes";

const hasRouteAccess = (routeMethod: string, route: string, role: string) => {
  if (!route || route === "") {
    return {
      status: 500,
      code: "INTERNAL SERVER ERROR",
      routeAccess: false,
      message: "Invalid route.",
    };
  }

  if (!role || role === "") {
    return {
      status: 500,
      code: "INTERNAL SERVER ERROR",
      routeAccess: false,
      message: "Invalid role.",
    };
  }

  const requiredRoute = `${routeMethod}::${route}`;

  if (!roleRoutes[requiredRoute]) {
    return {
      status: 400,
      code: "BAD REQUEST",
      routeAccess: false,
      message: "Route doesn't exist",
    };
  }

  const allowedRoles = roleRoutes[requiredRoute];
  const foundRole = allowedRoles.find((currRole: string) => role === currRole);
  if (!foundRole) {
    return {
      status: 403,
      code: "FORBIDDEN REQUEST",
      routeAccess: false,
      message: "You don't have permission to access the route.",
    };
  }

  return {
    status: 200,
    code: "OK",
    routeAccess: true,
    message: "OK",
  };
};

export default hasRouteAccess;
