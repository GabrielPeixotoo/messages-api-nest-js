import { IsEmail } from 'class-validator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';
import { MessageEntity } from 'src/messages/entities/message.entity';
import { MessageReceiverEntity } from 'src/messages/entities/message.receiver.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  passwordHash: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  //Uma pessoa pode enviar muitos recados como "from" na  MessageEntity
  @OneToMany(() => MessageEntity, (message) => message.from)
  sentMessages: MessageEntity[];

  @OneToMany(() => MessageReceiverEntity, (message) => message.receiver)
  receivedMessages: MessageReceiverEntity[];

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'simple-array', default: [] })
  routePolicies: RoutePolicies[];
}
