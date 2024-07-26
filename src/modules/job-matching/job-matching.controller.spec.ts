import { Test, TestingModule } from '@nestjs/testing';
import { JobMatchingController } from './job-matching.controller';
import { JobMatchingService } from './job-matching.service';

describe('JobMatchingController', () => {
  let controller: JobMatchingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobMatchingController],
      providers: [JobMatchingService],
    }).compile();

    controller = module.get<JobMatchingController>(JobMatchingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
