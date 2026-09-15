import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AiBotService } from './ai_bot.service';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';

@Controller('ai-bot')
export class AiBotController {
  constructor(private readonly aiBotService: AiBotService) { }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('chat')
  async chatUser(@Req() req: any, @Body() body: { message: string }) {
    const userId = req.user?.userId || null;
    return this.aiBotService.processUserMessage(body.message, userId);
  }
}