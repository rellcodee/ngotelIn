import { IsNotEmpty, IsInt, IsString, Min, IsArray, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { RoomType } from 'src/common/enums';

export class CreateResourceDto {
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsEnum(RoomType, { message: 'Room Type must be one of: standard, suite, presidential_suite' })
    @IsNotEmpty({ message: 'Room Type is required' })
    type: RoomType;

    @IsString({ message: 'Location must be a string' })
    @IsNotEmpty({ message: 'Location is required' })
    location: string;

    @IsString()
    @IsOptional()
    description?: string;

    @Type(() => Number) //  Otomatis convert string "1" dari form-data ke integer 1
    @IsInt({ message: 'Capacity must be a number' })
    @IsNotEmpty({ message: 'Capacity is required' })
    @Min(1, { message: 'Capacity must be at least 1' })
    capacity: number;

    @Type(() => Number) //  Otomatis convert string dari form-data ke integer
    @IsInt()
    @Min(100000)
    price_per_night: number;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    facilities: string[];
}