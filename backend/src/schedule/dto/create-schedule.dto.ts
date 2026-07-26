import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ScheduleStatus } from 'src/common/enums';
export class CreateScheduleDto {
  @IsUUID()
  @IsOptional()
  resource_id?: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsEnum(ScheduleStatus, { message: 'Invalid schedule status' })
  @IsOptional()
  status?: ScheduleStatus;
}
