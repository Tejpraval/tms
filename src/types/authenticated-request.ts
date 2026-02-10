import { Request } from "express";
import { RequestUser } from "./request-user";

export interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

