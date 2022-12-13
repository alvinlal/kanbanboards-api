import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { COOKIE_NAME } from './auth/auth.constants';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { validationPipeConfig } from './validationPipeConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({
    origin: [
      configService.get<string>('FRONTEND_ROOT'),
      ...(configService.get<string>('ENV') === 'development' && [
        configService.get<string>('STORYBOOK_ROOT'),
      ]),
    ],
    credentials: true,
  });

  // class-validator container for dep injection on validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // swagger
  const config = new DocumentBuilder()
    .setTitle('kanbanboards-api')
    .setDescription('The kanbanboards API description')
    .setVersion('1.0')
    .addServer(configService.get<string>('ROOT'))
    .addCookieAuth(
      COOKIE_NAME,
      {
        type: 'apiKey',
        in: 'Cookie',
        scheme: 'apiKey',
        name: COOKIE_NAME,
      },
      COOKIE_NAME,
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  // middlewares
  app.use(cookieParser());
  app.use(function (req, res, next) {
    res.header('x-powered-by', 'Blood, sweat, and tears.');
    next();
  });

  // class-validator
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

  await app.listen(9000);
}
bootstrap();
