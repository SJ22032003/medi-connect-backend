import jwt from "jsonwebtoken";

type TUser = {
  id: string;
  role: string;
  name?: string;
  email?: string;
  phone?: string;
};

const secret = process.env.JWT_SECRET || "";

const generateToken = (user: TUser) => jwt.sign({ user }, secret, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

export default generateToken;
