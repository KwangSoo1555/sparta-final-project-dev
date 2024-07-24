import { Module } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticesEntity } from 'src/entities/notices.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoticesEntity])],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
