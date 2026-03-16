import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Experience } from './profile_experience.entity';
import { Education } from './education.entity';
import { Attachment } from './attachment.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profile_name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  sample_video: string;

  @Column({ nullable: true })
  video_thumbnail: string;

  @Column({ type: 'jsonb', nullable: true })
  contactInformation: {
    location: string;
    telephone: string;
    email: string;
    shortBio: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  socialLinks: {
    platform: string;
    url: string;
  }[];

  @Column({ nullable: true })
  resume: string;

  // attachments
  @OneToMany(() => Attachment, (attachment) => attachment.profile, {
    cascade: true,
  })
  files: Attachment[];

  // highlights
  @Column('text', { array: true, nullable: true })
  highlights: string[];

  // skills
  @Column('text', { array: true, nullable: true })
  skills: string[];

  // experience
  @OneToMany(() => Experience, (experience) => experience.profile, {
    cascade: true,
  })
  experiences: Experience[];

  // education
  @OneToMany(() => Education, (education) => education.profile, {
    cascade: true,
  })
  education: Education[];

  // availibility
  @Column({ type: 'jsonb', nullable: true })
  availability: {
    day: string; 
    slots: { start: string; end: string }[]; 
  }[];

  //   Rules
  @Column({ type: 'jsonb', nullable: true })
  rules: {
    minimumNotice: string;
    schedulingWindow: string;
    meetingDuration: string;
    buffer: {
      minBefore: number;
      minAfter: number;
    };
    dailyCap: number;
  };

  // user
  @ManyToOne(() => User, (user) => user.profiles)
  user: User;
}
