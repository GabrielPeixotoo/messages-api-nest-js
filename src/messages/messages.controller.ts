import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Get()
  findAll(): string {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return this.messagesService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: any): any {
    return this.messagesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      id,
      ...body,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return `apagado recado de ${id}`;
  }
}
