import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  const PORT = process.env.PORT || 3003;
  await app.listen(PORT, () =>
    console.log(`Rider Service started on port ${PORT}`),
  );
}
bootstrap();
