import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  // GET /notifications || GET /notifications?is_read=false
  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() query: QueryNotificationDto,
  ) {
    return this.notificationsService.findAll(userId, query);
  }

  // GET /notifications/unread-count
  @Get('unread-count')
  async getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  // PATCH /notifications/read-all
  // Disarankan di atas endpoint :id biar 'read-all' gak dianggap sebagai ID
  @Patch('read-all')
  async markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete('user/:userId')
  deleteAll(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.notificationsService.deleteAll(userId)
  }

  // PATCH /notifications/:id/read
  @Patch(':id/read')
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Delete(':id')
  deleteNotif(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.deleteNotif(id)
  }
}