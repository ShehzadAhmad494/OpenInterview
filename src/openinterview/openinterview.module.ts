import { Module } from '@nestjs/common';
import { OpeninterviewService } from './openinterview.service';
import { OpeninterviewController } from './openinterview.controller';
import { User } from 'src/user/user.entity';
import { Entitlement } from 'src/Entities/entitlement.entity';
import { File } from 'src/Entities/file.entity';
import { Profile } from 'src/profile/profile.entity';
import { StripeWebhookEvent } from 'src/Entities/stripe_webhook_event.entity';
import { Plan } from 'src/Entities/plan.entity';
import { Booking } from 'src/Entities/booking.entity';
import { Availability } from 'src/Entities/availability.entity';
import { AnalyticsEvent } from 'src/Entities/analytics.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      File,
      Booking,
      Entitlement,
      Plan,
      Availability,
      AnalyticsEvent,
      StripeWebhookEvent,
    ]),
  ],
  providers: [OpeninterviewService],
  controllers: [OpeninterviewController],
})
export class OpeninterviewModule {}
