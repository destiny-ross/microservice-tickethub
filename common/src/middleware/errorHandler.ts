import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../../../common/src/errors/request-validation-error";
import { DatabaseConnectionError } from "../../../common/src/errors/database-connection-error";
import { CustomError } from "../../../common/src/errors/custom-error";

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
