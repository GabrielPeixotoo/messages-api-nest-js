import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessagesService {
  private lastId = 1;
  private messages: MessageEntity[] = [
    {
      id: 1,
      text: 'This is a test message',
      to: 'Joan',
      from: 'Gabriel',
      isRead: false,
      date: new Date(),
    },
  ];

  throwNotFoundError(message: string) {
    throw new NotFoundException(message);
  }

  findAll(): MessageEntity[] {
    return this.messages;
  }

  findOne(id: number): MessageEntity | undefined {
    const message = this.messages.find((item) => item.id === id);

    if (message) return message;

    this.throwNotFoundError('Message not found');
  }

  create(message: MessageEntity): MessageEntity {
    this.lastId++;
    message.id = this.lastId;
    this.messages.push(message);
    const mostRecentMessage = this.messages[this.lastId - 1];
    console.log(mostRecentMessage);
    return mostRecentMessage;
  }

  update(id: number, body: object): MessageEntity | undefined {
    const existingMessageIndex = this.messages.findIndex(
      (item) => item.id === id,
    );

    if (existingMessageIndex < 0) {
      this.throwNotFoundError('Message to be updated not found');
    }

    const existingMessage = this.messages[existingMessageIndex];
    this.messages[existingMessageIndex] = {
      ...existingMessage,
      ...body,
    };
    return this.messages[existingMessageIndex];
  }

  delete(id: number): number | undefined {
    const existingMessageIndex = this.messages.findIndex(
      (item) => item.id === id,
    );

    if (existingMessageIndex < 0) {
      this.throwNotFoundError('Message to be deleted not found');
    }

    this.messages.splice(existingMessageIndex, 1);
    return id;
  }
}
