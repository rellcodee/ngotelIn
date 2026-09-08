import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ScheduleStatus } from 'src/common/enums';
export class CreateScheduleDto {
  @IsUUID()
  @IsOptional()
  resource_id?: string;

  @IsDateString()
  @IsNotEmpty()
  start_time: string;

  @IsDateString()
  @IsNotEmpty()
  end_time: string;

  @IsEnum(ScheduleStatus, { message: 'Invalid schedule status' })
  status: ScheduleStatus;
}
