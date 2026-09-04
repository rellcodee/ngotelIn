import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors,
  UploadedFiles,
  BadRequestException, UseGuards
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums';


@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, { // maksimal 5 gambar
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB per file
      fileFilter: (req, file, callback) => {
        // Ambil ekstensi dari nama file asli (misal: "kamar.PNG" -> ".png")
        const ext = file.originalname
          ? file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'))
          : '';

        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

        // Cek apakah ekstensinya cocok
        if (allowedExtensions.includes(ext)) {
          return callback(null, true);
        }

        // Jika ekstensi tidak ada, cek mimetype-nya sebagai cadangan
        const allowedMimeTypes = [
          'image/jpeg',
          'image/pjpeg',
          'image/png',
          'image/x-png',
          'image/webp',
        ];

        if (allowedMimeTypes.includes(file.mimetype?.toLowerCase())) {
          return callback(null, true);
        }

        // Jika dua-duanya tidak cocok, baru tolak
        return callback(
          new BadRequestException(
            'Hanya file gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan!',
          ),
          false,
        );
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
    @Query() query: { search?: string; location?: string; type?: string },
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Get('live-status')
  getLiveStatus(@Query() query: { search?: string; type?: string }) {
    return this.resourcesService.getLiveStatus(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 5, { // Upload gambar baru jika ada
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        // Ambil ekstensi dari nama file asli (misal: "kamar.PNG" -> ".png")
        const ext = file.originalname
          ? file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'))
          : '';

        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

        // Cek apakah ekstensinya cocok
        if (allowedExtensions.includes(ext)) {
          return callback(null, true);
        }

        // Jika ekstensi tidak ada, cek mimetype-nya sebagai cadangan
        const allowedMimeTypes = [
          'image/jpeg',
          'image/pjpeg',
          'image/png',
          'image/x-png',
          'image/webp',
        ];

        if (allowedMimeTypes.includes(file.mimetype?.toLowerCase())) {
          return callback(null, true);
        }

        // Jika dua-duanya tidak cocok, baru tolak
        return callback(
          new BadRequestException(
            'Hanya file gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan!',
          ),
          false,
        );
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @Body('delete_image_ids') deleteImageIdsRaw?: string | string[],
    @Body('primary_image_id') primaryImageId?: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    // Formatting ID foto yang mau dihapus biar selalu berupa Array
    let deleteImageIds: string[] = [];
    if (typeof deleteImageIdsRaw === 'string') {
      deleteImageIds = deleteImageIdsRaw.split(',').map((item) => item.trim());
    } else if (Array.isArray(deleteImageIdsRaw)) {
      deleteImageIds = deleteImageIdsRaw;
    }

    return this.resourcesService.update(id, updateResourceDto, files, deleteImageIds, primaryImageId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
