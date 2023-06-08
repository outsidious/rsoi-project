import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map, Observable, of } from 'rxjs';
import { Loyalty } from 'src/models/loyalty';
import { StatisticsRecord } from 'src/models/statistics';

@Injectable()
export class StatisticsService {
  constructor(private readonly http: HttpService) {}

  private host = 'http://statistics-service:8040';

  public getStatistics(username): Observable<StatisticsRecord[]> {
    const url = this.host + '/statistics';
    return this.http
      .get<StatisticsRecord[]>(url, {
        headers: {
          'X-User-Name': username,
        },
      })
      .pipe(
        map((res: any) => {
          console.log('statistics-service in gateway', res);
          return res.data;
        }),
        catchError((e) => of(null)),
      );
  }

  public createStatistics(action, username, timestamp) {
    const url = this.host + '/statistics';
    return this.http
      .post<StatisticsRecord>(
        url,
        {action, timestamp, username},
        {
          headers: {
            'X-User-Name': username,
          },
        },
      )
      .pipe(map((res: any) => res.data));
  }
}
