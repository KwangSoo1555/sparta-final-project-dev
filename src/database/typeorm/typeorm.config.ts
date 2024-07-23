import { Injectable } from "@nestjs/common";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";

import { ConfigService } from "@nestjs/config";

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  private typeOrm: DataSource;

  constructor(private configService: ConfigService) {
    const options: DataSourceOptions = {
      type: "mysql", // 데이터베이스 유형
      // url: configService.get<string>("MYSQL_URI"),
      host: configService.get<string>("MYSQL_HOST"),
      port: configService.get<number>("MYSQL_PORT"),
      username: configService.get<string>("MYSQL_USER"),
      password: configService.get<string>("MYSQL_PASSWORD"),
      database: configService.get<string>("MYSQL_DBNAME"),
      synchronize: true, // 개발 환경에서는 true로 설정, 프로덕션 환경에서는 false로 설정 후 마이그레이션으로 실행
      logging: ["error", "warn"], // 로그 출력 여부
      entities: [__dirname + "/../entities/**/*.entity.{js,ts}"], // 수정된 부분
    };
    this.typeOrm = new DataSource(options);
    this.initialize();
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...this.typeOrm.options,
      entities: this.typeOrm.options.entities,
      synchronize: this.typeOrm.options.synchronize,
      autoLoadEntities: true,
    };
  }

  async initialize() {
    try {
      await this.typeOrm.initialize();
      console.log("Success MySQL data source initialized!");
    } catch (error) {
      console.error(
        "Failed MySQL data source initialization. Please check your connection string and try again.",
        error,
      );
    }
  }
}
