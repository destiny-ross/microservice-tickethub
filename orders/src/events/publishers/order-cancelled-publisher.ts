import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@dross-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
