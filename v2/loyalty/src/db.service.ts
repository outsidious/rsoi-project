import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class DbService {
  constructor(name: string) {
    this.init();
  }

  public client: Client;

  private async init() {
    const user = 'postgres';
    const database = 'postgres';
    const password = 'postgres';
    const host = 'postgres';
    const port = 5432;

    this.client = new Client({
      user,
      database,
      password,
      host,
      port,
      client_encoding: 'WIN1251',
      ssl: false,
    });
    this.client.connect((err) => {
      if (err) {
        console.log('Connection error');
        throw err;
      } else console.log('Connected');
    });
  }
}
