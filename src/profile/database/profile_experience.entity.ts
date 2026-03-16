import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company: string;

  @Column()
  role: string;

  @Column()
  startYear: number;

  @Column({ nullable: true })
  endYear: number;

  @ManyToOne(() => Profile, profile => profile.experiences)
  profile: Profile;
}