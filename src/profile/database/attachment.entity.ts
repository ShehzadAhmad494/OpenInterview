import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  url: string;

  @Column()
  type: string;

  @ManyToOne(() => Profile, (profile) => profile.files, { nullable: false })
  profile: Profile;
}