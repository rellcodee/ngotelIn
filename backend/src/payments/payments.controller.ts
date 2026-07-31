import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { MidtransNotification } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  @HttpCode(200)
  async midtransWebhook(@Body() payload: MidtransNotification) {
    return this.paymentsService.handleMidtransWebhook(payload);
  }
}
