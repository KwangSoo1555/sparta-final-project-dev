import { Faker, ko } from "@faker-js/faker";
import { ReportsEntity } from "../../entities/reports.entity";
import { UsersEntity } from "../../entities/users.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { ReportReason } from "../../common/customs/types/enum-report-reason";

export class ReportSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const reportRepository = dataSource.getRepository(ReportsEntity);
    const userRepository = dataSource.getRepository(UsersEntity);

    const koreanFaker = new Faker({ locale: [ko] });

    const users = await userRepository.find({ select: ["id"] });

    const reports: ReportsEntity[] = [];

    for (const reporter of users) {
      const reportCount = koreanFaker.number.int({ min: 0, max: 2 });

      for (let i = 0; i < reportCount; i++) {
        const reportedUser = koreanFaker.helpers.arrayElement(
          users.filter((u) => u.id !== reporter.id),
        );

        const report = new ReportsEntity();
        report.reporterId = reporter.id;
        report.reportedId = reportedUser.id;
        report.reason = koreanFaker.helpers.arrayElement(Object.values(ReportReason));
        report.description = this.getDescriptionByReason(report.reason);

        reports.push(report);
      }
    }
    await reportRepository.save(reports);
  }

  private getDescriptionByReason(reason: string) {
    const descriptions = {
      [ReportReason.OFFENSIVE]: "이 사용자가 불쾌감을 주는 행위를 했습니다.",
      [ReportReason.SPAM]: "이 사용자가 스팸 또는 도배를 했습니다.",
      [ReportReason.ABUSE]: "이 사용자가 욕설 및 비방을 했습니다.",
      [ReportReason.INAPPROPRIATE]: "이 사용자가 부적절한 콘텐츠를 게시했습니다.",
      [ReportReason.PERSONAL_INFO]: "이 사용자가 개인정보를 노출했습니다.",
      [ReportReason.COPYRIGHT]: "이 사용자가 저작권을 침해했습니다.",
      [ReportReason.OTHER]: "기타 사유로 신고되었습니다.",
    };

    return descriptions[reason] || "알 수 없는 사유로 신고되었습니다.";
  }
}
