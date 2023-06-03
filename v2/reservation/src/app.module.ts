import { Module } from '@nestjs/common';
import { AppController, HotelsController } from './app.controller';
import { AppService } from './app.service';
import { HotelsService } from './hotels.service';

@Module({
  imports: [],
  controllers: [AppController, HotelsController],
  providers: [AppService, HotelsService],
})
export class AppModule {}
