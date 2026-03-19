import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking.dto';
import { UpdateBookingDto } from './dto/update_booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Create
  @Post('create')
  createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
  }

  //  Get all bookings
  @Get('all')
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  // Get booking by ID
  @Get(':id')
  getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  //  Get bookings by profile
  @Get('profile/:profile_id')
  getBookingsByProfile(@Param('profile_id') profile_id: string) {
    return this.bookingService.getBookingsByProfile(profile_id);
  }

  //  Get bookings by user
  @Get('user/:user_id')
  getBookingsByUser(@Param('user_id') user_id: string) {
    return this.bookingService.getBookingsByUser(user_id);
  }

  //  Update booking
  @Patch(':id')
  updateBooking(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.updateBooking(id, dto);
  }

  //  Delete booking
  @Delete(':id')
  deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
