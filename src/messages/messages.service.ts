import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { EmailService } from 'src/email/email_service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
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
    private readonly emailService: EmailService,
  ) { }

  throwNotFoundError(message: string) {
    throw new NotFoundException(message);
  }

  async findAll(paginationDto?: PaginationDto): Promise<MessageDto[]> {
    const { limit = 10, offset = 0 } = paginationDto ?? {};
    const messages = await this.messageRepository.find({
      take: limit,
      skip: offset,
      relations: ['from', 'receivers', 'receivers.receiver'],
      order: { id: 'desc' },
    });
    return messages.map(message => MessageEntity.toDto(message));
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['from', 'receivers', 'receivers.receiver'],
    });

    if (!message) this.throwNotFoundError('Message not found');

    return message;
  }

  async create(
    createMessageDto: CreateMessageDto,
    tokenPayload: TokenPayloadDto,
  ): Promise<MessageEntity> {
    const { receiversId, text } = createMessageDto;

    const from = await this.usersService.findOne(tokenPayload.sub);

    const message = this.messageRepository.create({
      text,
      from,
      date: new Date(),
    });
    const savedMessage = await this.messageRepository.save(message);

    const receivers = await Promise.all(
      receiversId.map(async (id) => {
        const receiver = await this.usersService.findOne(id);

        await this.emailService.sendEmail(
          receiver.email,
          `Vc recebeu um recado de ${from.name}`,
          createMessageDto.text
        );
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
    tokenPayload: TokenPayloadDto,
  ): Promise<MessageEntity> {
    const existingMessage = await this.messageRepository.findOne({
      where: { id },
      relations: ['from', 'receivers'],
    });

    if (existingMessage?.from.id != tokenPayload.sub) {
      throw new ForbiddenException('This message is not yours');
    }

    if (!existingMessage) {
      throw new NotFoundException('Message to be updated was not found');
    }

    const updatedMessage = this.messageRepository.merge(existingMessage, {
      text: updateMessageDto.text ?? existingMessage.text,
    });

    return this.messageRepository.save(updatedMessage);
  }

  async delete(
    id: number,
    tokenPayload: TokenPayloadDto,
  ): Promise<MessageEntity> {
    const existingMessage = await this.messageRepository.findOne({
      where: { id },
      relations: ['from', 'receivers'],
    });

    if (!existingMessage)
      throw new NotFoundException('Message to be deleted was not found');

    if (existingMessage?.from.id != tokenPayload.sub) {
      throw new ForbiddenException('This message is not yours');
    }

    return this.messageRepository.remove(existingMessage);
  }
}
