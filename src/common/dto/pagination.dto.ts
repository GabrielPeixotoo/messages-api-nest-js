import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Max(50)
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset: number;
}
