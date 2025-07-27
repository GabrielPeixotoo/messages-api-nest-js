import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @MaxLength(100)
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
