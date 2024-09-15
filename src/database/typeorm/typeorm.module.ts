<<<<<<< HEAD
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule as NestTypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./typeorm.config";

@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  exports: [NestTypeOrmModule],
})
export class TypeOrmModule {}
=======
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule as NestTypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./typeorm.config";

@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  exports: [NestTypeOrmModule],
})
export class TypeOrmModule {}
>>>>>>> a79eb53a78d8df92a45067b66b6d3f4ae2ab1a5d
