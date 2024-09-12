import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () =>
    console.log(`Notifications Server started on port ${PORT}`),
  );
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.createApplicationContext(AppModule);
//   console.log('Notification Service is running and connected to Kafka');
// }
// bootstrap();
