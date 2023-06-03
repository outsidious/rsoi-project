import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'pg';
import { Hotel } from './reservation';
import { DbService } from './db.service';

const HOTELS_TABLE: string = 'hotels';

@Injectable()
export class HotelsService {
  constructor() {
    this.pg = new DbService(HOTELS_TABLE).client;
  }

  private pg: Client;

  public hotelToHotelDTO(h: Hotel) {
    return {
      ...h,
      hotelUid: h.hotel_uid,
    };
  }

  async getHotelsCount() {
    const query = `SELECT COUNT(*) FROM ${HOTELS_TABLE};`;
    const res = await this.pg.query(query);
    return res.rows.count;
  }

  async getAllHotels(
    page: number = 1,
    size: number | 'all' = 'all',
  ): Promise<Hotel[]> {
    const query = `
        SELECT * FROM ${HOTELS_TABLE}
        LIMIT ${size} OFFSET ${size == 'all' ? 0 : size * (page - 1)};
      `;

    const res = await this.pg.query(query);
    return res.rows;
  }

  async getHotelByUid(uid: string): Promise<Hotel> {
    const query = `
        SELECT * FROM ${HOTELS_TABLE}
        WHERE hotel_uid='${uid}'
        LIMIT 1;
      `;

    const res = await this.pg.query(query);
    if (res.rows.length === 0) throw new Error('Not Found!');
    else return res.rows[0];
  }

  async getHotelById(id: number) {
    const query = `
        SELECT * FROM ${HOTELS_TABLE}
        WHERE id=${id}
        LIMIT 1;
      `;

    const res = await this.pg.query(query);
    if (res.rows.length === 0) throw new Error('Not Found!');
    else return res.rows[0];
  }
}
