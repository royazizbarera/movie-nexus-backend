// import prisma from "../config/client";
// import { Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // import { hash } from 'bcryptjs';  // Menggunakan bcryptjs untuk hashing password

// export interface SignUpEmailAndPasswordRequest {
//   username: string;
//   email: string;
//   password: string;
// }

// class UserService {
//   async signUpEmailAndPassword(request: SignUpEmailAndPasswordRequest) {
//     const { username, email, password } = request;

//     // 1. Validasi input: Pastikan semua data ada
//     if (!username || !email || !password) {
//       throw new Error("All fields must be provided");
//     }

//     // 2. Cek apakah pengguna dengan email atau username tersebut sudah ada
//     const existingUser = await prisma.user.findFirst({
//       where: {
//         OR: [{ email }, { username }],
//       },
//     });

//     if (existingUser) {
//       throw new Error("User with this email or username already exists");
//     }

//     // 3. Hashing password menggunakan bcrypt

//     // 4. Simpan pengguna baru ke database
//     const newUser = await prisma.user.create({
//       data: {
//         provider: "email",
//         username,
//         email,
//         password,
//       },
//     });

//     const token = jwt.sign(
//       {
//         id: newUser.id,
//         email: newUser.email,
//       },
//       this.secret,
//       {
//         expiresIn: "1h",
//       }
//     );

//     // 5. Kembalikan data pengguna tanpa mengembalikan password
//     return {
//       id: newUser.id,
//       provider: newUser.provider,
//       username: newUser.username,
//       email: newUser.email,
//       photoProfile: newUser.photoProfile,
//       token: token,
//     };
//   }

//   secret = process.env.JWT_SECRET as string;

//   signInWithEmailAndPassword = async (email: string, password: string) => {
//     try {
//       // 1. Cari pengguna berdasarkan email
//       const user = (await prisma.user.findUnique({
//         where: {
//           email: email,
//         },
//       })) as any;

//       if (!user) {
//         throw Error("Invalid email or password");
//       }

//       // 2. Bandingkan password
//       // const isPasswordValid = await bcrypt.compare(password, user.password);
//       const isPasswordValid = password === user.password;
//       if (!isPasswordValid) {
//         throw Error("Invalid email or password");
//       }

//       // 3. Buat token JWT
//       const token = jwt.sign(
//         {
//           id: user.id,
//           email: user.email,
//         },
//         this.secret,
//         {
//           expiresIn: "12h",
//         }
//       );

//       // 4. Kirim token JWT ke frontend
//       user.token = token;
//       return user;
//     } catch (error) {
//       throw Error("Pengguna tidak ditemukan.");
//     }
//   };

//   // check verification user using token by email
//   isVerified = async (email: string) => {
//     try {
//       const user = await prisma.user.findFirst({
//         where: {
//           email: email,
//         },
//       });

//       if (!user) {
//         return user!.isVerified;
//       }

//       return user.isVerified;
//     } catch (error) {
//       throw error;
//     }
//   };

//   getEmailFromToken = (token: string) => {
//     try {
//       const decoded = jwt.verify(token, this.secret) as any;
//       return decoded.email;
//     } catch (error) {
//       throw error;
//     }
//   };

//   verifyToken = (token: string) => {
//     try {
//       const decoded = jwt.verify(token, this.secret) as any;
//       return decoded;
//     } catch (error) {
//       throw error;
//     }
//   };

//   createVerificationCode = async (email: string) => {
//     const verificationCode = Math.floor(100000 + Math.random() * 900000);

//     try {
//       await prisma.user.update({
//         where: {
//           email: email,
//         },
//         data: {
//           verificationCode: verificationCode,
//         },
//       });

//       return verificationCode;
//     } catch (error) {
//       throw error;
//     }
//   };

//   getVerificationCode = async (email: string) => {
//     try {
//       const user = await prisma.user.findFirst({
//         where: {
//           email: email,
//         },
//       });

//       if (!user) {
//         throw new Error("User not found");
//       }

//       return user.verificationCode;
//     } catch (error) {
//       throw error;
//     }
//   };

//   verifyVerificationCode = async (email: string, verificationCode: number) => {
//     try {
//       const user = await prisma.user.findFirst({
//         where: {
//           email: email,
//         },
//       });

//       if (!user) {
//         throw new Error("User not found");
//       }

//       if (user.verificationCode === verificationCode) {
//         await prisma.user.update({
//           where: {
//             email: email,
//           },
//           data: {
//             isVerified: true,
//           },
//         });

//         return true;
//       }

//       return false;
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// export default new UserService();

export default class UserService {}
