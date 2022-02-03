import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@dross-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/Ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find ticket that the order is associated with
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket found, throw an error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as being reserved by setting orderId
    ticket.set({ orderId: data.id });

    // Save the ticket and acknowledge the message
    await ticket.save();
    msg.ack();
  }
}
