import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import pipesConfig from './app/config/pipes.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  pipesConfig(app)

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
    app.enableCors({
      origin: process.env.CORS_ORIGIN || 'https://example.com'
    })
  }


  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Messages API').setDescription('Send messages to others with multiple receivers')
    .setVersion('1.0')
    .addBearerAuth()
    .build();


  const document = SwaggerModule.createDocument(app, documentBuilderConfig);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.APP_PORT ?? 3000);
}
void bootstrap();
