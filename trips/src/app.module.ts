import { Module } from '@nestjs/common';
import { TripsModule } from './trips/trips.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    TripsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQLHOST,
      port: parseInt(process.env.MYSQLPORT),
      username: process.env.MYSQLUSERNAME,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      autoLoadEntities: true, //DEV
      synchronize: true, //DEV
    }),
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
