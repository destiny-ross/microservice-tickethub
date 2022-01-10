import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
  // check environment variables are defined

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-service-cip:27017/auth");
    console.log("Connected to mongodb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Auth service listening on port 3000");
  });
};

start();
