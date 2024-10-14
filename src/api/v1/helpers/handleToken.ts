import jwt from "jsonwebtoken";

// generate token and set cookies
export const generateToken = (userId: number, email: string) => {
  // buat token
  const token = jwt.sign(
    { id: userId, email: email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return token;
};

export const decodeToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    throw new Error("Failed to decode token");
  }
};

// get email from token
export const getEmailFromToken = (token: string) => {
  const decoded = decodeToken(token) as jwt.JwtPayload;
  return decoded.email;
};
