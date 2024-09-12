import { Module } from '@nestjs/common';
import { DriversService } from './services/drivers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from 'src/typeorm/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity])],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {}
