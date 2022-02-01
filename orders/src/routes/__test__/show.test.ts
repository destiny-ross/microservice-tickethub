import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

it("returns order info", async () => {
  const ticket = Ticket.build({
    title: "K.Flay w/ PVRIS",
    price: 40,
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetched } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetched.id).toEqual(order.id);
});

it("returns NotAuthedError if a user attempts to view another user's order", async () => {
  const ticket = Ticket.build({
    title: "K.Flay w/ PVRIS",
    price: 40,
  });
  await ticket.save();

  const user = global.signin();
  const user2 = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .send()
    .expect(401);
});
