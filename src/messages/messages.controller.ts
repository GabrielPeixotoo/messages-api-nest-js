import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Controller('/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Get()
  findAll(): MessageEntity[] {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): MessageEntity | undefined {
    return this.messagesService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: MessageEntity): MessageEntity {
    return this.messagesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: object) {
    return this.messagesService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): number | undefined {
    return this.messagesService.delete(Number(id));
  }
}
