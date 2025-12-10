import { model, Schema } from "mongoose";
import { IApproval_Status, IHost } from "./host.interfaces";

const hostSchema = new Schema<IHost>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    approval_Status: {
      type: String,
      enum: Object.values(IApproval_Status),
      default: IApproval_Status.PENDING,
    },
    events: { type: [Schema.Types.ObjectId], ref: "Event" },
  },
  { timestamps: true, versionKey: false }
)

export const Host = model<IHost>("Host", hostSchema)
