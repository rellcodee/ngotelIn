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
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get('available/:resourceId')
  findAvailable(@Param('resourceId') resourceId: string) {
    return this.scheduleService.findAvailable(resourceId);
  }

  // Route untuk Batch Create
  @Post('batch')
  createBatch(
    // ParseArrayPipe memastikan request body berupa Array dari CreateScheduleDto
    @Body(new ParseArrayPipe({ items: CreateScheduleDto }))
    createScheduleDtos: CreateScheduleDto[],
  ) {
    return this.scheduleService.createBatch(createScheduleDtos);
  }

  // Route untuk Statistik
  @Get('stats/summary')
  getStats(@Query('resourceId') resourceId?: string) {
    // Bisa dipanggil dengan GET /schedule/stats/summary
    // atau GET /schedule/stats/summary?resourceId=123-abc
    return this.scheduleService.getScheduleStats(resourceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id); // (Dihapus tanda + nya)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(id, updateScheduleDto); // (Dihapus tanda + nya)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id); // (Dihapus tanda + nya)
  }
}
