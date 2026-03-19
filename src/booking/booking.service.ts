import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/booking.dto';
import { User } from 'src/user/user.entity';
import { Profile } from 'src/profile/profile.entity';
import { Booking } from './booking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { UpdateBookingDto } from './dto/update_booking.dto';// We'll create this DTO

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}

  // 🔹 Create Booking (existing)
  async createBooking(dto: CreateBookingDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.user_id } });
    if (!user) throw new BadRequestException('User not found');

    const profile = await this.profileRepo.findOne({ where: { id: dto.profile_id } });
    if (!profile) throw new BadRequestException('Profile not found');

    const booking = this.bookingRepo.create({
      id: `booking_${randomUUID()}`,
      owner: user,
      profile,
      booker_name: dto.booker_name,
      booker_email: dto.booker_email,
      message: dto.message,
      start_time: dto.start_time,
      duration: dto.duration || 30,
      recruiter_timezone: dto.recruiter_timezone,
      status: 'confirmed',
    });

    return this.bookingRepo.save(booking);
  }

  //  Get all bookings
  async getAllBookings() {
    return this.bookingRepo.find({ relations: ['owner', 'profile'] });
  }

  //  Get booking by ID
  async getBookingById(id: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['owner', 'profile'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  // Get bookings by profile
  async getBookingsByProfile(profile_id: string) {
    return this.bookingRepo.find({
      where: { profile: { id: profile_id } },
      relations: ['owner', 'profile'],
    });
  }

  //  Get bookings by owner/user
  async getBookingsByUser(user_id: string) {
    return this.bookingRepo.find({
      where: { owner: { id: user_id } },
      relations: ['owner', 'profile'],
    });
  }

  //  Update booking
  async updateBooking(id: string, dto: UpdateBookingDto) {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    // Merge DTO fields
    Object.assign(booking, dto);

    return this.bookingRepo.save(booking);
  }

  //  Delete booking
  async deleteBooking(id: string) {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    await this.bookingRepo.remove(booking);
    return { message: 'Booking deleted successfully' };
  }
}