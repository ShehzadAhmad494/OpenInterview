import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Post } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Param } from '@nestjs/common';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
