


export type RoleType = "admin" | "writer" | ["admin", "writer"];

export interface UserModel {
  id: number;
  username: string;
  email: string;
  password?: string;
  photoProfile?: string;
  provider?: string;
  role?: RoleType;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpired?: string;
  verificationRequestDate?: string;
};


export interface UserModelTable {
  id: number;
  username: string;
  email: string;
  password?: string;
  photoProfile?: string;
  provider?: string;
  role?: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpired?: string;
  verificationRequestDate?: string;
};


export interface UserParamsModel {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  role?: string;
  isVerified?: boolean;
  country?: string;
  sortBy?: string;
  sortOrder?: string;
}