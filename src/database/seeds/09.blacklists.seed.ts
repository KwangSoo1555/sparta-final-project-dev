import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { faker } from "@faker-js/faker";
import { UsersEntity } from "../../entities/users.entity";
import { BlacklistsEntity } from "../../entities/blacklists.entity";

export class BlackListSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(UsersEntity);
    const blackListRepo = dataSource.getRepository(BlacklistsEntity);

    const users = await userRepo.find({ select: ['id'] });
    const blacklists: BlacklistsEntity[] = [];

    for (const user of users) {
      const blacklistCount = faker.number.int({ min: 0, max: 2 });
      const blackedUsers = faker.helpers.arrayElements(
        users.filter(u => u.id !== user.id),
        blacklistCount
      );

      blacklists.push(...blackedUsers.map(blackedUser => 
        blackListRepo.create({
          userId: user.id,
          blackedId: blackedUser.id
        })
      ));
    }

    await blackListRepo.save(blacklists);
  }
}