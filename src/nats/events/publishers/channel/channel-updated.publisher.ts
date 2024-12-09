import { Publisher, Subjects, ChannelUpdatedEvent } from '@htkradass/nestcommon';
export class ChannelUpdatedEventPublisher extends Publisher<ChannelUpdatedEvent> {
  subject: Subjects.ChannelUpdated = Subjects.ChannelUpdated;
}
