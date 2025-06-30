import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class CustomHttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const exceptionResponse = exception.getResponse();
    const error =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : exceptionResponse;

    const statusCode = exception.getStatus();

    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    response.status(statusCode).json({
      ...error,
      date: new Date().toISOString(),
      path: request.url,
    });
  }
}
