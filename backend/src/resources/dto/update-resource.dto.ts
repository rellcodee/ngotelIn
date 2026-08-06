import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {

    @IsOptional()
    @IsString()
    primary_image_id?: string;

    @IsOptional()
    delete_image_ids?: string | string[];
}
