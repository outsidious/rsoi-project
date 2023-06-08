import { Component, OnInit } from '@angular/core';
import { debounceTime, take } from 'rxjs';
import { ReservationI } from 'src/app/entities/hotel';
import { StatisticsRecordI } from 'src/app/entities/statistics';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss'],
})
export class StatisticsPageComponent implements OnInit {
  loading: boolean = true;
  stat: StatisticsRecordI[] = [];
  displayedColumns: string[] = ['id', 'timestamp', 'user', 'action'];
  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.statisticsService.statistics$
      .pipe(debounceTime(1000), take(2))
      .subscribe((_stat) => {
        this.loading = false;
        console.log('статистика:', _stat);
        if (_stat && _stat.totalElements > 0) {
          this.stat = _stat.items.sort((a, b) => {
            return (
              Number(new Date(a.timestamp)) - Number(new Date(b.timestamp))
            );
          });
        }
      });
    this.statisticsService.getStatistics();
  }
}
