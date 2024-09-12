import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rider')
export class RiderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phoneNumber: string;

  // @Column()
  // email?: string;

  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ default: false })
  isFullyRegistered?: boolean;

  // @Column({ nullable: true })
  // registration_date?: Date;
}
