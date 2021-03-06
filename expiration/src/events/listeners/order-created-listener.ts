import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@dross-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("waiting", delay, "ms");
    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  }
}
