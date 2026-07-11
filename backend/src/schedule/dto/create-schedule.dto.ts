import { IsDateString, IsIn, IsOptional, IsUUID } from 'class-validator';

export class CreateScheduleDto {
  @IsUUID()
  @IsOptional()
  resource_id?: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsIn(['available', 'booked', 'canceled', 'maintenance'])
  @IsOptional()
  status?: string;
}
