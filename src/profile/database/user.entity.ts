import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;

//   @OneToMany(() => Child, child => child.parent)
  @OneToMany(() => Profile, (profile) => profile.user)
  profiles: Profile[];
}
