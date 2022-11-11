import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors({
    origin: configService.get<string>('FRONTEND_ROOT'),
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('kanbanboards-api')
    .setDescription('The kanbanboards API description')
    .setVersion('1.0')
    .addServer(configService.get<string>('ROOT'))
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  app.use(cookieParser());

  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Origin',
      configService.get<string>('FRONTEND_ROOT'),
    );
    res.header('x-powered-by', 'Blood, sweat, and tears.');
    next();
  });

  await app.listen(9000);
}
bootstrap();
