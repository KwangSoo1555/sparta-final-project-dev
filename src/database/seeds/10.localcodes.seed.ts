import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { LocalCodesEntity } from "../../entities/local-codes.entity";
import * as fs from "fs";
import * as path from "path";

export class LocalCodesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const localCodesRepo = dataSource.getRepository(LocalCodesEntity);

    // JSON 파일 읽기
    const filePath = path.join(__dirname, "localcodes.json");
    const data = fs.readFileSync(filePath, "utf8");
    const localCodes = JSON.parse(data);

    // 데이터 저장을 위한 배열
    const localCodesEntities: LocalCodesEntity[] = [];

    // JSON 데이터를 엔티티로 변환
    for (const localCode of localCodes) {
      const localCodeEntity = localCodesRepo.create({
        localCode: localCode.localCode,
        city: localCode.city,
        district: localCode.district || null,
        dong: localCode.dong || null,
      });

      localCodesEntities.push(localCodeEntity);
    }

    // 한 번에 저장
    await localCodesRepo.save(localCodesEntities);

    console.log("Local codes seeding completed.");
  }
}
