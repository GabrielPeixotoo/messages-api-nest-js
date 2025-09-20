import { HttpStatus, INestApplication } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import pipesConfig from 'src/app/config/pipes.config';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';
import { App } from 'supertest/types';

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

    describe('/users (POST)', () => {

        it('Should create an user successfully', async () => {
            const createUserDto = {
                email: 'a@a.com',
                name: 'Gabriel Peixoto',
                password: '123456'
            };
            const response = await request(app.getHttpServer()).post('/users').send(createUserDto).expect(HttpStatus.CREATED)
            expect(response.body).toEqual(
                {

                    email: createUserDto.email,
                    passwordHash: expect.any(String),
                    name: createUserDto.name,
                    active: true,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    picture: '',
                    id: expect.any(Number),
                    routePolicies: []
                }
            )
        });
    });
});
