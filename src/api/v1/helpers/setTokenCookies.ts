import { Response } from "express";

export const setTokenCookies = (res: Response, token: string) => {
  try {
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for cross-site, lax for dev
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
      path: "/", // Ensure cookie is available site-wide
    });
  } catch (error) {
    console.error("Failed to set token cookie:", error);
  }
};
