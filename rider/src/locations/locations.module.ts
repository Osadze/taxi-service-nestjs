import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsGateway } from './locations.gateway';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Module({
  providers: [
    LocationsGateway,
    LocationsService,
    ProducerService,
    ConsumerService,
  ],
})
export class LocationsModule {}
