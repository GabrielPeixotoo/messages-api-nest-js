import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';

export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();
    response.setHeader('X-Custom-Header', 'o valor do cabeçalho');
    return next.handle();
  }
}
