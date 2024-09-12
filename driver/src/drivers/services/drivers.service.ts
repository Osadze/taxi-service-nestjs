import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnterNumberDto } from 'src/auth/dtos/EnterNumberDto';
import { DriverEntity } from 'src/typeorm/driver.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepository: Repository<DriverEntity>,
  ) {}

  async findOne(phoneNumber: string): Promise<DriverEntity | undefined> {
    const user = await this.driverRepository.findOne({
      where: { phoneNumber },
    });

    return user;
  }

  async createDriver(data: EnterNumberDto): Promise<DriverEntity> {
    return this.driverRepository.save(data);
  }

  async updateDriverById(
    id: number,
    updateData: Partial<DriverEntity>,
  ): Promise<DriverEntity> {
    const driver = await this.driverRepository.findOne({ where: { id } });
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (updateData.first_name && updateData.last_name) {
      updateData.isFullyRegistered = true;
    }

    const updatedDriver = await this.driverRepository.save({
      ...driver,
      ...updateData,
    });

    return updatedDriver;
  }
}
