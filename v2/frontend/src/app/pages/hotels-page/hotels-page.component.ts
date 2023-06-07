import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, take, takeUntil } from 'rxjs';
import { HotelI } from 'src/app/entities/hotel';
import { AuthService } from 'src/app/services/auth.service';
import { HotelsService } from 'src/app/services/hotels.service';

@Component({
  selector: 'app-hotels-page',
  templateUrl: './hotels-page.component.html',
  styleUrls: ['./hotels-page.component.scss'],
})
export class HotelsPageComponent implements OnInit {
  hotels: HotelI[] = [];
  loading: boolean = true;

  constructor(private hotelsService: HotelsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.hotelsService.hotels$
      .pipe(debounceTime(1000), take(2))
      .subscribe((_hotels: HotelI[]) => {
        this.loading = false;
        console.log('отели:', _hotels);
        if (_hotels) {
          this.hotels = [..._hotels];
        }
      });
    this.hotelsService.getAllHotels();
  }
}
