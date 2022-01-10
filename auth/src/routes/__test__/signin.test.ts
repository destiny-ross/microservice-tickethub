import request from "supertest";
import { app } from "../../app";

it("fails when email that does not exist in db is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

it("fails when incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "pa" })
    .expect(400);
});

it("responds with cookie when provided correct log in credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  const res = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(200);

  expect(res.get("Set-Cookie")).toBeDefined();
});
