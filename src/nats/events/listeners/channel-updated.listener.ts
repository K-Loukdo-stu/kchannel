import { Message } from 'node-nats-streaming';
import { ChannelUpdatedEvent, Listener, Subjects } from '@htkradass/nestcommon';
import { queueGroupName } from './queue-group-name';
import { ChannelService } from 'src/channel/channel/channel.service';

export class ChannelUpdatedListener extends Listener<ChannelUpdatedEvent> {
  subject: Subjects.ChannelUpdated = Subjects.ChannelUpdated;
  queueGroupName = queueGroupName;
  channelService: ChannelService;

  setChannelService(service: ChannelService) {
    this.channelService = service;
  }

  async onMessage(data: ChannelUpdatedEvent['data'], msg: Message) {
    try {
      const channel = {
        id: data.id,
        name: data.name,
        bio: data.bio,
        profile: data.profile,
        cover: data.cover,
        desc: data.desc,
      }
      this.channelService.update(null, channel)
    } catch (err) { }

    msg.ack();
  }
}
