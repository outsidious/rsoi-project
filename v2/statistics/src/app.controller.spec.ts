import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { StatisticsService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [StatisticsService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(StatisticsService.getHello()).toBe('Hello World!');
    });
  });
});
