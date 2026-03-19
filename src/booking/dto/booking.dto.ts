import { IsNotEmpty, IsString, IsEmail, IsOptional, IsDate, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  profile_id: string;

  @IsString()
  @IsNotEmpty()
  booker_name: string;

  @IsEmail()
  @IsNotEmpty()
  booker_email: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsDate()
  @IsOptional()
  start_time?: Date;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  recruiter_timezone?: string;
}