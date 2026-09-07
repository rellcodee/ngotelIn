import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'booking_id tidak boleh kosong' })
  @IsUUID('4', { message: 'booking_id harus berupa UUID valid' })
  booking_id: string;

  @IsNotEmpty({ message: 'Rating harus diisi' })
  @IsInt({ message: 'Rating harus berupa angka bulat' })
  @Min(1, { message: 'Rating minimal 1' })
  @Max(5, { message: 'Rating maksimal 5' })
  rating: number;

  @IsOptional()
  @IsString({ message: 'Komentar harus berupa teks' })
  comment?: string;
}
