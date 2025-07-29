import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayloadDto } from '../dto/token-payload.dto';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../hashing/auth.constants';

export const TokenPayloadParam = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const http = context.switchToHttp();
    const request: Request = http.getRequest<Request>();
    return request[REQUEST_TOKEN_PAYLOAD_KEY] as TokenPayloadDto;
  },
);
