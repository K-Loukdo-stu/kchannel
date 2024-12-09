import { Publisher, Subjects, ChannelCreatedEvent } from '@htkradass/nestcommon';

export class ChannelCreatedEventPublisher extends Publisher<ChannelCreatedEvent> {
  subject: Subjects.ChannelCreated = Subjects.ChannelCreated;
}
