import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateOfficialDto } from './dto/create-official.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CaptchaService } from '../captcha/captcha.service';
import type { Request as ExpressRequest } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @NestRequest() request: ExpressRequest,
  ) {
    await this.captchaService.validate(
      createUserDto.captcha_token,
      request.ip,
    );
    const { captcha_token: _, ...userData } = createUserDto;
    return this.userService.create(userData);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post('official')
  createOfficial(@Body() createOfficialDto: CreateOfficialDto) {
    return this.userService.createOfficial(createOfficialDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.userService.findOne(id, currentUser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.userService.update(id, updateUserDto, currentUser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.userService.remove(id, currentUser);
  }
}
