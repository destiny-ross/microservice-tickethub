import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { CustomError } from "../errors/custom-error";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // generic error not specifically handled
  return res
    .status(400)
    .send({ errors: [{ message: "Something went wrong." }] });
};

export default errorHandler;
