import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";;

export class NotifactonSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
  }
}