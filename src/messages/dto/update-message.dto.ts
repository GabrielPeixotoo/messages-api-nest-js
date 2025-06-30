import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  readonly text?: string;
}
