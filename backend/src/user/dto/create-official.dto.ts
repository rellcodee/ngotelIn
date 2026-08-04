import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums';

export class CreateOfficialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsIn([Role.ADMIN, Role.STAFF], {
    message: 'Role official hanya boleh bernilai: admin atau staff!',
  })
  @IsNotEmpty()
  role: string;
}
