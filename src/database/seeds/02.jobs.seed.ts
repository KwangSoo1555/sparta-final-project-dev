import { faker, Faker, ko } from "@faker-js/faker";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { JobsEntity } from "../../entities/jobs.entity"; 
import { UsersEntity } from "../../entities/users.entity";

export class JobsSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const jobsRepository = dataSource.getRepository(JobsEntity);
    const usersRepository = dataSource.getRepository(UsersEntity);

    const koreanFaker = new Faker({ locale: [ko] });

    const users = await usersRepository.find({ select: ['id'] });

    const jobs: JobsEntity[] = [];
    const jobCount = koreanFaker.number.int({ min: 50, max: 100 });

    for (let i = 0; i < jobCount; i++) {
      const user = koreanFaker.helpers.arrayElement(users);
      const job = new JobsEntity();
      job.ownerId = user.id;
      job.title = koreanFaker.lorem.sentence(1);
      job.content = koreanFaker.lorem.paragraphs(1);
      job.photoUrl = faker.image.url();
      job.price = koreanFaker.number.int({ min: 10000, max: 50000 });
      job.address = faker.address.streetAddress();
      job.category = koreanFaker.lorem.word();
      job.expiredYn = koreanFaker.datatype.boolean();
      job.matchedYn = koreanFaker.datatype.boolean();
      job.createdAt = koreanFaker.date.past();
      job.updatedAt = koreanFaker.date.recent();
      job.deletedAt = null;

      jobs.push(job);
    }

    await jobsRepository.save(jobs);
  }
}
