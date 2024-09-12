import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6379,
          // additional options as needed
        });
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
