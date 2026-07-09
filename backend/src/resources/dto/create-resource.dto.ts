import { IsNotEmpty, IsInt, IsString, Min } from "class-validator";

export class CreateResourceDto {
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsString({ message: 'Type must be a string' })
    @IsNotEmpty({ message: 'Type is required' })
    type: string;

    @IsString({ message: "Location must be a string" })
    @IsNotEmpty({ message: "Location is required" })
    location: string;

    @IsInt({ message: 'Capacity must be a number' })
    @IsNotEmpty({ message: 'Capacity is required' })
    @Min(1, { message: 'Capacity must be at least 1' })
    capacity: number;
}
