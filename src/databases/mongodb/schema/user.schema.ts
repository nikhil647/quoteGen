import { Schema, model } from "mongoose";
import { IUser } from "../model/user.model";
import { boolean } from "joi";
const crypto = require("crypto");

const schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    isSubscribed: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  {
    timestamps: true,
  },
);

schema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

export default model<IUser>("user", schema);
