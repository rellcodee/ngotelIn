import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors,
  UploadedFiles,
  BadRequestException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) { }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, { // maksimal 5 gambar
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB per file
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException('Hanya file gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  create(
    @Body() createResourceDto: CreateResourceDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.resourcesService.create(createResourceDto, files);
  }

  @Get()
  findAll(
    @Query() query: { search?: string; location?: string; type?: string }
  ) {
    return this.resourcesService.findAll(query);
  }

  @Get('available')
  async getAvailableRooms(
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.resourcesService.findAvailableRooms(checkIn, checkOut);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 5, { // Upload gambar baru jika ada
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException('Hanya file gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @Body('delete_image_ids') deleteImageIdsRaw?: string | string[], // Bisa kirim string tunggal atau array
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    // Formatting ID foto yang mau dihapus biar selalu berupa Array
    let deleteImageIds: string[] = [];
    if (typeof deleteImageIdsRaw === 'string') {
      deleteImageIds = deleteImageIdsRaw.split(',').map((item) => item.trim());
    } else if (Array.isArray(deleteImageIdsRaw)) {
      deleteImageIds = deleteImageIdsRaw;
    }

    return this.resourcesService.update(id, updateResourceDto, files, deleteImageIds);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }


}
