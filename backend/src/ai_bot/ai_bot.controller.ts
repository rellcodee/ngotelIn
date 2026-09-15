import { Controller, Post, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { AiBotService } from './ai_bot.service';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';

@Controller('ai-bot')
export class AiBotController {
  constructor(private readonly aiBotService: AiBotService) { }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('chat')
  async chatUser(@Req() req: any, @Body() body: { message: string }) {
    const userId = req.user?.userId || null;
    console.log('REQ USER:', req.user);
    console.log('USER ID:', userId);

    return this.aiBotService.processUserMessage(body.message, userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete('chat')
  async resetChat(@Req() req: any) {
    const userId = req.user?.userId || null;
    return this.aiBotService.clearChatHistory(userId);
  }
}