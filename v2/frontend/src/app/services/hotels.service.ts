import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { HotelI, ReservationI } from '../entities/hotel';

@Injectable()
export class HotelsService {
  baseUrl: string = `${environment.serviceUrl}`;
  hotels$ = new BehaviorSubject<HotelI[]>([]);
  reservations$ = new BehaviorSubject<ReservationI[]>([]);

  constructor(private http: HttpClient) {}

  getAllHotels() {
    this.http
      .get<{
        page: number;
        pageSize: number;
        totalElements: number;
        items: HotelI[];
      }>(`${this.baseUrl}/hotels?page=1&size=100`)
      .pipe(map((res) => res.items ?? []))
      .subscribe((items: HotelI[]) => {
        this.hotels$.next(items);
      });
  }

  reserve(hotelUid: number, from: string, to: string) {
    return this.http.post(`${this.baseUrl}/reservations`, {
      hotelUid,
      startDate: from.slice(0, 10),
      endDate: to.slice(0, 10),
    });
  }

  cancelReserve(reserveUid: string) {
    return this.http.delete(`${this.baseUrl}/reservations/${reserveUid}`);
  }

  getAllReserves() {
    this.http.get(`${this.baseUrl}/reservations`).subscribe((reservations) => {
      this.reservations$.next(reservations as ReservationI[]);
    });
  }

  /*createMeetup(
    name: string,
    description: string,
    time: Date
  ): Observable<Meetup> {
    return this.http.post<Meetup>(`${this.baseUrl}/meetup`, {
      name,
      description,
      time,
    });
  }

  subscribeMeetup(idMeetup: number, idUser: number): Observable<Meetup> {
    return this.http.put<Meetup>(`${this.baseUrl}/meetup`, {
      idMeetup,
      idUser,
    });
  }

  unsubscribeMeetup(idMeetup: number, idUser: number): Observable<Meetup> {
    return this.http.delete<Meetup>(`${this.baseUrl}/meetup`, {
      body: {
        idMeetup,
        idUser,
      },
    });
  }

  editMeetup(id: number, meetup: Meetup): Observable<Meetup> {
    return this.http.put<Meetup>(`${this.baseUrl}/meetup/${id}`, meetup);
  }

  deleteMeetup(id: number): Observable<any> {
    console.log(`${this.baseUrl}/meetup/${id}`);
    return this.http.delete(`${this.baseUrl}/meetup/${id}`);
  }*/
}
