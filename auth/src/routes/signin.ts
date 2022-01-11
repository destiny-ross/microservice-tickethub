import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { validateRequest } from "../utilities/validateRequest";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../utilities/password";

const router = express.Router();
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: token,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };