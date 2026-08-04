import {
  IsUUID,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { PaymentMethod } from 'src/common/enums';
export class CreateBookingDto {
  @IsUUID()
  @IsOptional()
  user_id?: string;

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

  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  payment_method: PaymentMethod;
}
