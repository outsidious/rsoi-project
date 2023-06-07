import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Client } from 'pg';
import { StatisticsRecord } from './statistics';
import { DbService } from './db.service';

const STATISTICS_TABLE: string = 'statistics';

@Injectable()
export class StatisticsService {
  constructor() {
    this.pg = new DbService(STATISTICS_TABLE).client;
  }

  private pg: Client;

  async getAllRecords(): Promise<StatisticsRecord[]> {
    const query = `
        SELECT * FROM ${STATISTICS_TABLE};
      `;
    const res = await this.pg.query(query);
    console.log(res);
    return res.rows;
  }

  async getRecordById(id: number) {
    const query = `
        SELECT * FROM ${STATISTICS_TABLE}
        WHERE id=${id}
        LIMIT 1;
      `;

    const res = await this.pg.query(query);
    if (res.rows.length === 0) throw new Error('Not Found!');
    else return res.rows[0];
  }

  async createRecord(p: StatisticsRecord) {
    const query = `
        INSERT INTO ${STATISTICS_TABLE} (timestamp, username, action)
          VALUES ('${p.timestamp}', '${p.username}', ${p.action});
        `;
    try {
      await this.pg.query(query);
      return 'ok';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Insert Error!');
    }
  }
}
