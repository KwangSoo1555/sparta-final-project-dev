import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"],
  });

  const config = new DocumentBuilder()
    .setTitle("Cats example")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .addTag("cats")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.setGlobalPrefix("api/v1");
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get<number>("SERVER_PORT") || 3000;

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  try {
    await app.listen(port);
    console.log(`Server is running on: ${port}, Great to see you! 😊`);
  } catch (error) {
    console.error(error);
  }
}
bootstrap()
