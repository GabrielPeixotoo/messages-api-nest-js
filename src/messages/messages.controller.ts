import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageEntity } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Controller('/messages')
@UsePipes(ParseIntIdPipe)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<MessageEntity[]> {
    return this.messagesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void | MessageEntity> {
    return this.messagesService.delete(id);
  }
}
