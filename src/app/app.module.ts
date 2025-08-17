import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';

import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolve } from 'path';
import { AuthModule } from 'src/auth/auth.module';
import { IsAdminGuard } from 'src/common/guards/is.admin.guard';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';
import appConfig from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
      load: [appConfig],
      validationSchema: Joi.object({
        DATABASE_TYPE: Joi.required(),
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.required(),
        DATABASE: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_AUTOLOAD_ENTITIES: Joi.required(),
        DATABASE_SYNCHRONIZE: Joi.required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const typeOrmConfig = configService.get(
          'database',
        ) as TypeOrmModuleOptions;
        return {
          ...typeOrmConfig,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(process.cwd(), 'pictures'),
      serveRoot: '/pictures',
    }),
    MessagesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: IsAdminGuard,
    },
  ],
})
export class AppModule {}
