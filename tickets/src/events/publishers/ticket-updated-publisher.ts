import { Publisher, Subjects, TicketUpdatedEvent } from "@dross-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
