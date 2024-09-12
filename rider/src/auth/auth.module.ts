import { AuthController } from './controllers/auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiderEntity } from '../typeorm/rider.entity';
import { JwtModule } from '@nestjs/jwt';
import { RidersModule } from 'src/riders/riders.module';
import { LocalStrategy } from './utils/local.strategy';
import { JwtStrategy } from './utils/jwt.strategy';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Module({
  imports: [
    RidersModule,
    JwtModule.register({
      secret: 'jskldjskl2qj31ojku8217u90391ewk-mdnmaskj1301wp3sdamd9k12m3-123',
      signOptions: { expiresIn: '15m' }, // TODO: refresh token
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    ProducerService,
    ConsumerService,
  ],
})
export class AuthModule {}
