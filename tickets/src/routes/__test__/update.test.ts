import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns 404 if attempts to update a ticket with id that does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "Paramore", price: 45 })
    .expect(404);
});

it("returns 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "Paramore", price: 45 })
    .expect(401);
});

it("returns 403 if user does not own ticket", async () => {
  const newTicket = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Paramore",
      price: 40,
    });

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    // completely different user
    .set("Cookie", global.signin())
    .send({
      title: "Paramore",
      price: 45,
    })
    .expect(401);
});

it("returns 400 if user provides invalid title or price", async () => {
  const cookie = global.signin();

  const newTicket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Paramore",
      price: 40,
    });

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 45,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Paramore",
      price: -20,
    })
    .expect(400);
});

it("updates ticket ", async () => {
  const cookie = global.signin();

  const newTicket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Paramore",
      price: 40,
    });

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Paramore",
      price: 45,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${newTicket.body.id}`)
    .send();

  expect(ticketResponse.body.price).toEqual(45);
});
