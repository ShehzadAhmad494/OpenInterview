import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Entitlement } from './entitlement.entity';

@Entity('plans')
export class Plan {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  code: string;  // e.g., free, core, pro, elite

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', default: 0 })
  price_cents: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 20, default: 'month' })
  interval: string;

  @Column({ type: 'int', nullable: true })
  shares_limit: number;

  @Column({ type: 'int', nullable: true })
  bookings_limit: number;

  @Column({ type: 'int', default: 420 })
  max_interview_length_seconds: number;

  @Column({ type: 'bigint', nullable: true })
  views_limit: number;

  @Column({ type: 'bigint', nullable: true })
  video_storage_limit_bytes: number;

  @Column({ type: 'bigint', nullable: true })
  doc_storage_limit_bytes: number;

  @Column({ type: 'bigint', default: 5242880 })
  max_resume_file_size_bytes: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  stripe_price_id: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

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

  // Relation: Users entitlements link to plan
  @OneToMany(() => Entitlement, (entitlement) => entitlement.plans)
  entitlements: Entitlement[];
}