import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
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

  create(createMessageDto: CreateMessageDto): MessageEntity {
    this.lastId++;
    const id = this.lastId;
    const newMessage = {
      id,
      ...createMessageDto,
      isRead: false,
      date: new Date(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  update(id: number, updateMessageDto: UpdateMessageDto): MessageEntity {
    const existingMessageIndex = this.messages.findIndex(
      (item) => item.id === id,
    );

    if (existingMessageIndex < 0) {
      this.throwNotFoundError('Message to be updated not found');
    }

    const existingMessage = this.messages[existingMessageIndex];
    this.messages[existingMessageIndex] = {
      ...existingMessage,
      ...updateMessageDto,
    };
    return this.messages[existingMessageIndex];
  }

  delete(id: number): number {
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
