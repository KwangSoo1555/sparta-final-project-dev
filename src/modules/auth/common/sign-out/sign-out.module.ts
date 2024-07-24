import { Module } from '@nestjs/common';
import { UserSignOutController } from './sign-out.controller';
import { UserSignOutService } from './sign-out.service';

@Module({
  controllers: [UserSignOutController],
  providers: [UserSignOutService]
})
export class UserSignOutModule {}
