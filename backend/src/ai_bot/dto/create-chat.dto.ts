import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateChatDto {
    @IsUUID()
    @IsOptional()
    user_id?: string; // Sementara opsional sebelum lu pasang JWT Auth Guard

    @IsString()
    @IsNotEmpty()
    message: string; // Pertanyaan dari calon tamu (misal: "Ada kamar kosong besok?")
}