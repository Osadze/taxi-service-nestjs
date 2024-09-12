import { AuthService } from '../services/auth.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EnterNumberDto } from '../dtos/EnterNumberDto';
import { VerifyNumberDto } from '../dtos/VerifyNumberDto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { FullyRegisteredGuard } from 'src/riders/guards/fully-registered.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RiderEntity } from 'src/typeorm/rider.entity';
import { EnterDetailsDto } from '../dtos/EnterDetailsDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('number')
  @UsePipes(ValidationPipe)
  async enterNumber(@Body() enterNumberDto: EnterNumberDto) {
    await this.authService.sendNumber(enterNumberDto.phoneNumber);

    const user = await this.authService.findOrCreate(enterNumberDto);

    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(ValidationPipe)
  async loginWithPhoneNumber(@Body() verifyNumberDto: VerifyNumberDto) {
    return await this.authService.login(verifyNumberDto);
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true, // to throw an error if non-whitelisted properties are present
    }),
  )
  async updateRider(
    @Param('id') id: number,
    @Body() updateData: EnterDetailsDto,
  ): Promise<RiderEntity> {
    return this.authService.enterDetails(id, updateData);
  }

  @Get('test')
  // @UseGuards(JwtAuthGuard, FullyRegisteredGuard
  async saveNumberAndCode() {
    return 'test';
  }
}
