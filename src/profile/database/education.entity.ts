import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  institution: string;
  @Column()
  Degree: string;

  @Column()
  fieldOfStudy: string;

  @Column()
  year: number;

  @ManyToOne(() => Profile, (profile) => profile.educations)
  profile: Profile;
}
