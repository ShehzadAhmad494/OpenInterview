import { Injectable } from '@nestjs/common';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}

  async create(data: Partial<Profile>) {
    const profile = this.profileRepo.create(data);
    return this.profileRepo.save(profile);
  }

  async findAll() {
    return this.profileRepo.find({
      relations: ['user'], // relation load
    });
  }

  async findOne(id: string) {
    return this.profileRepo.findOne({
      where: { id },
      relations: ['user', 'files', 'bookings'],
    });
  }

  async update(id: string, data: Partial<Profile>) {
    await this.profileRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.profileRepo.delete(id);
  }
}
