import jwt from "jsonwebtoken";
import * as jose from "jose";

const jwtSecret = process.env.JWT_SECRET as string;

export const signToken = (payload: { _id: string; email: string }) => {
  return jwt.sign(payload, jwtSecret);
};

export const verifyTokenJose = async <T>(token: string) => {
  const secret = new TextEncoder().encode(jwtSecret);

  const { payload } = await jose.jwtVerify<T>(token, secret);
  return payload;
};
