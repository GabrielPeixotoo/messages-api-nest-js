import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import pipesConfig from './app/config/pipes.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  pipesConfig(app)

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
    app.enableCors({
      origin: 'https://meuapp.com.br'
    })
  }

  await app.listen(process.env.APP_PORT ?? 3000);
}
void bootstrap();
