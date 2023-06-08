import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { StatisticsRecordI } from '../entities/statistics';
import { environment } from 'src/environments/environment';

@Injectable()
export class StatisticsService {
  baseUrl: string = `${environment.serviceUrl}`;
  statistics$ = new BehaviorSubject<{
    totalElements: number;
    items: StatisticsRecordI[];
  }>({totalElements: 0, items: []});

  constructor(private http: HttpClient) {}

  getStatistics() {
    this.http
      .get<{
        totalElements: number;
        items: StatisticsRecordI[];
      }>(`${this.baseUrl}/statistics`)
      .subscribe(res => {
        this.statistics$.next(res);
      });
  }
}
