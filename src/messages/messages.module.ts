import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlyLowercaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { UsersModule } from 'src/users/users.module';
import { MessageEntity } from './entities/message.entity';
import { MessageReceiverEntity } from './entities/message.receiver.entity';
import {
  ONLY_LOWERCASE_REGEX,
  REMOVE_SPACES_REGEX,
  SERVER_NAME,
} from './messages.constants';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, MessageReceiverEntity]),
    UsersModule,
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    { provide: SERVER_NAME, useValue: 'token' },
    {
      provide: REMOVE_SPACES_REGEX,
      useClass: RemoveSpacesRegex,
    },
    {
      provide: ONLY_LOWERCASE_REGEX,
      useClass: OnlyLowercaseLettersRegex,
    },
  ],
})
export class MessagesModule {}
