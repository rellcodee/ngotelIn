import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) { }

// import { IsEnum, IsOptional } from 'class-validator';
// import { ScheduleStatus } from 'src/common/enums';
// export class UpdateScheduleDto {
//     @IsEnum(ScheduleStatus, { message: 'Invalid schedule status' })
//     @IsOptional()
//     status?: ScheduleStatus;
// }
// c4abc3e7-4c0b-4875-86f4-d323a875e71a