import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthTokenInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = String(request.headers['authorization']);
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }
    return next.handle();
  }
}
