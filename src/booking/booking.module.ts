import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { User } from 'src/user/user.entity';
import { Profile } from 'src/profile/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, Profile]), // ✅ Add User & Profile
  ],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
