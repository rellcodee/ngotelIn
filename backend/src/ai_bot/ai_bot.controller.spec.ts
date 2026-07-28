import { Test, TestingModule } from '@nestjs/testing';
import { AiBotController } from './ai_bot.controller';
import { AiBotService } from './ai_bot.service';

describe('AiBotController', () => {
  let controller: AiBotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiBotController],
      providers: [AiBotService],
    }).compile();

    controller = module.get<AiBotController>(AiBotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
