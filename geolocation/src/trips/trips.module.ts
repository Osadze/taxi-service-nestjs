import { Module } from '@nestjs/common';
import { TripsController } from './controllers/trips.controller';
import { TripsService } from './services/trips.service';
import { GoogleMapsService } from './services/google-maps.service';
import { HttpModule } from '@nestjs/axios';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';
import { TripsGateway } from './gateways/trips.gateway';

@Module({
  imports: [HttpModule],
  controllers: [TripsController],
  providers: [
    TripsGateway,
    TripsService,
    GoogleMapsService,
    ProducerService,
    ConsumerService,
  ],
})
export class TripsModule {}
