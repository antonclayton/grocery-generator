import mongoose, { Schema, Document } from "mongoose";

interface IUser {
  googleId: string;
  email: string;
  name: string;
  avatar?: string | null;
}

interface UserDocument extends IUser, Document {}

// no password for google OAuth
const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export { UserModel, UserDocument };
