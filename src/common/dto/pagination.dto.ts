import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
  @IsOptional()
  @Type(() => Number)
  skip?: number = 0;
  @IsOptional()
  @IsString()
  @IsIn(['true', 'false'])
  available?: 'true' | 'false';
}
