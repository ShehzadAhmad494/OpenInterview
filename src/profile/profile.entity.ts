import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { File } from '../file/file.entity';
import { Booking } from '../booking/booking.entity';

@Entity('profiles')
export class Profile {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  // Relation with User
  @ManyToOne(() => User, (user) => user.profiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  //Relation with File (ALl Files of the Profile store in central Place)

  @OneToMany(() => File, (file) => file.profile)
  files: File[];

  //   Booking -----> konsi profile ki booking hai
  @OneToMany(() => Booking, (booking) => booking.profile)
  bookings: Booking[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'text', nullable: true })
  video_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  video_file_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resume_file_id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  public_handle: string;

  @Column({ type: 'varchar', length: 50, default: 'private' })
  visibility: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'int', default: 0 })
  view_count: number;

  @Column({ type: 'int', default: 0 })
  booking_count: number;

  // JSONB fields
  @Column({ type: 'jsonb', default: {} }) // if no record then empty
  person: Record<string, any>; // jsonb object ---- single object

  @Column({ type: 'jsonb', default: [] })
  highlights: any[];

  @Column({ type: 'jsonb', default: [] })
  skills: any[]; // jsonb array

  @Column({ type: 'jsonb', default: {} })
  social: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  contact: Record<string, any>;

  @Column({ type: 'jsonb', default: [] })
  experience: any[];

  @Column({ type: 'jsonb', default: [] })
  education: any[]; // doubt

  @Column({ type: 'text', nullable: true })
  thumbnail_url: string;

  @Column({ type: 'text', nullable: true })
  thumbnail_file_id: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updated_at: Date;
}
