import { Publisher, Subjects, TicketCreatedEvent } from "@dross-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
