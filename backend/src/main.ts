import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: never reflect arbitrary origins in production.
  // Set CORS_ORIGINS as a comma-separated list of allowed origins in .env.
  // Example: CORS_ORIGINS=http://localhost:8081,exp://192.168.1.10:8081
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:8081')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({ origin: allowedOrigins, credentials: true });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const port = process.env.BACKEND_PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on http://0.0.0.0:${port}/graphql`);
}
bootstrap();
