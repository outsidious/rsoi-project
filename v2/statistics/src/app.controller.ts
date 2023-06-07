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
import { StatisticsRecord } from './statistics';
import { StatisticsService } from './app.service';
import { Request } from 'express';

@Controller('statistics')
export class AppController {
  constructor(
    private readonly statistics: StatisticsService,
  ) {}


  @Get('/manage/health')
  async getHealth() {
    return '';
  }

  @Get('/')
  async getAllRecords(@Req() request: Request) {
    Logger.log(JSON.stringify(request.headers));
    const username: string = request.headers['x-user-name']?.toString();
    if (!username) throw new BadRequestException('x-user-name');
    const records = await this.statistics.getAllRecords();
    const items = [];
    for (const r of records) {
      items.push(r);
    }
    return items;
  }


  @Post('/')
  async createRecord(@Body() body: StatisticsRecord, @Req() request: Request) {
    const username: string = request.headers['x-user-name']?.toString();
    if (!username) throw new BadRequestException('x-user-name');
    if (body.username != username)
      throw new HttpException('cant create reservation for another user', 403);
    const r = await this.statistics.createRecord({
      ...body,
    });
    return r;
  }}
