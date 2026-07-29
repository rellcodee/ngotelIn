import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseArrayPipe,
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // -------------------------------------------------------------
  // ROUTE STATIS & PENDUKUNG (Harus di atas :id)
  // -------------------------------------------------------------

  //Create Schedule (Batch / Banyak Sekaligus)
  // Menggunakan ParseArrayPipe agar NestJS otomatis memvalidasi isi array DTO
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Post('batch')
  async createBatch(
    @Body(new ParseArrayPipe({ items: CreateScheduleDto }))
    createScheduleDtos: CreateScheduleDto[],
  ) {
    return this.scheduleService.createBatch(createScheduleDtos);
  }

  // Get Schedule Stats (Global atau per Kamar)
  // Akses: GET /schedules/stats ATAU /schedules/stats?resource_id=xxx
  @Get('stats')
  async getStats(@Query('resource_id') resource_id?: string) {
    return this.scheduleService.getScheduleStats(resource_id);
  }

  // Find Busy Schedules (Fitur Kalender Frontend)
  // Akses: GET /schedules/busy/id-kamar
  @Get('busy/:resource_id')
  async findBusy(@Param('resource_id') resource_id: string) {
    return this.scheduleService.findBusySchedules(resource_id);
  }

  // -------------------------------------------------------------
  // ROUTE STANDAR CRUD & DINAMIS
  // -------------------------------------------------------------

  // Create Schedule (Single Booking / Maintenance)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  // Find All Schedules (Log Global Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Get()
  async findAll() {
    return this.scheduleService.findAll();
  }

  // Find One Schedule (Detail Jadwal)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  // Update Schedule (Reschedule ATAU Cancel)
  // -> Jalur Reschedule: Kirim start_time / end_time (Memicu cek bentrok)
  // -> Jalur Cancel: Cuma kirim { "status": "canceled" } (Bypass cek bentrok)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  // Remove Schedule (Hapus Permanen)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }
}
