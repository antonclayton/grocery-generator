import mongoose from "mongoose";
const Schema = mongoose.Schema;

// no password for google OAuth
const userSchema = new Schema(
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
    accessToken: {
      type: String,
      default: null,
    },
    accessTokenExpiresAt: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
