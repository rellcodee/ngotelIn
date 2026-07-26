import { Controller, Post, Body, Delete, Patch, Get, Query, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings') // Base URL: http://localhost:3000/bookings
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Delete(':id') // DELETE http://localhost:3000/bookings/uuid-booking
  async remove(@Param('id') id: string) {
    return this.bookingsService.cancelBooking(id);
  }

  // GET ALL (Bisa lewat URL: http://localhost:3000/bookings atau dengan query filter)
  @Get()
  async findAll(
    @Query('user_id') userId?: string,   // Contoh: ?user_id=uuid-si-user (Buat history user)
    @Query('status') status?: string,    // Contoh: ?status=pending (Buat antrean staff)
  ) {
    return this.bookingsService.findAll(userId, status);
  }

  // 2. GET DETAIL (URL: http://localhost:3000/bookings/uuid-booking)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  // 3. PATCH UPDATE (URL: PATCH http://localhost:3000/bookings/uuid-booking)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

}