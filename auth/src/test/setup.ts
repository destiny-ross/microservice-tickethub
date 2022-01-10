import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

let mongo: any;

declare global {
  var signup: () => Promise<string[]>;
}

//hook that runs before all tests are executed
process.env.JWT_KEY = "jewgbkjewbmn,wb";
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoURI = await mongo.getUri();
  await mongoose.connect(mongoURI);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password });

  const cookie = response.get("Set-Cookie");

  return cookie;
};
