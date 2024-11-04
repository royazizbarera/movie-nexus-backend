import { Request, Response, NextFunction } from "express";
import passport from "passport";
import ResponseApi from "../config/ResponseApi";
import authService from "../services/AuthService";
import HttpStatus from "../config/constants/HttpStatus";
import { generateToken } from "../helpers/handleToken";
import { setTokenCookies } from "../helpers/setTokenCookies";
import MailService from "../services/MailService";
import { User } from "@prisma/client";

class AuthController {
  private static instance: AuthController;

  private constructor() {}

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }

    return AuthController.instance;
  }

  // Gunakan arrow functions agar konteks `this` tetap terikat dengan benar
  passportAuth = (req: Request, res: Response, next: NextFunction) => {
    const redirectUrl = req.query.redirectUrl || "/";
    const session = req.session as any;
    session.redirectUrl = redirectUrl;

    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })(req, res, next);
  };

  passportRedirect = passport.authenticate("google");

  // Gunakan arrow functions untuk memastikan `this` tetap terikat dengan benar
  passportCallback = (req: Request, res: Response) => {
    passport.authenticate("google", async (err: any, user: User, info: any) => {
      try {
        if (err || !user) {
          console.error(err);
          console.error(user);
          return res.status(401).json({ message: "Authentication failed" });
        }
        const session = req.session as any;
        const redirectUrl = session.redirectUrl || "http://localhost:3002"; // Default ke Home di client
        delete session.redirectUrl; // Hapus redirectUrl setelah digunakan
        console.log("user", user);
        // Buat token JWT dan setel cookie
        const token = generateToken(user.id, user.email);
        setTokenCookies(res, token);

        // Redirect ke URL setelah login berhasil
        res.redirect(redirectUrl);
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Error during Google login", error });
      }
    })(req, res);
  };

  // Protected route handler to check if user is authenticated
  protectedRoute = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const user: any = req.user;
      res.json({ message: `Hello ${user?.displayName}!` });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // TODO: Membuat sign up with email and password
  public async signUpWithEmailPassword(req: Request, res: Response) {
    // ambil username, email, dan password dari request body
    const { username, email, password } = req.body;

    try {
      // daftar pake service
      const user = await authService.signUpEmailAndPassword(
        username,
        email,
        password
      );

      // buat token dan simpan di cookie
      const token = generateToken(user.id, user.email);
      setTokenCookies(res, token);

      try {
        // kirim kode verifikasi ke email
        await MailService.sendVerificationCode(
          user.email,
          user.verificationCode!
        );
      } catch (error) {
        console.log("Failed to send verification code", error);
      }
      console.info(`User ${user.email} sign up`);
      // kirim response
      return res.status(HttpStatus.CREATED).json(
        ResponseApi({
          code: HttpStatus.CREATED,
          message: "User created successfully",
          data: user,
          version: 1.0,
        })
      );
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseApi({
          code: HttpStatus.BAD_REQUEST,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  }

  // TODO: Implement sign in with email and password controller
  public async signInWithEmailAndPassword(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await authService.signInWithEmailAndPassword(
        email,
        password
      );

      // buat token simpan di cookie
      const token = generateToken(user.id, user.email);
      setTokenCookies(res, token);
      console.info(`User ${user.email} logged in`);
      // kirim respon
      return res.status(HttpStatus.OK).json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "Login successfully",
          data: user,
          version: 1.0,
        })
      );
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseApi({
          code: HttpStatus.BAD_REQUEST,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  }

  // TODO: Implement verify user controller using verification code controller
  public async verifyEmail(req: Request, res: Response) {
    const { verificationCode } = req.body;

    try {
      const user = await authService.verifyUser(verificationCode);

      // kirim respon
      return res.status(HttpStatus.OK).json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "User verified successfully",
          data: user,
          version: 1.0,
        })
      );
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseApi({
          code: HttpStatus.BAD_REQUEST,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  }

  // TODO: Implement resend verification code controller
  public async resendVerificationCode(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const user = await authService.resendVerificationCode(email);
      // kirim kode verifikasi ke email
      await MailService.sendVerificationCode(
        user.email,
        user.verificationCode!
      );

      // kirim respon
      return res.status(HttpStatus.OK).json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "Verification code sent successfully",
          data: user,
          version: 1.0,
        })
      );
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseApi({
          code: HttpStatus.BAD_REQUEST,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  }

  // TODO: delete user controller
  public async deleteUser(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const user = await authService.deleteUser(email);
      return res.status(HttpStatus.OK).json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "User deleted successfully",
          data: user,
          version: 1.0,
        })
      );
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseApi({
          code: HttpStatus.BAD_REQUEST,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  }

  // TODO: Implement logout controller
  public async logout(req: Request, res: Response) {
    try {
      res.clearCookie("token");
      res.status(HttpStatus.OK).json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "Logout successfully",
          version: 1.0,
        })
      );
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseApi({
          code: HttpStatus.BAD_REQUEST,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  }

  // TODO: Implement check auth controller
  public async checkAuth(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const user = await authService.checkAuth(email);
      return res.status(HttpStatus.OK).json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "User authenticated",
          data: user,
          version: 1.0,
        })
      );
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseApi({
          code: HttpStatus.BAD_REQUEST,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  }
}

const authController = AuthController.getInstance();
export default authController;
