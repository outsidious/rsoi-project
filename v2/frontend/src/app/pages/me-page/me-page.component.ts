import { Component, OnInit } from '@angular/core';
import { HotelsService } from 'src/app/services/hotels.service';

@Component({
  selector: 'app-me-page',
  templateUrl: './me-page.component.html',
  styleUrls: ['./me-page.component.scss'],
})
export class MePageComponent implements OnInit {
  constructor(private hotelsService: HotelsService) {}

  ngOnInit(): void {
    this.hotelsService.getAllReserves().subscribe(console.log);
  }
}
