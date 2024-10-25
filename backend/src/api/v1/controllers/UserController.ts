// import { Request, Response ,NextFunction } from "express";
// import UserService from "../services/UserService";
// import ResponseApi from "../config/ResponseApi";

// class UserController {
//   signUpEmailAndPassword = async (req: Request, res: Response) => {
//     try {
//       const { username, email, password } = req.body;
//       const user = await UserService.signUpEmailAndPassword({
//         username,
//         email,
//         password,
//       });
//       return res.status(201).json(
//         ResponseApi({
//           code: 201,
//           message: "User created successfully",
//           data: user,
//           version: 1.0,
//         })
//       );
//     } catch (error) {
//       return res.json(
//         ResponseApi({
//           code: 500,
//           message: String(error),
//           errors: error,
//           version: 1.0,
//         })
//       );
//     }
//   };

//   signInWithEmailAndPassword = async (req: Request, res: Response) => {
//     try {
//       const { email, password } = req.body;
//       const user = await UserService.signInWithEmailAndPassword(email, password);
//       return res.status(200).json(
//         ResponseApi({
//           code: 200,
//           message: "User signed in successfully",
//           data: user,
//           version: 1.0,
//         })
//       );
//     } catch (error) {
//       return res.json(
//         ResponseApi({
//           code: 500,
//           message: String(error),
//           errors: error,
//           version: 1.0,
//         })
//       );
//     }
//   };

//   // check is verified
//   isVerified = async (req: Request, res: Response) => {
//     try {
//       const { user } = req.body;
//       const isVerified = await UserService.isVerified(user.email);
//       return res.status(200).json(
//         ResponseApi({
//           code: 200,
//           message: "User status verified",
//           data: isVerified,
//           version: 1.0,
//         })
//       );
//     } catch (error) {
//       return res.json(
//         ResponseApi({
//           code: 500,
//           message: String(error),
//           errors: error,
//           version: 1.0,
//         })
//       );
//     }
//   };

//   // middleware verify token
//   verifyToken = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { token } = req.body;
//       const user = await UserService.verifyToken(token);
//       if (user) {
//         req.body.user = user;
//         return next();
//       }
//       return res.json(
//         ResponseApi({
//           code: 500,
//           message: "Token is not valid",
//           errors: "Token is not valid",
//           version: 1.0,
//         })
//       );
//     } catch (error) {
//       return res.json(
//         ResponseApi({
//           code: 500,
//           message: String(error),
//           errors: error,
//           version: 1.0,
//         })
//       );
//     }
//   };

//   // get email from token
//   getEmailFromToken = async (req: Request, res: Response) => {
//     try {
//       const { token } = req.body;
//       const email = await UserService.getEmailFromToken(token);
//       return res.status(200).json(
//         ResponseApi({
//           code: 200,
//           message: "Email from token",
//           data: email,
//           version: 1.0,
//         })
//       );
//     } catch (error) {
//       return res.json(
//         ResponseApi({
//           code: 500,
//           message: String(error),
//           errors: error,
//           version: 1.0,
//         })
//       );
//     }
//   };

//   createVerificationCode = async (req: Request, res: Response) => {
//     try {
//       const { email } = req.body;
//       const verificationCode = await UserService.createVerificationCode(email);
//       return res.status(200).json(
//         ResponseApi({
//           code: 200,
//           message: "Verification code created",
//           data: verificationCode,
//           version: 1.0,
//         })
//       );
//     } catch (error) {
//       return res.json(
//         ResponseApi({
//           code: 500,
//           message: String(error),
//           errors: error,
//           version: 1.0,
//         })
//       );
//     }
//   }

//   getVerificationCode = async (req: Request, res: Response) => {
//     try {
//       const { email } = req.body;
//       const verificationCode = await UserService.getVerificationCode(email);
//       return res.status(200).json(
//         ResponseApi({
//           code: 200,
//           message: "Verification code",
//           data: verificationCode,
//           version: 1.0,
//         })
//       );
//     } catch (error) {
//       return res.json(
//         ResponseApi({
//           code: 500,
//           message: String(error),
//           errors: error,
//           version: 1.0,
//         })
//       );
//     }
//   }

//   verifyVerificationCode = async (req: Request, res: Response) => {
//     try {
//       const { email, verificationCode } = req.body;
//       const isVerified = await UserService.verifyVerificationCode(email, verificationCode);
//       return res.status(200).json(
//         ResponseApi({
//           code: 200,
//           message: "Verification code verified",
//           data: isVerified,
//           version: 1.0,
//         })
//       );
//     } catch (error) {
//       return res.json(
//         ResponseApi({
//           code: 500,
//           message: String(error),
//           errors: error,
//           version: 1.0,
//         })
//       );
//     }
//   }

// }

// export default new UserController();

export default class UserController {}
