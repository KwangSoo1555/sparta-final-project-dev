import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlacklistService } from './blacklist.service';
import { BlacklistController } from './blacklist.controller';

import { BlacklistsEntity  } from 'src/entities/blacklists.entity'
import { UsersEntity } from 'src/entities/users.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([ BlacklistsEntity, UsersEntity ]),
  ],
  controllers: [BlacklistController],
  providers: [BlacklistService],
})
export class BlacklistModule {}
