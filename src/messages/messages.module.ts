import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { EmailModule } from 'src/email/email_module';
import { UsersModule } from 'src/users/users.module';
import { MessageEntity } from './entities/message.entity';
import { MessageReceiverEntity } from './entities/message.receiver.entity';
import { REMOVE_SPACES_REGEX } from './messages.constants';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, MessageReceiverEntity]),
    UsersModule,
    EmailModule,
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    {
      provide: REMOVE_SPACES_REGEX,
      useFactory: () => new RemoveSpacesRegex(),
    },
  ],
})
export class MessagesModule { }
