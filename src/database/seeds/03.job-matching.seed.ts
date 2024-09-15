import { faker, Faker, ko } from "@faker-js/faker";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { JobsEntity } from "../../entities/jobs.entity";
import { JobsMatchingEntity } from "../../entities/jobs-matching.entity";
import { UsersEntity } from "../../entities/users.entity";

export class JobMatchingSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const jobMatchingRepository = dataSource.getRepository(JobsMatchingEntity);
    const jobsRepository = dataSource.getRepository(JobsEntity);
    const usersRepository = dataSource.getRepository(UsersEntity);

    const koreanFaker = new Faker({ locale: [ko] });

    const users = await usersRepository.find({ select: ['id'] });
    const jobs = await jobsRepository.find({ select: ['id', 'ownerId'] });

    const jobMatchings: JobsMatchingEntity[] = [];
    const matchingCount = koreanFaker.number.int({ min: 50, max: 100 });

    for (let i = 0; i < matchingCount; i++) {
      const job = koreanFaker.helpers.arrayElement(jobs);
      const user = koreanFaker.helpers.arrayElement(users);

      const jobMatching = new JobsMatchingEntity();
      jobMatching.jobId = job.id;
      jobMatching.customerId = user.id
      jobMatching.matchedYn = false
      jobMatching.rejectedYn = false
      jobMatching.createdAt = koreanFaker.date.past();

      jobMatchings.push(jobMatching);
    }

    await jobMatchingRepository.save(jobMatchings);
  }
}
