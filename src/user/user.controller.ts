import { Body, Controller, Get, Post } from '@nestjs/common';
// import { UserService } from './user.service';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}
    @Post()

    async createUsers(@Body() body: Partial<User>): Promise<User> {
        return this.userService.create(body);

    }

    // get all users
    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.userService.findAll();
    }
    // get user by id
    @Get(':id')
    async getUserById(@Body('id') id: number): Promise<User> {
        return this.userService.findById(id);
    }
}
