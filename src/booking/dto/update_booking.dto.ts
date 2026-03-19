import { IsOptional, IsString, IsEmail, IsDate, IsNumber } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  booker_name?: string;

  @IsOptional()
  @IsEmail()
  booker_email?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsDate()
  start_time?: Date;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  recruiter_timezone?: string;

  @IsOptional()
  @IsString()
  status?: string;
}