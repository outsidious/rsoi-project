import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { LoyaltyService } from './services/loyalty/loyalty.service';
import { PaymentService } from './services/payment/payment.service';
import { ReservationsService } from './services/reservations/reservations.service';
import * as moment from 'moment';
import { v4 as uuid4 } from 'uuid';
import { Payment } from './models/payment';
import { Reservation } from './models/reservation';
import { Request } from 'express';
import { map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { StatisticsService } from './services/statistics/statistics.service';

@Controller('api/v1')
export class AppController {
  constructor(
    private loaltyService: LoyaltyService,
    private paymentService: PaymentService,
    private reservationService: ReservationsService,
    private statisticsService: StatisticsService,
    private readonly http: HttpService
  ) {}

  parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }

  @Get('/manage/health')
  async getHealth() {
    return '';
  }

  @Get('/statistics')
  async getStatistics(
    @Headers() headers,
  ) {
    if (!headers.authorization) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }
    const user = this.parseJwt(headers.authorization);
    const username: string = user.name;
    return this.statisticsService
      .getStatistics(username)
      .pipe(
        map((data: any) => {
          return { items: [...data], totalElements: data?.length ?? 0 };
        }),
      )
      .toPromise();
  }


  @Get('/hotels')
  async getHotels(
    @Headers() headers,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    if (!headers.authorization) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }
    const user = this.parseJwt(headers.authorization);
    const username: string = user.name;
    this.statisticsService.createStatistics('Get hotels', username, (new Date()).toISOString());
    return this.reservationService
      .getHotels(page, size)
      .pipe(
        map((data: any) => {
          return { ...data, totalElements: data.items.length };
        }),
      )
      .toPromise();
  }

  private async getAllReservations(username) {
    const reservations = await this.reservationService
      .getUserReservations(username)
      .toPromise();
    const items = [];
    for (const r of reservations) {
      const p = await this.paymentService
        .getPayment(username, r.paymentUid)
        .toPromise();
      items.push({
        ...r,
        startDate: moment(new Date(r.startDate)).format('YYYY-MM-DD'),
        endDate: moment(new Date(r.endDate)).format('YYYY-MM-DD'),
        paymentUid: undefined,
        payment: {
          status: p.status,
          price: p.price,
        },
      });
    }
    return items;
  }

  @Get('/reservations')
  async getReservations(@Headers() headers, @Req() request: Request) {
    if (!headers.authorization) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }
    const user = this.parseJwt(headers.authorization);
    const username: string = user.name;
    //console.log(user, username);
    if (!username) throw new BadRequestException('user-name');
    this.statisticsService.createStatistics('Get reservations', username, (new Date()).toISOString());
    return this.getAllReservations(username);
  }

  @Post('/reservations/')
  @HttpCode(200)
  async createReservation(
    @Headers() headers,
    @Req() request: Request,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
    @Body('hotelUid') hotelUid: string,
  ) {
    if (!headers.authorization) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }
    const user = this.parseJwt(headers.authorization);
    const username: string = user.name;
    if (!username) throw new BadRequestException('user-name');
    this.statisticsService.createStatistics('Post reservation', username, (new Date()).toISOString());
    const hotel = await this.reservationService.getHotel(hotelUid).toPromise();
    const date1 = moment(startDate);
    const date2 = moment(endDate);
    const days = date2.diff(date1, 'days');
    const pay = hotel.price * days;
    let loyalty = await this.loaltyService.getLoyalty(username).toPromise();
    if (!loyalty) {
      loyalty = await this.loaltyService.createLoyalty(username).toPromise();
    }
    let sale = 0;
    if (loyalty.status === 'BRONZE') {
      sale = 5;
    } else if (loyalty.status === 'SILVER') {
      sale = 7;
    } else if (loyalty.status === 'GOLD') {
      sale = 10;
    }
    const resultPay = (pay * (100 - sale)) / 100;

    const payment = {
      payment_uid: uuid4(),
      status: 'PAID',
      price: resultPay,
    } as Payment;
    this.statisticsService.createStatistics('Post payment', username, (new Date()).toISOString());
    const p = await this.paymentService
      .createPayment(username, payment)
      .toPromise();
    const l2 = await this.loaltyService
      .updateLoyaltyCount(username, 'inc')
      .toPromise();

    const reservation = {
      reservation_uid: uuid4(),
      hotel_id: hotelUid,
      payment_uid: payment.payment_uid,
      status: 'PAID',
      start_date: startDate,
      end_data: endDate,
      username,
    } as Reservation;
    const r = await this.reservationService
      .createReservation(username, reservation)
      .toPromise();
    return {
      ...r,
      startDate: moment(new Date(r.startDate)).format('YYYY-MM-DD'),
      endDate: moment(new Date(r.endDate)).format('YYYY-MM-DD'),
      discount: loyalty.discount,
      payment: {
        status: payment.status,
        price: payment.price,
      },
    };
  }

  @Get('/reservations/:reservationId')
  async getReservationById(
    @Headers() headers,
    @Param('reservationId') uid: string,
    @Req() request: Request,
  ) {
    if (!headers.authorization) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }
    const user = this.parseJwt(headers.authorization);
    const username: string = user.name;
    if (!username) throw new BadRequestException('user-name');
    this.statisticsService.createStatistics(`Get reservation ${uid}`, username, (new Date()).toISOString());
    const r = await this.reservationService
      .getReservation(username, uid)
      .toPromise();
      this.statisticsService.createStatistics(`Get payment ${r.paymentUid}`, username, (new Date()).toISOString());
    const p = await this.paymentService
      .getPayment(username, r.paymentUid)
      .toPromise();

    return {
      ...r,
      startDate: moment(new Date(r.startDate)).format('YYYY-MM-DD'),
      endDate: moment(new Date(r.endDate)).format('YYYY-MM-DD'),
      paymentUid: undefined,
      payment: {
        status: p.status,
        price: p.price,
      },
    };
  }

  @Delete('/reservations/:reservationId')
  @HttpCode(204)
  async deleteReservation(
    @Headers() headers,
    @Param('reservationId') uid: string,
    @Req() request: Request,
  ) {
    if (!headers.authorization) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }
    const user = this.parseJwt(headers.authorization);
    const username: string = user.name;
    if (!username) throw new BadRequestException('user-name');
    this.statisticsService.createStatistics(`Delete reservation ${uid}`, username, (new Date()).toISOString());
    const r = await this.reservationService
      .setReservationStatus(username, uid, 'CANCELED')
      .toPromise();
    this.statisticsService.createStatistics(`Cancel payment ${r.paymentUid}`, username, (new Date()).toISOString());
    const p = await this.paymentService
      .changePaymentState(username, r.paymentUid, 'CANCELED')
      .toPromise();

    const l = await this.loaltyService
      .updateLoyaltyCount(username, 'dec')
      .toPromise();
  }

  @Get('loyalty')
  async getLoyalty(@Headers() headers, @Req() request: Request) {
    if (!headers.authorization) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }
    const user = this.parseJwt(headers.authorization);
    const username: string = user.name;
    if (!username) throw new BadRequestException('user-name');
    this.statisticsService.createStatistics(`Get loyalty`, username, (new Date()).toISOString());
    const l = await this.loaltyService.getLoyalty(username).toPromise();
    return {
      ...l,
      username: undefined,
    };
  }

  @Get('/me')
  async getMe(@Headers() headers, @Req() request: Request) {
    if (!headers.authorization) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }
    const user = this.parseJwt(headers.authorization);
    const username: string = user.name;
    this.statisticsService.createStatistics(`Get user info`, username, (new Date()).toISOString());
    if (!username) throw new BadRequestException('user-name');
    const reservations = await this.getAllReservations(username);
    let loyality = await this.loaltyService.getLoyalty(username).toPromise();
    if (!loyality) {
      loyality = await this.loaltyService.createLoyalty(username).toPromise();
    }
    return {
      reservations,
      loyalty: {
        status: loyality.status,
        discount: loyality.discount,
      },
    };
  }
}
