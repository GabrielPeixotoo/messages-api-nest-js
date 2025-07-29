import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { TokenPayloadDto } from '../dto/token-payload.dto';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../hashing/auth.constants';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }

    try {
      const payload: TokenPayloadDto = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      console.log(payload);
      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Falha ao logar');
    }

    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const auhtorization = request.headers?.authorization;

    if (!auhtorization || typeof auhtorization !== 'string') {
      return;
    }

    return auhtorization.split(' ')[1];
  }
}
