import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Profile } from '../profile/profile.entity';

@Entity('bookings')
export class Booking {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  // Relation to Profile
  @ManyToOne(() => Profile, (profile) => profile.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  // Relation to Profile Owner (User)
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User; // owner of booking

  @Column({ type: 'varchar', length: 255, nullable: true })
  booker_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  booker_email: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'int', default: 30 })
  duration: number;

  @Column({ type: 'timestamptz', nullable: true })
  start_time: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  recruiter_timezone: string;

  @Column({ type: 'varchar', length: 50, default: 'confirmed' })
  status: string;

  @Column({ type: 'text', nullable: true })
  ics_content: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}