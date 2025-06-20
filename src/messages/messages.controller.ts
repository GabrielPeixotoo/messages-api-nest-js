import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessagesService, PaginationParams } from './messages.service';

@Controller('/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Get()
  findAll(@Query() pagination: PaginationParams): string {
    return this.messagesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return this.messagesService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: object): object {
    return this.messagesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: object) {
    return this.messagesService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return this.messagesService.delete(Number(id));
  }
}
