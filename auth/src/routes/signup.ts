import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/User";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { BadRequestError } from "../errors/bad-request-error";

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
  async (req: Request, res: Response) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    console.log("creating user...");

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email is in use.");
    }

    const user = User.build({ email, password });
    await user.save();

    res.status(201).send({ user });
  }
);

export { router as signupRouter };
