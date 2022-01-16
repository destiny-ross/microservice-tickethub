import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../../../common/src/errors/not-authorized-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //require auth will only run after currentuser middleware

  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
