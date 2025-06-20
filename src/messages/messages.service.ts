import { Injectable } from '@nestjs/common';

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

@Injectable()
export class MessagesService {
  findAll(pagination: PaginationParams): string {
    const { limit = 10, offset = 0 } = pagination;
    return `Retorna com paginacao, limit = ${limit}, offset = ${offset}`;
  }

  findOne(id: number): string {
    return `retorna tudo ${id}`;
  }

  create(message: object): object {
    return message;
  }

  update(id: number, body: object): object {
    return {
      id,
      ...body,
    };
  }

  delete(id: number): string {
    return `Apagado ${id}`;
  }
}
