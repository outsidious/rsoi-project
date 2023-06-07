import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoyaltyService } from './services/loyalty/loyalty.service';
import { PaymentService } from './services/payment/payment.service';
import { ReservationsService } from './services/reservations/reservations.service';
import { HttpModule } from '@nestjs/axios';
import { StatisticsService } from './services/statistics/statistics.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, LoyaltyService, PaymentService, ReservationsService, StatisticsService],
})
export class AppModule {}
