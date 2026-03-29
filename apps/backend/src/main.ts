import { NestFactory } from '@nestjs/core'; // core utility that creates your application instance.
import { AppModule } from './app.module'; // This is the "root" module of your app. It’s the starting block that connects all your controllers, services, and other modules.
import { ValidationPipe } from '@nestjs/common'; // A built-in NestJS tool that automatically validates incoming requests (like the body in your signup method) using decorators or schemas.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // If a user sends an invalid email or forgets a password field in your signup method,
  // this pipe will catch it and return a 400 Bad Request error before the request even
  // hits your service. It keeps your database safe from "trash" data.
  app.useGlobalPipes(new ValidationPipe()); // For every single request that comes into this API,
  // run it through the ValidationPipe first

  app.enableCors({
    origin: true, // ✅ allow all origins
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap(); // process of initializing the application
