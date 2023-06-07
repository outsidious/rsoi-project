import { Component, OnInit } from '@angular/core';
import { debounceTime, take } from 'rxjs';
import { ReservationI } from 'src/app/entities/hotel';
import { HotelsService } from 'src/app/services/hotels.service';

@Component({
  selector: 'app-me-page',
  templateUrl: './me-page.component.html',
  styleUrls: ['./me-page.component.scss'],
})
export class MePageComponent implements OnInit {
  loading: boolean = true;
  reservations: ReservationI[] = [];
  constructor(private hotelsService: HotelsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.hotelsService.reservations$
      .pipe(debounceTime(1000), take(2))
      .subscribe((_reservations: ReservationI[]) => {
        this.loading = false;
        console.log('бронирования:', _reservations);
        if (_reservations) {
          this.reservations = [..._reservations].sort((a, b) => {
            return (
              Number(new Date(a.startDate)) - Number(new Date(b.startDate))
            );
          });
        }
      });
    this.hotelsService.getAllReserves();
  }
}
