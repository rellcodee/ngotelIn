import {
  Controller,
  Post,
  Body,
  Delete,
  Patch,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() currentUser: { userId: string; role: string },
  ) {
    createBookingDto.user_id = currentUser.userId;
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: { userId: string; role: string },
  ) {
    return this.bookingsService.cancelBooking(id, currentUser);
  }

  @Get()
  async findAll(
    @CurrentUser() currentUser: { userId: string; role: string },
    @Query('user_id') userId?: string,
    @Query('status') status?: string,
  ) {
    return this.bookingsService.findAll(currentUser, userId, status);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: { userId: string; role: string },
  ) {
    return this.bookingsService.findOne(id, currentUser);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }
}
