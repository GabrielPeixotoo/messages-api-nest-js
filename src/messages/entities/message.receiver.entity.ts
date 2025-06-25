import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('message_receivers')
export class MessageReceiverEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MessageEntity, (message) => message.receivers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedMessages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  receiver: UserEntity;

  @Column({ default: false })
  isRead: boolean;
}
