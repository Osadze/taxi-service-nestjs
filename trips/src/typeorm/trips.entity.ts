import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('trips')
export class TripsEntity {
  @PrimaryGeneratedColumn()
  tripId: number;

  @Column()
  riderId: number;

  @Column({ nullable: true })
  driverId: number;

  @Column('json')
  pickUp: {};

  @Column('json')
  dropOff: {};

  @Column({ type: 'float', nullable: true })
  distance: number;

  @Column({ type: 'int', nullable: true })
  estimatedDurationOfRide: number; // in minutes

  @Column({ type: 'text', nullable: true })
  routePath: string; // polyline

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  tripPrice: number;

  // @Column('timestamp')
  // bookingTime: Date;

  // @Column({ type: 'enum', enum: ['pending', 'finished', 'canceled'] })
  // status: 'pending' | 'finished' | 'canceled';

  // @Column('timestamp', { nullable: true })
  // pickupTime: Date;

  // @Column('timestamp', { nullable: true })
  // dropoffTime: Date;

  // @Column()
  // vehicleId: number;

  // @Column({ type: 'enum', enum: ['basic', 'premium'] })
  // rideClass: 'basic' | 'premium';

  // @Column({ nullable: true })
  // paymentId: number;

  // @Column('int')
  // waitingTime: number; // in seconds

  // @Column({ type: 'text', nullable: true })
  // cancellationReason: string;

  // @Column({ type: 'float', nullable: true })
  // driverRatingByRider: number;

  // @Column({ type: 'float', nullable: true })
  // riderRatingByDriver: number;

  // @Column({ type: 'text', nullable: true })
  // rideNotes: string;

  // @Column({ type: 'enum', enum: ['paid', 'unpaid'], default: 'unpaid' })
  // paymentStatus: 'paid' | 'unpaid';

  // @Column({ type: 'float', nullable: true })
  // surgeMultiplier: number;

  // @Column({ type: 'text', nullable: true })
  // trafficConditions: string;

  // @CreateDateColumn({ type: 'timestamp' })
  // createdAt: Date;

  // @UpdateDateColumn({ type: 'timestamp' })
  // updatedAt: Date;
}

// postgres
// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity('trips')
// export class TripsEntity {
//   @PrimaryGeneratedColumn()
//   bookingId: number;

//   @Column()
//   riderId: number;

//   @Column()
//   driverId: number;

//   @Column('text')
//   pickup: string;

//   @Column('text')
//   dropoff: string;

//   @Column('timestamp with time zone')
//   bookingTime: Date;

//   @Column({ type: 'enum', enum: ['pending', 'finished', 'canceled'] })
//   status: 'pending' | 'finished' | 'canceled';

//   @Column('timestamp with time zone', { nullable: true })
//   pickupTime: Date;

//   @Column('timestamp with time zone', { nullable: true })
//   dropoffTime: Date;

//   @Column()
//   vehicleId: number;

//   @Column({ type: 'enum', enum: ['basic', 'premium'] })
//   rideClass: 'basic' | 'premium';

//   @Column({ nullable: true })
//   paymentId: number;

//   @Column('decimal', { precision: 10, scale: 2 })
//   ridePrice: number;

//   @Column('float')
//   rideDistance: number;

//   @Column('int')
//   estimatedDurationOfRide: number; // in seconds

//   @Column('int')
//   waitingTime: number; // in seconds

//   @Column({ type: 'text', nullable: true })
//   cancellationReason: string;

//   @Column({ type: 'float', nullable: true })
//   driverRatingByRider: number;

//   @Column({ type: 'float', nullable: true })
//   riderRatingByDriver: number;

//   @Column({ type: 'text', nullable: true })
//   rideNotes: string;

//   @Column({ type: 'enum', enum: ['paid', 'unpaid'], default: 'unpaid' })
//   paymentStatus: 'paid' | 'unpaid';

//   @Column({ type: 'float', nullable: true })
//   surgeMultiplier: number;

//   @Column({ type: 'text', nullable: true })
//   routePath: string; // polyline

//   @Column({ type: 'text', nullable: true })
//   trafficConditions: string;

//   @CreateDateColumn({ type: 'timestamp with time zone' })
//   createdAt: Date;

//   @UpdateDateColumn({ type: 'timestamp with time zone' })
//   updatedAt: Date;
// }
