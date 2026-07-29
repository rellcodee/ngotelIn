import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoomImagesService } from './room_images.service';
import { CreateRoomImageDto } from './dto/create-room_image.dto';
import { UpdateRoomImageDto } from './dto/update-room_image.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums';

@Controller('room-images')
export class RoomImagesController {
  constructor(private readonly roomImagesService: RoomImagesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createRoomImageDto: CreateRoomImageDto) {
    return this.roomImagesService.create(createRoomImageDto);
  }

  @Get()
  findAll() {
    return this.roomImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomImagesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomImageDto: UpdateRoomImageDto,
  ) {
    return this.roomImagesService.update(id, updateRoomImageDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomImagesService.remove(id);
  }
}
