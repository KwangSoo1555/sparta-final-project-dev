import { faker, Faker, ko } from "@faker-js/faker";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { NoticesEntity } from "../../entities/notices.entity";
import { UsersEntity } from "../../entities/users.entity";
import { UserRoles } from "../../common/customs/enums/enum-user-roles"

export class NoticesSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const noticeRepository = dataSource.getRepository(NoticesEntity);
    const userRepository = dataSource.getRepository(UsersEntity);

    const koreanFaker = new Faker({ locale: [ko] });

    const adminUsers = await userRepository.find({
      where: { role: UserRoles.ADMIN },
      select: ['id']
    });

    const notices: NoticesEntity[] = [];
    const noticeCount = koreanFaker.number.int({ min: 5, max: 20 });

    for (let i = 0; i < noticeCount; i++) {
      const adminUser = koreanFaker.helpers.arrayElement(adminUsers);
      const notice = new NoticesEntity();
      notice.userId = adminUser.id;
      notice.title =  koreanFaker.lorem.sentence(1),
      notice.description = koreanFaker.lorem.paragraphs(1),
      notice.imageUrl = faker.image.url(),
      
      notices.push(notice);
    }

    await noticeRepository.save(notices);
  }
}