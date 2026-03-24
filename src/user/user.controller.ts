import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt_auth.gaurd.ts/jwt_auth.gaurd.ts.guard';
// import 
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

    @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    return {
      message: 'Protected route accessed',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: req.user,
    };
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('by-email/:email')
  findByEmail(@Param('email') email: string) {
    console.log('EMAIL API HIT');
    return this.service.findByEmail(email);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}