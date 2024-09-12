import { Module } from '@nestjs/common';
import { RidersService } from './services/riders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiderEntity } from 'src/typeorm/rider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RiderEntity])],
  providers: [RidersService],
  exports: [RidersService],
})
export class RidersModule {}
