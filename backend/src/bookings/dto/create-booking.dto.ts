import { IsUUID, IsNotEmpty, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
    @IsUUID()
    @IsNotEmpty()
    user_id: string; // Tambahkan ini sementara untuk tes di Postman

    @IsUUID()
    @IsNotEmpty()
    resource_id: string;

    @IsDateString()
    @IsNotEmpty()
    start_time: string;

    @IsDateString()
    @IsNotEmpty()
    end_time: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsNotEmpty()
    payment_method: string;
}