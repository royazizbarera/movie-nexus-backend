export default interface UserModel {
  id: number;
  username: string;
  email: string;
  password: string;
  photoProfile: string | null;
  provider: string | null;
  role: string | null;
  isVerified: boolean;
  verificationCode: string | null;
  verificationRequestDate: Date | null;
}
