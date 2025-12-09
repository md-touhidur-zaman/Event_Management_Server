import { model, Schema } from "mongoose";
import { IAuthProviders, IRole, IUser } from "./user.interface";

const authsProviderSchema = new Schema<IAuthProviders>(
  {
    providerId: { type: String, required: true },
    providerName: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    auths: [authsProviderSchema],
    phone: { type: String },
    picture: { type: String },
    about: {type: String},
    interests: {type: [String], required: true},
    location: {type: String, required:true},
    isBlocked: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(IRole),
      required: true,
      default: IRole.USER,
    },
  },
  { versionKey: false, timestamps: true }
);

export const User = model<IUser>("User", userSchema);
