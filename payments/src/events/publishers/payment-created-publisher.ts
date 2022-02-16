import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from "@dross-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
