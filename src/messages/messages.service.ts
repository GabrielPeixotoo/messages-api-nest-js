import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}
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

  async findAll(): Promise<MessageEntity[]> {
    const messages = await this.messageRepository.find();
    return messages;
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
    });

    if (message) return message;

    this.throwNotFoundError('Message not found');
  }

  async create(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
    const newMessage = {
      ...createMessageDto,
      isRead: false,
      date: new Date(),
    };
    const entity = this.messageRepository.create(newMessage);

    return await this.messageRepository.save(entity);
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const partialUpdateRecadoDto = {
      isRead: updateMessageDto?.isRead,
      text: updateMessageDto?.text,
    };
    const message = await this.messageRepository.preload({
      id,
      ...partialUpdateRecadoDto,
    });

    if (!message)
      return this.throwNotFoundError('Message to be updated was not found');

    return this.messageRepository.save(message);
  }

  async delete(id: number) {
    const message = await this.messageRepository.findOneBy({
      id,
    });

    if (!message)
      return this.throwNotFoundError('Message to be deleted was not found');

    return this.messageRepository.remove(message);
  }
}
