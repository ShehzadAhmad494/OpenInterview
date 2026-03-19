import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Profile } from '../profile/profile.entity';

@Entity('files')
export class File {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  public_id: string;

  // Relation to User
  @ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  //  Relation to Profile
  @ManyToOne(() => Profile, (profile) => profile.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mime: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  size_label: string;

  @Column({ type: 'bigint', default: 0 })
  size_bytes: number;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 32, default: 'attachment' })
  kind: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
