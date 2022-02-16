import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";

let mongo: any;

declare global {
  var signin: (id?: string) => string[];
}

//hook that runs before all tests are executed
process.env.STRIPE_KEY =
  "sk_test_51KTVqcBvUCV170dj6RLI1mdLWDAc0eFed9RKJOV0XVjwQuE5Gkzwzfkzkch0hO2DVJdKPYuBLPBsv9D6Eiq4nK0j00OAttpgLI";
process.env.JWT_KEY = "jewgbkjewbmn,wb";
jest.mock("../nats-wrapper");
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoURI = await mongo.getUri();
  await mongoose.connect(mongoURI);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};
