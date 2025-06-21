import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
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
  create(@Body() createMessageDto: CreateMessageDto): MessageEntity {
    return this.messagesService.create(createMessageDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(Number(id), updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): number {
    return this.messagesService.delete(id);
  }
}
