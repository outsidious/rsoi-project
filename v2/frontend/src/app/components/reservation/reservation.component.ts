import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotelI, ReservationI } from 'src/app/entities/hotel';
import { HotelsService } from 'src/app/services/hotels.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  @Input() reservation?: ReservationI;

  startDate?: Date;
  endDate?: Date;

  constructor(private hotelsService: HotelsService) {}

  ngOnInit(): void {
    this.startDate = new Date(this.reservation?.startDate ?? '');
    this.endDate = new Date(this.reservation?.endDate ?? '');
  }

  wasConducted(): boolean {
    if (this.reservation) return (this.endDate ?? new Date()) < new Date();
    else return false;
  }

  cancelReserve() {
    this.hotelsService
      .cancelReserve(this.reservation!.reservationUid)
      .subscribe(() => {
        this.reservation!.status = 'CANCELED';
      });
  }
}
