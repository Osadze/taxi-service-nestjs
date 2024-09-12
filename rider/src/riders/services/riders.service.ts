import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnterNumberDto } from 'src/auth/dtos/EnterNumberDto';
import { RiderEntity } from 'src/typeorm/rider.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RidersService {
  constructor(
    @InjectRepository(RiderEntity)
    private readonly riderRepository: Repository<RiderEntity>,
  ) {}

  async findOne(phoneNumber: string): Promise<RiderEntity | undefined> {
    const user = await this.riderRepository.findOne({
      where: { phoneNumber },
    });

    return user;
  }

  async createRider(data: EnterNumberDto): Promise<RiderEntity> {
    return this.riderRepository.save(data);
  }

  async updateRiderById(id: number, updateData: Partial<RiderEntity>): Promise<RiderEntity> {
    const rider = await this.riderRepository.findOne({ where: { id } });
    if (!rider) {
      throw new Error('Rider not found'); 
    }
  
    if (updateData.first_name && updateData.last_name) {
      updateData.isFullyRegistered = true;
    }
  
    const updatedRider = await this.riderRepository.save({
      ...rider,
      ...updateData
    });
  
    return updatedRider;
  }
  
}
