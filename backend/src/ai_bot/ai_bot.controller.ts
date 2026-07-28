import { Controller, Post, Body } from '@nestjs/common';
import { AiBotService } from './ai_bot.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('ai')
export class AiBotController {
  constructor(private readonly aiBotService: AiBotService) { }

  @Post('chat')
  async chat(@Body() createChatDto: CreateChatDto) {
    return this.aiBotService.chatWithAi(createChatDto);
  }
}
