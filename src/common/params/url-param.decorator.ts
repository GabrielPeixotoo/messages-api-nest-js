import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UrlParam = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    return request.url;
  },
);
