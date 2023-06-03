import {
  Body,
  Controller,
  Delete,
  BadRequestException,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Req,
  Patch,
  Query,
} from '@nestjs/common';
import { Reservation, Hotel } from './reservation';
import { AppService } from './app.service';
import { Request } from 'express';
import { HotelsService } from './hotels.service';

@Controller('reservations')
export class AppController {
  constructor(
    private readonly service: AppService,
    private readonly hotel: HotelsService,
  ) {}

  public reservationToDTO(r: Reservation, h: Hotel) {
    return {
      status: r.status,
      hotel: {
        hotelUid: h.hotel_uid,
        name: h.name,
        fullAddress: h.country + ', ' + h.city + ', ' + h.address,
        stars: h.stars,
      },
      reservationUid: r.reservation_uid,
      startDate: r.start_date,
      endDate: r.end_data,
      paymentUid: r.payment_uid,
    };
  }

  @Get('/manage/health')
  async getHealth() {
    return '';
  }

  @Get('/')
  async getAllUsersReservations(@Req() request: Request) {
    Logger.log(JSON.stringify(request.headers));
    const username: string = request.headers['x-user-name']?.toString();
    if (!username) throw new BadRequestException('x-user-name');
    const reservations = await this.service.getUserReservations(username);
    const items = [];
    for (const r of reservations) {
      const h = await this.hotel.getHotelById(r.hotel_id);
      items.push(this.reservationToDTO(r, h));
    }
    return items;
  }

  @Get('/:reservationUid')
  async getOneReservation(
    @Param('reservationUid') uid: string,
    @Req() request: Request,
  ) {
    const username: string = request.headers['x-user-name']?.toString();
    if (!username) throw new BadRequestException('x-user-name');
    const r = await this.service.getReservationById(uid);
    const h = await this.hotel.getHotelById(r.hotel_id);
    if (r.username === username) {
      return this.reservationToDTO(r, h);
    } else {
      throw new HttpException('Username not equal', 403);
    }
  }

  @Post('/')
  async createReservation(@Body() body: Reservation, @Req() request: Request) {
    const username: string = request.headers['x-user-name']?.toString();
    if (!username) throw new BadRequestException('x-user-name');
    if (body.username != username)
      throw new HttpException('cant create reservation for another user', 403);
    const h = await this.hotel.getHotelByUid(body.hotel_id.toString());
    if (!h) throw new BadRequestException('no hotel with this id');
    const r = await this.service.createReservation({
      ...body,
      hotel_id: h.id,
    });
    const dto = this.reservationToDTO(r, h);
    return {
      ...dto,
      hotel: undefined,
      hotelUid: body.hotel_id,
    };
  }

  @Patch('/:reservationUid')
  async updateReservation(
    @Param('reservationUid') uid: string,
    @Req() request: Request,
    @Body('status') status: string,
  ) {
    const username: string = request.headers['x-user-name']?.toString();
    if (!username) throw new BadRequestException('x-user-name');
    const r = await this.service.getReservationById(uid);
    if (r.username === username) {
      const result = await this.service.updateReservationStatus(uid, status);
      const h = await this.hotel.getHotelById(r.hotel_id);
      return this.reservationToDTO(result, h);
    } else {
      throw new HttpException('Username not equal', 403);
    }
  }

  @Delete('/:reservationUid')
  async deleteReservation(
    @Param('reservationUid') uid: string,
    @Req() request: Request,
  ) {
    const username = request.headers['X-User-Name'].toString();
    const r = await this.service.getReservationById(uid);
    if (r.username == username) {
      await this.service.deleteReservation(uid);
    } else {
      throw new HttpException('Username not equal', 403);
    }
  }
}

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotels: HotelsService) {}

  @Get('/')
  async getAll(@Query('size') pageSize: number, @Query('page') page: number) {
    const items = (await this.hotels.getAllHotels(page, pageSize)).map((h) =>
      this.hotels.hotelToHotelDTO(h),
    );
    const count = await this.hotels.getHotelsCount();
    return {
      page: page ? parseInt(page.toString()) : 1,
      pageSize: pageSize ? parseInt(pageSize?.toString()) : count,
      totalElements: count,
      items,
    };
  }

  @Get('/:hotelUid')
  async getOneHotel(@Param('hotelUid') uid: string) {
    return this.hotels.hotelToHotelDTO(await this.hotels.getHotelByUid(uid));
  }
}
