import { Module } from '@nestjs/common';
import { AiBotService } from './ai_bot.service';
import { AiBotController } from './ai_bot.controller';

@Module({
  controllers: [AiBotController],
  providers: [AiBotService],
})
export class AiBotModule {}
