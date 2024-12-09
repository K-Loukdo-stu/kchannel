import { Listener, Subjects, UserCreatedEvent, UserUpdatedEvent } from '@htkradass/nestcommon';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { UserService } from 'src/user/user.service';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = queueGroupName;
  userService: UserService;

  setUserService(service: UserService) {
    this.userService = service;
  }

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    try {
      await this.userService.createOrUpdate(data);
    } catch (error) {
      console.log(error);
    }
    msg.ack();
  }
}

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;
  userService: UserService;

  setUserService(service: UserService) {
    this.userService = service;
  }

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    try {
      await this.userService.update(data);
    } catch (error) {
      console.log(error);
    }

    msg.ack();
  }
}
