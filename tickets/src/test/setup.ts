import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";

let mongo: any;

declare global {
  var signin: () => string[];
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

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};
