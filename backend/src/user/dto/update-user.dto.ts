import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsIn } from 'class-validator';
import { Role } from 'src/common/enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsIn([Role.ADMIN, Role.STAFF, Role.USER])
  role?: string;
}
