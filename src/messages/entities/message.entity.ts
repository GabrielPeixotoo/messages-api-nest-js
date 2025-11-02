import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageDto } from '../dto/message.dto';
import { MessageReceiverEntity } from './message.receiver.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  text: string;

  //Muitos recados podem ser enviados por uma pessoa.
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  // Especifica a coluna 'de' que armazena o id da pessoa que enviou o recado.
  @JoinColumn({ name: 'from' })
  from: UserEntity;

  @OneToMany(() => MessageReceiverEntity, (receiver) => receiver.message, {
    cascade: true,
  })
  receivers: MessageReceiverEntity[];

  @Column()
  date: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  static toDto(message: MessageEntity): MessageDto {
    return {
      id: message.id,
      text: message.text,
      fromId: message.from?.id,
      receiverIds: message.receivers?.map((r) => r.id) || [],
      date: message.date,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
