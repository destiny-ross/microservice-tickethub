import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from "@dross-tickets/common";
import { createChargeRouter } from "./routes/new";

const app = express();

// global middleware
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

// routers
app.use(createChargeRouter);

// Not found
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
