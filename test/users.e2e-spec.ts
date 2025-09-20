import { INestApplication } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from 'supertest/types';

import { resolve } from 'path';
import pipesConfig from 'src/app/config/pipes.config';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';

describe('AppController (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: 'postgres',
                    password: '123456',
                    database: 'testing',
                    autoLoadEntities: true,
                    synchronize: true,
                    dropSchema: true
                }),
                ServeStaticModule.forRoot({
                    rootPath: resolve(process.cwd(), 'pictures'),
                    serveRoot: '/pictures',
                }),
                MessagesModule,
                UsersModule,
                AuthModule,
            ],
        }).compile();

        app = module.createNestApplication();
        pipesConfig(app);
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    })

    it('/ (GET)', () => {

    });
});
