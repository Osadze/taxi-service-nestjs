import { Module } from '@nestjs/common';
import { TripsController } from './controllers/trips.controller';
import { TripsService } from './services/trips.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsEntity } from 'src/typeorm/trips.entity';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Module({
  imports: [TypeOrmModule.forFeature([TripsEntity])],
  controllers: [TripsController],
  providers: [TripsService, ProducerService, ConsumerService],
})
export class TripsModule {}
