import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportsEntity } from 'src/entities/reports.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportsEntity, UsersEntity])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
