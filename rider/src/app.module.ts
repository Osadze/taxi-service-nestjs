import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RidersModule } from './riders/riders.module';
import { KafkaModule } from './kafka/kafka.module';
import { LocationsModule } from './locations/locations.module';
import { TripsModule } from './trips/trips.module';

@Module({
  imports: [
    AuthModule,
    RidersModule,
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
    CacheModule.register({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6379,
      },
      isGlobal: true,
    }),
    LocationsModule,
    TripsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
