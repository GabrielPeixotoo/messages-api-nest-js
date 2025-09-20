import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import pipesConfig from './app/config/pipes.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  pipesConfig(app)
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
