import { Publisher, Subjects, ChannelDeletedEvent } from '@htkradass/nestcommon';
export class ChannelDeletedEventPublisher extends Publisher<ChannelDeletedEvent> {
  subject: Subjects.ChannelDeleted = Subjects.ChannelDeleted;
}
