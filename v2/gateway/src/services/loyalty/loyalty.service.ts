import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map, Observable, of } from 'rxjs';
import { Loyalty } from 'src/models/loyalty';

@Injectable()
export class LoyaltyService {
  constructor(private readonly http: HttpService) {}

  private host = 'http://loyalty-service:8050';

  public getLoyalty(username): Observable<Loyalty> {
    const url = this.host + '/loyalty';
    return this.http
      .get<Loyalty>(url, {
        headers: {
          'X-User-Name': username,
        },
      })
      .pipe(
        map((res: any) => {
          return res.data;
        }),
        catchError((e) => of(null)),
      );
  }

  public createLoyalty(username) {
    const url = this.host + '/loyalty';
    return this.http
      .post<Loyalty>(
        url,
        {},
        {
          headers: {
            'X-User-Name': username,
          },
        },
      )
      .pipe(map((res: any) => res.data));
  }

  public updateLoyaltyCount(username: string, type: 'inc' | 'dec') {
    const url = this.host + '/loyalty';
    return this.http
      .patch<Loyalty>(
        url,
        {
          type,
        },
        {
          headers: {
            'X-User-Name': username,
          },
        },
      )
      .pipe(map((res: any) => res.data));
  }
}
