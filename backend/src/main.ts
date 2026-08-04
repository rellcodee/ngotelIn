import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Aktifkan pembacaan HTTP-Only Cookies
  app.use(cookieParser());

  // 2. Aktifkan CORS (Agar Frontend Next.js di port lain tidak ditolak)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Sesuaikan URL frontend
    credentials: true,
  });

  // 3. Validasi Global Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
