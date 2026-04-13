import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpeninterviewModule } from './openinterview/openinterview.module';
import { ProfileModule } from './profile/profile.module';
// import { ProileService } from './proile/proile.service';
// import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { FileModule } from './file/file.module';
import { AvailabilityModule } from './availability/availability.module';
import { AuthModule } from './auth/auth.module';
import { EndpointSyncModule } from './endpoint-sync/endpoint-sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // user environment variable anywhere
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      autoLoadEntities: true,
    }),

    OpeninterviewModule,

    ProfileModule,

    // AuthModule,

    UserModule,

    BookingModule,

    FileModule,

    AvailabilityModule,

    AuthModule,
// End Point Sync Module
    EndpointSyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
