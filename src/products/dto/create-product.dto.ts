import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  @Type(() => Number)
  public price: number;
}
