import {
  IsString,
  MinLength,
  MaxLength,
  IsAlphanumeric,
  IsAscii,
  IsHalfWidth,
  IsOptional,
  Length,
} from 'class-validator';

export class AuthDto {
  @IsAlphanumeric()
  @Length(6, 20)  
  user_id: string;

  @IsString()
  @IsAscii()
  @IsHalfWidth()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsOptional()
  @MaxLength(30)
  nickname: string;

  @IsOptional()
  @MaxLength(100)
  comment: string;
}

export class UserUpdateDto {
  @MaxLength(30)
  @IsOptional()
  nickname: string;

  @MaxLength(100)
  @IsOptional()
  comment: string;
}
