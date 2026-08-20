import { Controller, Post, Body, UseGuards, Req, Delete } from '@nestjs/common';
import { AiBotService } from './ai_bot.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
@Controller('ai')
export class AiBotController {
  constructor(private readonly aiBotService: AiBotService) { }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AuthGuard('jwt'))
  @Post('chat')
  async chat(@Req() req: any, @Body() createChatDto: CreateChatDto) {
    const userId = req.user.userId || req.user.id;
    return this.aiBotService.chatWithAi(createChatDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('chat')
  async resetChat(@Req() req: any) {
    const userId = req.user.userId || req.user.id;
    return this.aiBotService.clearChatHistory(userId);
  }
}
