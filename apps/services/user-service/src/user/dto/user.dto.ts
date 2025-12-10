import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  company?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  company?: string;

  @IsEmail()
  @IsOptional()
  email: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class GetUserDto {
  email: string;
  name?: string;
  company?: string;
  createdAt: Date;
}
