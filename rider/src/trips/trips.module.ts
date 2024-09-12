import { Module } from '@nestjs/common';
import { TripsController } from './controllers/trips.controller';
import { TripsService } from './services/trips.service';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';
import { TripsGateway } from './gateways/trips.gateway';

@Module({
  imports: [],
  controllers: [TripsController],
  providers: [TripsGateway, TripsService, ProducerService, ConsumerService],
})
export class TripsModule {}
