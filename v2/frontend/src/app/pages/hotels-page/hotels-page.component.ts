import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private hotelsService: HotelsService) {}

  ngOnInit(): void {
    this.hotelsService.getAllHotels().subscribe((_hotels: HotelI[]) => {
      console.log('отели:', _hotels);
      if (_hotels) {
        this.hotels = [..._hotels];
      }
    });
  }
}
