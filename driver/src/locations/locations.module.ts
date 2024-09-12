import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsGateway } from './locations.gateway';
import { DriversModule } from 'src/drivers/drivers.module';
import { LocationController } from './locations.controller';
import { RedisModule } from 'src/redis/redis.module';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Module({
  imports: [DriversModule, RedisModule],
  controllers: [LocationController],
  providers: [
    LocationsGateway,
    LocationsService,
    ProducerService,
    ConsumerService,
  ],
})
export class LocationsModule {}
