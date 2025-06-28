import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class TimingConnectionInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const finalTime = Date.now();
        const elapsedTime = finalTime - startTime;

        console.log(
          `TimingConnectionInterceptor elapsed time ${elapsedTime}ms`,
        );
      }),
    );
  }
}
