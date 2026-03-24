import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // unique email
  async create(dto: CreateUserDto) {
    // Check duplicate email
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }

  async findAll() {
    return this.userRepo.find({
      // Background mein: TypeORM ek LEFT JOIN query chalata hai.----> Explicit Loading
      relations: ['profiles'], // agar relation defined hai
    });
  }
   // find the user by email
  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['profiles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['profiles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }
}
