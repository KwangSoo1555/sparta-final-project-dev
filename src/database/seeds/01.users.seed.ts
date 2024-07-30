import * as bcrypt from 'bcrypt';
import { faker, Faker, ko } from "@faker-js/faker";
import { UsersEntity } from "../../entities/users.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { AUTH_CONSTANT } from '../../common/constants/auth.constant';
import { UserRoles } from '../../common/customs/enums/enum-user-roles';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepository = dataSource.getRepository(UsersEntity);
    
    const koreanFaker = new Faker({ locale: [ko] });

    const hashedPassword = await bcrypt.hash('qwer1234', AUTH_CONSTANT.HASH_SALT_ROUNDS);

    const users: UsersEntity[] = [];
    for (let i = 1; i <= 100; i++) {
      const user = new UsersEntity();
      const firstName = koreanFaker.person.firstName();
      const lastName = koreanFaker.person.lastName();
      user.email = faker.internet.email();
      user.name = `${lastName}${firstName}`;
      user.password = hashedPassword;

      if (i === 1) {
        user.role = UserRoles.ADMIN;
        user.email = 'user1@example.com';
      } else {
        user.role = UserRoles.USER;
      }

      users.push(user);
    }

    await userRepository.save(users);  
  } 
}