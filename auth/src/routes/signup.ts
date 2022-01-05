import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

const router = express.Router();
router.post(
  "/api/users/signup",
  // validation middleware using express-middleware
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be between 6 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    console.log("creating user...");
    throw new DatabaseConnectionError();

    const { email, password } = req.body;

    res.send({});
  }
);

export { router as signupRouter };
