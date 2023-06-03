import { Injectable, Logger } from '@nestjs/common';
import { Reservation } from './reservation';
import { DbService } from './db.service';
import { Client } from 'pg';

const RESERVVATION_TABLE: string = 'reservation';

@Injectable()
export class AppService {
  constructor() {
    this.pg = new DbService(RESERVVATION_TABLE).client;
  }

  private pg: Client;

  async getUserReservations(username: string): Promise<Reservation[]> {
    const query = `
        SELECT * FROM ${RESERVVATION_TABLE}
        WHERE username='${username}';
      `;

    const res = await this.pg.query(query);
    return res.rows;
  }

  async getReservationById(uid: string): Promise<Reservation> {
    const query = `
        SELECT * FROM ${RESERVVATION_TABLE}
        WHERE reservation_uid='${uid}'
        LIMIT 1;
      `;

    const res = await this.pg.query(query);
    if (res.rows.length === 0) throw new Error('Not Found!');
    else return res.rows[0];
  }

  async createReservation(r: Reservation) {
    Logger.log(JSON.stringify(r));
    const query = `
        INSERT INTO ${RESERVVATION_TABLE} (reservation_uid, username, payment_uid, hotel_id, status, start_date, end_data)
          VALUES ('${r.reservation_uid}', '${r.username}', '${r.payment_uid}', ${r.hotel_id}, '${r.status}',timestamp '${r.start_date}',timestamp '${r.end_data}');
        `;
    try {
      const result = await this.pg.query(query);
      return this.getReservationById(r.reservation_uid);
    } catch (error) {
      console.log(error);
      throw new Error('Insert error!');
    }
  }

  async deleteReservation(uid: string) {
    const query = `
        DELETE FROM ${RESERVVATION_TABLE} 
        WHERE reservation_uid='${uid}';
        `;
    try {
      await this.pg.query(query);
    } catch (error) {
      console.log(error);
      throw new Error('Insert error!');
    }
  }

  async updateReservationStatus(uid: string, status: string) {
    const query = `
        UPDATE ${RESERVVATION_TABLE} 
        SET status='${status}'
        WHERE reservation_uid='${uid}';
        `;
    try {
      await this.pg.query(query);
      return this.getReservationById(uid);
    } catch (error) {
      console.log(error);
      throw new Error('Update error');
    }
  }
}
