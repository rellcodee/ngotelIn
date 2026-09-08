import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateChatDto {
  @IsNotEmpty({ message: 'Pesan tidak boleh kosong.' })
  @MaxLength(300, { message: 'Pesan tidak boleh lebih dari 300 karakter.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  message: string;
}
