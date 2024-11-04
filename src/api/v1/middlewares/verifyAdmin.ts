import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "../config/constants/HttpStatus";
import ResponseApi from "../config/ResponseApi";
import prisma from "../config/client";

/**
 * Middleware to verify if the user is an admin.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const verifyAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Unauthorized");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        if (!decoded.email) {
            throw new Error("Unauthorized");
        }

        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
        });

        if (!user || user.role !== "admin") {
            throw new Error("Unauthorized: Admins only");
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