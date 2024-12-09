import { Message } from 'node-nats-streaming';
import { ChannelFollowshipCreatedEvent, ChannelFollowshipDeletedEvent, ChannelFollowshipUpdatedEvent, Listener, Subjects } from '@htkradass/nestcommon';
import { queueGroupName } from './queue-group-name';
import { ChannelFollowshipService } from 'src/channel/channel/followship.service';

export class ChannelFollowshipCreatedListener extends Listener<ChannelFollowshipCreatedEvent> {
  subject: Subjects.ChannelFollowshipCreated = Subjects.ChannelFollowshipCreated;
  queueGroupName = queueGroupName;
  chFollowshipService: ChannelFollowshipService;

  setChFollowshipService(service: ChannelFollowshipService) {
    this.chFollowshipService = service;
  }

  async onMessage(data: ChannelFollowshipCreatedEvent['data'], msg: Message) {
    try {
      this.chFollowshipService.createOrUpdate(data);
    } catch (err) { }
    msg.ack();
  }
}

export class ChannelFollowshipUpdatedListener extends Listener<ChannelFollowshipUpdatedEvent> {
  subject: Subjects.ChannelFollowshipUpdated = Subjects.ChannelFollowshipUpdated;
  queueGroupName = queueGroupName;
  chFollowshipService: ChannelFollowshipService;

  setChFollowshipService(service: ChannelFollowshipService) {
    this.chFollowshipService = service;
  }

  async onMessage(data: ChannelFollowshipUpdatedEvent['data'], msg: Message) {
    try {
      this.chFollowshipService.createOrUpdate(data);
    } catch (err) { }
    msg.ack();
  }
}

export class ChannelFollowshipDeletedListener extends Listener<ChannelFollowshipDeletedEvent> {
  subject: Subjects.ChannelFollowshipDeleted = Subjects.ChannelFollowshipDeleted;
  queueGroupName = queueGroupName;
  chFollowshipService: ChannelFollowshipService;

  setChFollowshipService(service: ChannelFollowshipService) {
    this.chFollowshipService = service;
  }

  async onMessage(data: ChannelFollowshipDeletedEvent['data'], msg: Message) {
    try {
      this.chFollowshipService.createOrUpdate(data);
    } catch (err) { }
    msg.ack();
  }
}
