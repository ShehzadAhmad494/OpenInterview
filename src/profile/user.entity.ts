import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class user {
  @PrimaryGeneratedColumn()
  id: number;

  name: string;

  email: string;

  password: string;
}
