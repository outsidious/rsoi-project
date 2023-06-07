import { Module } from '@nestjs/common';
import { AppController, HotelsController } from './app.controller';
import { StatisticsService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, HotelsController],
  providers: [StatisticsService],
})
export class AppModule {}
