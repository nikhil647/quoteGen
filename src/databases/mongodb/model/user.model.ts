import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  generatePasswordReset: () => void;
  changedName: () => void;
  isSubscribed: boolean;
}
