import { Controller, Post, Body, HttpCode, Logger, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { MidtransNotification } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async midtransWebhook(@Body() payload: MidtransNotification) {
    this.logger.log(`Incoming Midtrans Webhook for Order ID: ${payload?.order_id}`);

    try {
      const result = await this.paymentsService.handleMidtransWebhook(payload);
      return {
        status: 'success',
        message: 'Webhook processed successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`, error.stack);

      // Tetap kembalikan 200 OK ke Midtrans agar Midtrans tidak melakukan retry terus-menerus jika itu bad request, 
      // atau lempar exception sesuai kebutuhan bisnis.
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}