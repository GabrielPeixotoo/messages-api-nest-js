import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageEntity } from './entities/message.entity';
import { MessageReceiverEntity } from './entities/message.receiver.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(MessageReceiverEntity)
    private readonly receiverRepository: Repository<MessageReceiverEntity>,
    private readonly usersService: UsersService,
  ) {}

  throwNotFoundError(message: string) {
    throw new NotFoundException(message);
  }

  async findAll(): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      relations: ['from', 'receivers', 'receivers.receiver'],
      order: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['from', 'receivers', 'receivers.receiver'],
    });

    if (!message) this.throwNotFoundError('Message not found');

    return message;
  }

  async create(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
    const { senderId, receiversId, text } = createMessageDto;

    const from = await this.usersService.findOne(senderId);

    const message = this.messageRepository.create({
      text,
      from,
      date: new Date(),
    });
    const savedMessage = await this.messageRepository.save(message);

    const receivers = await Promise.all(
      receiversId.map(async (id) => {
        const receiver = await this.usersService.findOne(id);
        return this.receiverRepository.create({
          receiver,
          message: savedMessage,
          isRead: false,
        });
      }),
    );

    await this.receiverRepository.save(receivers);
    return savedMessage;
  }

  async update(
    id: number,
    updateMessageDto: UpdateMessageDto,
  ): Promise<MessageEntity> {
    const existingMessage = await this.messageRepository.findOne({
      where: { id },
      relations: ['from', 'receivers'],
    });

    if (!existingMessage) {
      throw new NotFoundException('Message to be updated was not found');
    }

    const updatedMessage = this.messageRepository.merge(existingMessage, {
      text: updateMessageDto.text ?? existingMessage.text,
      isRead: updateMessageDto.isRead ?? existingMessage.isRead,
    });

    return this.messageRepository.save(updatedMessage);
  }

  async delete(id: number): Promise<MessageEntity> {
    const message = await this.messageRepository.findOneBy({ id });

    if (!message)
      throw new NotFoundException('Message to be deleted was not found');

    return this.messageRepository.remove(message);
  }
}
