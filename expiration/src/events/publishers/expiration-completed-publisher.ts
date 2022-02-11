import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@dross-tickets/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
