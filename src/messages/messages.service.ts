import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  findAll(): string {
    return 'retorna tudo';
  }

  findOne(id: number): string {
    return `retorna tudo ${id}`;
  }

  create(message: any): any {
    return message;
  }
}
