import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        console.error(error);
        if (error instanceof NotFoundException) {
          return throwError(() => new BadRequestException(error.message));
        }

        return throwError(() => {
          if (error instanceof Error) return error;
          return new Error('Unexpected error');
        });
      }),
    );
  }
}
