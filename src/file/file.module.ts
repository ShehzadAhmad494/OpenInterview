import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { User } from '../user/user.entity';
import { Profile } from '../profile/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File, User, Profile])],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
