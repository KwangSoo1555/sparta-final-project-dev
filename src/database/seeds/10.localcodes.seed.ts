import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LocalCodesEntity } from "src/entities/local-codes.entity";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class LocalCodesSeed {
  constructor(
    @InjectRepository(LocalCodesEntity)
    private readonly localCodesRepository: Repository<LocalCodesEntity>,
  ) {}

  async seed() {
    const filePath = path.join(__dirname, "localcodes.json");
    const data = fs.readFileSync(filePath, "utf8");
    const localCodes = JSON.parse(data);

    for (const localCode of localCodes) {
      const localCodeEntity = this.localCodesRepository.create({
        localCode: localCode.localCode,
        city: localCode.city,
        district: localCode.district || null,
        dong: localCode.dong || null,
      });
      await this.localCodesRepository.save(localCodeEntity);
    }

    console.log("Local codes seeding completed.");
  }
}
