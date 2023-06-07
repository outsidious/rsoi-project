import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotelI } from 'src/app/entities/hotel';
import { HotelsService } from 'src/app/services/hotels.service';
import * as moment from 'moment';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss'],
})
export class HotelComponent implements OnInit {
  @Input() hotel?: HotelI;
  @Input() createdByCurrentUser: boolean = false;
  @Input() currentUserId: number | undefined;
  @Input() subscribed: boolean = false;

  full: boolean = false;
  stars: number[] = [];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private hotelsService: HotelsService) {}

  ngOnInit(): void {
    if (this.hotel?.stars) {
      this.stars = Array(this.hotel.stars).fill(0);
    }
  }

  switchCard() {
    this.full = !this.full;
  }

  /*get description(): string {
    const len = environment.meetups.maxLenOfShortDescription;
    if (this.full && this.meetup) return this.meetup?.description;
    else if (
      !this.full &&
      this.meetup &&
      this.meetup.description.length > len
    ) {
      return this.meetup.description.slice(0, len) + '...';
    } else if (!this.full && this.meetup) return this.meetup.description;
    else return '';
  }*/

  reserve() {
    if (this.range.value.start && this.range.value.end) {
      const from = this.range.value.start.toISOString();
      const to = this.range.value.end.toISOString();
      this.hotelsService
        .reserve(this.hotel!.hotel_uid, from, to)
        .subscribe((res) => {
          console.log(res);
        });
    }
  }
}
