import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import HttpStatus from "../config/constants/HttpStatus";
import ResponseApi from "../config/ResponseApi";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies.token) {
      throw new Error("Unauthorized");
    }

    const token = req.cookies.token;
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    if (!decoded.email) {
      throw new Error("Unauthorized");
    }

    req.body.email = decoded.email;

    next();
  } catch (error: any) {
    res.status(HttpStatus.UNAUTHORIZED).json(
      ResponseApi({
        code: HttpStatus.UNAUTHORIZED,
        message: error.message || "Unauthorized",
      })
    );
  }
};
