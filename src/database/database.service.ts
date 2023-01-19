import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async close() {
    await this.dataSource.destroy();
  }

  async cleanTables() {
    const entities = this.dataSource.entityMetadatas;
    const queryPromises: Promise<any>[] = [];

    for (const entity of entities) {
      queryPromises.push(
        this.dataSource.query(`TRUNCATE TABLE ${entity.tableName};`),
      );
    }

    await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await Promise.all(queryPromises);
  }
}
