import request from "supertest";
import { app } from "../../app";

it("response with details about current user", async () => {
  const cookie = await global.signup();

  const currentUserResponse = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(currentUserResponse.body.currentUser.email).toEqual("test@test.com");
});

it("responds with will null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
