import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateBookingDto {
    @IsString()
    @IsOptional()
    @IsIn(['pending', 'approved', 'checked_in', 'completed', 'rejected', 'canceled'])
    status?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}