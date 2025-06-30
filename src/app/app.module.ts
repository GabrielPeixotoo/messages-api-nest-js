import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomHttpExceptionFilter } from 'src/common/filters/custom.http.exception.filter';
import { IsAdminGuard } from 'src/common/guards/is.admin.guard';
import { SimpleMiddleware } from 'src/common/middlewares/simple-middleware';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'postgres',
      password: '123456',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MessagesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomHttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: IsAdminGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware).forRoutes({
      path: 'messages',
      method: RequestMethod.ALL,
    });
  }
}
