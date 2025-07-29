import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptor } from 'src/common/interceptors/timing-connection.interceptor';
import { UrlParam } from 'src/common/params/url-param.decorator';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageEntity } from './entities/message.entity';
import { REMOVE_SPACES_REGEX } from './messages.constants';
import { MessagesService } from './messages.service';

@Controller('/messages')
@UsePipes(ParseIntIdPipe)
@UseInterceptors(AddHeaderInterceptor, TimingConnectionInterceptor)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(REMOVE_SPACES_REGEX)
    private readonly removeSpacesRegex: RemoveSpacesRegex,
  ) {}
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @UrlParam() url: string,
  ): Promise<MessageEntity[]> {
    console.log(url);
    console.log(this.removeSpacesRegex.execute('Remove os espacos'));
    return this.messagesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
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
