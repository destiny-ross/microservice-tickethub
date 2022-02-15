import { Order } from "../../../models/Order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@dross-tickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "asdas",
    version: 0,
  });
  await order.save();
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "1324234",
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, order };
};

it("updates status of order", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acknowledges the event", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
