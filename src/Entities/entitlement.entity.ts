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
import { Plan } from './plan.entity';

@Entity('entitlements')
export class Entitlement {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  //  Relation with User
  @ManyToOne(() => User, (user) => user.entitlements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) // @JoinColumn sirf ManyToOne side pe hona chahiye---> as a foreign key reference
  user: User;

  //   Plans
  // entitlement.entity.ts
  @ManyToOne(() => Plan, (plan) => plan.entitlements, { nullable: true })
  @JoinColumn({ name: 'plan_code' })
  plans: Plan;

  @Column({ type: 'varchar', length: 50, default: 'free' })
  plan: string;

  @Column({ type: 'int', default: 0 })
  shares_used: number;

  @Column({ type: 'int', default: 1 })
  shares_limit: number;

  @Column({ type: 'int', default: 0 })
  bookings_used: number;

  @Column({ type: 'int', default: 0 })
  bookings_limit: number;

  @Column({ type: 'bigint', default: 0 })
  views_used: number;

  @Column({ type: 'bigint', default: 0 })
  video_storage_used_bytes: number;

  @Column({ type: 'bigint', default: 0 })
  doc_storage_used_bytes: number;

  @Column({ type: 'timestamp', nullable: true })
  credits_reset_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripe_customer_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripe_subscription_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  stripe_subscription_status: string;

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
