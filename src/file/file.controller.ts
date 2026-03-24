import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/file.dto';
import { multerOptions } from './multer.config'; // ✅ DiskStorage config

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions)) // ✅ DiskStorage applied
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({ whitelist: true })) body: UploadFileDto,
  ) {
    //   console.log('file object:', file);
    // console.log('file.path:', file?.path);
    return this.fileService.uploadFile(file, body);
  }
}
