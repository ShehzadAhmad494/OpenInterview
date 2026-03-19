import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Profile } from 'src/profile/profile.entity';
import cloudinary from 'config/cloudinary.config';
import { UploadApiResponse } from 'cloudinary';
import { UploadFileDto } from './dto/file.dto';
import { randomUUID } from 'crypto';
import { FileKind } from './enums/file_kind.enum';
import { promises as fs } from 'fs';
import { resolve } from 'path'; // ✅ Ensure cross-platform path handling

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepo: Repository<File>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}

  async uploadFile(file: Express.Multer.File, body: UploadFileDto) {
    // 🔹 1. Validate file exists
    if (!file) throw new BadRequestException('File is required');

    // 🔹 2. Find User
    const user = await this.userRepo.findOne({ where: { id: body.user_id } });
    if (!user) throw new BadRequestException('User not found');

    // 🔹 3. Find Profile + relations
    const profile = await this.profileRepo.findOne({
      where: { id: body.profile_id },
      relations: ['user'],
    });
    if (!profile) throw new BadRequestException('Profile not found');

    // 🔹 4. Validate Profile belongs to User
    if (String(profile.user.id) !== String(user.id)) {
      throw new BadRequestException('Profile does not belong to this user');
    }

    // 🔹 5. Upload file to Cloudinary
    let result: UploadApiResponse;
    try {
      // Use resolve() to get absolute path (Windows/Linux safe)
      const absoluteFilePath = resolve(file.path);

      result = await cloudinary.uploader.upload(absoluteFilePath, {
        folder: `users/${user.id}/profiles/${profile.id}`,
        resource_type: 'auto',
      });

      // Delete local temp file after successful upload
      await fs.unlink(absoluteFilePath);
    } catch (error) {
      // Ensure temp file is deleted even on failure
      try {
        await fs.unlink(resolve(file.path));
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
      console.error('Cloudinary upload error:', error);
      throw new BadRequestException('File upload failed');
    }

    // 🔹 6. Save file record in DB
    const newFile = this.fileRepo.create({
      id: `file_${randomUUID()}`,
      public_id: result.public_id,
      url: result.secure_url,
      name: file.originalname,
      mime: file.mimetype,
      size_bytes: file.size,
      kind: FileKind.ATTACHMENT,
      user,
      profile,
    });

    const savedFile = await this.fileRepo.save(newFile);

    // 🔹 7. Return response
    return {
      message: 'File uploaded successfully',
      data: savedFile,
    };
  }
}