import { Message } from 'node-nats-streaming';
import { ChannelDeletedEvent, Listener, Subjects } from '@htkradass/nestcommon';
import { queueGroupName } from './queue-group-name';

export class ChannelDeletedListener extends Listener<ChannelDeletedEvent> {
  subject: Subjects.ChannelDeleted = Subjects.ChannelDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ChannelDeletedEvent['data'], msg: Message) {
    try {
      const { id } = data;

      // To do
    } catch (err) { }

    msg.ack();
  }
}
