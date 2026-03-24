import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('stripe_webhook_events')
export class StripeWebhookEvent {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  event_id: string;

  @Column({ type: 'varchar', length: 255 })
  event_type: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'processed_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  processed_at: Date;
}
