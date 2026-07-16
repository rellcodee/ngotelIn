import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateRoomImageDto {

    @IsString({ message: 'resource id must be a string' })
    @IsNotEmpty({ message: 'resource is required' })
    resource_id: string;

    @IsString({ message: 'image_url must be a string' })
    @IsNotEmpty({ message: 'image_url is required' })
    image_url: string;

    @IsBoolean({ message: "is_primary must be a bolean" })
    @IsNotEmpty({ message: "is_primary is required" })
    is_primary: boolean
}
