import { Message } from 'node-nats-streaming';
import { ChannelCreatedEvent, Listener, Subjects } from '@htkradass/nestcommon';
import { queueGroupName } from './queue-group-name';
import { ChannelService } from 'src/channel/channel/channel.service';

export class ChannelCreatedListener extends Listener<ChannelCreatedEvent> {
  subject: Subjects.ChannelCreated = Subjects.ChannelCreated;
  queueGroupName = queueGroupName;
  channelService: ChannelService;

  setChannelService(service: ChannelService) {
    this.channelService = service;
  }

  async onMessage(data: ChannelCreatedEvent['data'], msg: Message) {
    try {
      const { createdBy } = data;
      this.channelService.create(createdBy, data)
    } catch (err) { }

    msg.ack();
  }
}
