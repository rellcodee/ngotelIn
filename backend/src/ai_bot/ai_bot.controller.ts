import { Controller, Post, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { AiBotService } from './ai_bot.service';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';

@Controller('ai-bot')
export class AiBotController {
  constructor(private readonly aiBotService: AiBotService) { }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('chat')
  async chatUser(@Req() req: any, @Body() body: { message: string; user_id?: string }) {
    const userId = req.user?.userId || req.user?.id || (body.user_id && body.user_id.trim() !== '' ? body.user_id : null);

    return this.aiBotService.processUserMessage(body.message, userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete('chat')
  async resetChat(@Req() req: any, @Body() body?: { user_id?: string }) {
    const userId = req.user?.userId || req.user?.id || (body?.user_id && body.user_id.trim() !== '' ? body.user_id : null);
    return this.aiBotService.clearChatHistory(userId);
  }
}