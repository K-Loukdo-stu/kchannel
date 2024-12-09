import { NestFactory } from '@nestjs/core';
import { AuthParserInterceptor, directiveAdapterParserMiddleware } from '@htkradass/nestcommon';
import { AppModule } from './app.module';
import { RedisService } from './redis/redis.service';

const isProd = process.env.NODE_DEV !== 'development'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisService = app.get(RedisService);
  app.use(directiveAdapterParserMiddleware(redisService))
  app.useGlobalInterceptors(new AuthParserInterceptor(redisService));

  app.enableCors({
    origin: isProd ? process.env.BASE_URL : process.env.DEV_BASE_URL,
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port).then(() => { 
    console.log(`Server is running on http://127.0.0.1:${port}`);
  });
}
bootstrap();
