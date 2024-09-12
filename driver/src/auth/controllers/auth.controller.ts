import { AuthService } from '../services/auth.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
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
// import { FullyRegisteredGuard } from 'src/drivers/guards/fully-registered.guard';
// import { JwtAuthGuard } from '../guards/jwt-auth.guard';
// import { DriverEntity } from 'src/typeorm/driver.entity';
// import { EnterDetailsDto } from '../dtos/EnterDetailsDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('number')
  @UsePipes(ValidationPipe)
  async enterNumber(@Body() enterNumberDto: EnterNumberDto) {
    const user = await this.authService.findOne(enterNumberDto);

    await this.authService.sendNumber(enterNumberDto.phoneNumber);

    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(ValidationPipe)
  async loginWithPhoneNumber(@Body() verifyNumberDto: VerifyNumberDto) {
    return await this.authService.login(verifyNumberDto);
  }

  //   @Patch(':id')
  //   @UsePipes(
  //     new ValidationPipe({
  //       transform: true,
  //       whitelist: true,
  //       forbidNonWhitelisted: true, // to throw an error if non-whitelisted properties are present
  //     }),
  //   )
  //   async updateDriver(
  //     @Param('id') id: number,
  //     @Body() updateData: EnterDetailsDto,
  //   ): Promise<DriverEntity> {
  //     return this.authService.enterDetails(id, updateData);
  //   }

  @Get('test')
  // @UseGuards(JwtAuthGuard, FullyRegisteredGuard
  async saveNumberAndCode() {
    return 'test';
  }
}
