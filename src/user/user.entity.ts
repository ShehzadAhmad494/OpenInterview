import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { Entitlement } from '../Entities/entitlement.entity';
import { File } from '../file/file.entity';
import { Booking } from '../booking/booking.entity';
import { Availability } from '../availability/availability.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 250, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'varchar', length: 250 })
  password_hash: string;

  // fixed for local strategy -----> may be same or null (local)
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  google_id: string;

  // add provider (local or google) -----> Fix 👉
  @Column({ type: 'varchar', default: 'local' })
  provider: string;

  @Column({ type: 'text', nullable: true }) // Optional avatar
  avatar: string;

  @Column({ type: 'varchar', length: 20, default: 'anonymous' })
  status: string;

  @Column({ type: 'varchar', length: 100, default: 'America/Los_Angeles' })
  timezone: string;

  @Column({ type: 'varchar', length: 50, default: 'user' })
  role: string[]; // user can have multiple roles (e.g., ['user', 'admin'])
  // Add Column for Refresh Token ( we need this to store our refresh token in db)
  // why null ---> existing users ke pass refresh token nahi hoga
  @Column({ type: 'text', nullable: true })
  refresh_token: string | null;
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  //   relation with Profile Entity
  @OneToMany(() => Profile, (profile) => profile.user)
  profiles: Profile[];

  //   Relation with Entitlements
  //   common error: One to many main single object use krna

  @OneToMany(() => Entitlement, (entitlement) => entitlement.user)
  entitlements: Entitlement[]; // many entitements for one user

  //   Relation with Files
  @OneToMany(() => File, (file) => file.user)
  files: File[];

  //   Relation with Booking (booking ka owner kon hai)
  @OneToMany(() => Booking, (booking) => booking.owner)
  bookings: Booking[];

  //   User Availibility
  @OneToMany(() => Availability, (availability) => availability.user)
  availability: Availability[];
}
