import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Client } from 'pg';
import { Loyalty } from './loyalty';
import { DbService } from './db.service';

@Injectable()
export class AppService {
  constructor() {
    var types = require('pg').types;
    types.setTypeParser(1700, 'text', parseFloat);
    types.setTypeParser(20, Number);
    this.pg = new DbService('loyalty').client;
  }

  private pg: Client;

  async getLoyaltyByUser(username: string): Promise<Loyalty> {
    const query = `
        SELECT * FROM loyalty
        WHERE username='${username}'
        LIMIT 1;
      `;

    const res = await this.pg.query(query);
    if (res.rows.length === 0) throw new NotFoundException('Not Found!');
    else return res.rows[0];
  }

  private getStatus(count: number) {
    if (count > 20) {
      return 'GOLD';
    } else if (count > 10) {
      return 'SILVER';
    } else {
      return 'BRONZE';
    }
  }

  async updateLoyaltyCounter(username: string, type: 'inc' | 'dec') {
    const loyalty = await this.getLoyaltyByUser(username);
    const count =
      type === 'inc'
        ? loyalty.reservation_count + 1
        : loyalty.reservation_count - 1;
    const status = this.getStatus(count);
    const query = `
            UPDATE loyalty
            SET reservation_count=${count}, status='${status}' 
            WHERE username='${username}';
        `;

    try {
      await this.pg.query(query);
      return this.getLoyaltyByUser(username);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Update error');
    }
  }

  public async createLoyalty(username: string) {
    const query = `
        INSERT INTO loyalty (username, reservation_count, status, discount)
        VALUES ('${username}', 0, 'BRONZE', 0);
      `;
    try {
      await this.pg.query(query);
      return this.getLoyaltyByUser(username);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Insert error');
    }
  }
}
