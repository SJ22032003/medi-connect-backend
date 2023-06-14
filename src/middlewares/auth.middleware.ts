import jwt from "jsonwebtoken";
import { NextFunction, Response } from "../types/package.type";
import { IRequestWithRole } from "../types/request.type";
import { getOnePatientDetails } from "../service/patient.service";
import { getOneDoctorDetails } from "../service/doctor.service";

const protect = async (
  req: IRequestWithRole,
  res: Response,
  next: NextFunction,
) => {
  let token = "";
  if (
    req.headers.authorization
    && req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verfiy Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (typeof decoded === "string") {
        return res
          .status(401)
          .json({ message: "Not authorized, token failed" })
          .end();
      }

      // Getting the Admin Type
      const { role, id, name } = decoded.user;
      req.role = role;
      req.id = id;
      req.name = name;

      // CHECK IF USER EXISTS IN DB
      // CHECK USER ROLE
      let user = null;
      switch (role) {
        case "patient":
          // CHECK IF USER EXISTS IN DB
          user = await getOnePatientDetails({ _id: id }, { _id: 1 });
          if (user instanceof Error) {
            return res
              .status(401)
              .json({
                message: "Not authorized, token failed or user not found",
              })
              .end();
          }
          break;
        case "doctor":
          // CHECK IF USER EXISTS IN DB
          user = await getOneDoctorDetails({ _id: id }, { _id: 1 });
          if (user instanceof Error) {
            return res
              .status(401)
              .json({
                message: "Not authorized, token failed or user not found",
              })
              .end();
          }
          break;
        default:
          return res
            .status(401)
            .json({ message: "Not authorized, token failed" });
      }
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Not authorized, token failed" })
        .end();
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" }).end();
  }
  next();
};

export default protect;
