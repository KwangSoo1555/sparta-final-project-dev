import { Module } from '@nestjs/common';
import { FindAccountController } from './find-account.controller';
import { FindAccountService } from './find-account.service';

@Module({
  controllers: [FindAccountController],
  providers: [FindAccountService]
})
export class FindAccountModule {}
