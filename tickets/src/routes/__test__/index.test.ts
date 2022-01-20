import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

const createTicket = (title: String, price: Number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);
};

it("can fetch a list of tickets", async () => {
  await createTicket("Paramore", 20);
  await createTicket("K.Flay", 30);
  await createTicket("Lights @ St Andrews", 45);
  const response = await request(app).get("/api/tickets").send().expect(200);
  expect(response.body.length).toEqual(3);
});
