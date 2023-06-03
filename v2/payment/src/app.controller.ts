import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Payment } from './payment';
import { AppService } from './app.service';

@Controller('payment')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('/manage/health')
  async getHealth() {
    return '';
  }
  
  @Post('/')
  async createPayment(@Body() body: Payment) {
    return await this.service.createPayment(body);
  }

  @Patch('/:paymentId')
  async updatePayment(@Body() body: Payment, @Param('paymentId') uid: string) {
    return await this.service.updatePaymentStatus(uid, body.status);
  }

  @Get('/:paymentId')
  async getPayment(@Param('paymentId') uid: string) {
    return await this.service.getPaymentByUid(uid);
  }
}
