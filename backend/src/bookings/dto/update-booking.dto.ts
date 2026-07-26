import { IsOptional, IsString, IsEnum } from 'class-validator';
import { BookingStatus } from 'src/common/enums';
export class UpdateBookingDto {
    @IsOptional()
    @IsEnum(BookingStatus, { message: 'Invalid booking status' })
    status?: BookingStatus;

    @IsString()
    @IsOptional()
    notes?: string;
}