import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('driver')
export class DriverEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ default: false })
  isFullyRegistered: boolean;

  @Column({
    type: 'enum',
    enum: ['offline', 'online', 'on route'],
    default: 'offline',
  })
  status: string;

  @CreateDateColumn()
  registration_date: Date;

  @UpdateDateColumn()
  last_update: Date;
}
