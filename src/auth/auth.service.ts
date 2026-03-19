// import { Injectable } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { CreateUserDto } from 'src/user/dto/create-user.dto';
// import { UserService } from 'src/user/user.service';

// @Injectable()
// export class AuthService {
//   constructor(private userService: UserService) {}
//   async signup(dto: CreateUserDto) {
//     const hashedPassword = await bcrypt.hash(dto.password, 10); // 10 salt rounds
//     const user = await this.userService.create({
//       ...dto,
//       password_hash: hashedPassword,
//       provider: 'local',
//     });
//     return user;
//   }
// }
