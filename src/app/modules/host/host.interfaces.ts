import { Types } from "mongoose";

export enum IApproval_Status {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface IHost {
  user: Types.ObjectId;
  approval_Status: IApproval_Status;
  events?: Types.ObjectId[];
}

export interface IQuery {
  searchTerm?: string;
  status?: string;
  sortBy?: string;
}
