import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Payment } from './payment';
import { Client } from 'pg';
import { DbService } from './db.service';

const PAYMENT_TABLE: string = 'payment';

@Injectable()
export class AppService {
  constructor() {
    this.pg = new DbService(PAYMENT_TABLE).client;
  }

  private pg: Client;

  async createPayment(p: Payment) {
    const query = `
        INSERT INTO ${PAYMENT_TABLE} (payment_uid, status, price)
          VALUES ('${p.payment_uid}', '${p.status}', ${p.price});
        `;
    try {
      await this.pg.query(query);
      return this.getPaymentByUid(p.payment_uid);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Insert Error!');
    }
  }

  async getPaymentByUid(uid: string): Promise<Payment> {
    const query = `
        SELECT * FROM ${PAYMENT_TABLE}
        WHERE payment_uid='${uid}'
        
      `;

    const res = await this.pg.query(query);
    if (res.rows.length === 0) throw new NotFoundException('Not Found!');
    else
      return {
        ...res.rows[0],
        id: undefined,
      };
  }

  async updatePaymentStatus(uid: string, status: string) {
    const query = `
        UPDATE ${PAYMENT_TABLE} 
        SET status='${status}'
        WHERE payment_uid='${uid}';
        `;
    try {
      await this.pg.query(query);
      return this.getPaymentByUid(uid);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Insert error!');
    }
  }
}
