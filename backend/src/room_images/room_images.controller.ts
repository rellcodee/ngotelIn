import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoomImagesService } from './room_images.service';

@Controller('room-images')
export class RoomImagesController {
  constructor(private readonly roomImagesService: RoomImagesService) { }

  // POST /room-images/upload
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException('Hanya file gambar (JPG, PNG, WEBP) yang diperbolehkan!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('resource_id') resourceId: string,
    @Body('is_primary') isPrimary?: string,
  ) {
    if (!resourceId) {
      throw new BadRequestException('resource_id wajib diisi!');
    }

    // Karena Form-Data ngirim string, konversi 'true' / 'false' ke Boolean JS
    const isPrimaryBool = isPrimary === 'true' || isPrimary === '1';

    return this.roomImagesService.uploadImage(resourceId, file, isPrimaryBool);
  }

  @Get()
  findAll() {
    return this.roomImagesService.findAll();
  }

  // GET /room-images/resource/:resourceId
  @Get('resource/:resourceId')
  findByResource(@Param('resourceId') resourceId: string) {
    return this.roomImagesService.findByResource(resourceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomImagesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomImagesService.remove(id);
  }
}