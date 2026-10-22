import { NestFactory } from '@nestjs/core';
import { apiReference } from '@scalar/nestjs-api-reference';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const openApiConfig = new DocumentBuilder()
    .setTitle('Microserviço de Briefing')
    .setDescription('API para gerar briefings a partir das anotações clínicas.')
    .setVersion('1.0.0')
    .build();
  const openApiDocument = SwaggerModule.createDocument(app, openApiConfig);

  app.use('/docs', apiReference({ content: openApiDocument }));

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
