import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  profile_id: string;
}
