import { Module } from '@nestjs/common';
import { TestModule } from './test/test.module';
import { KafkaModule } from './kafka/kafka.module';
import { TripsModule } from './trips/trips.module';

@Module({
  imports: [TestModule, KafkaModule, TripsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
