import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { LocationDto } from 'src/locations/dtos/changeStatus.dto';
import { GetNearbyDriversDto } from 'src/locations/dtos/getNearbyDrivers.dto';
import { UpdateDriverLocationDto } from 'src/locations/dtos/updateDriverLocation.dto';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // Add a driver's location
  async addDriverLocation(
    id: number,
    updateLocation: LocationDto,
  ): Promise<void> {
    await this.redisClient.geoadd(
      'driverLocations',
      updateLocation.long,
      updateLocation.lat,
      id,
    );

    const position = await this.redisClient.geopos('driverLocations', id);
    console.log(`Position of driver:${id} in driverLocations:`, position);
  }

  // Get drivers within a radius of a given location
  // async getNearbyDrivers(getNearbyDrivers: GetNearbyDriversDto) {
  //   const result = await this.redisClient.georadius(
  //     'driverLocations',
  //     getNearbyDrivers.long,
  //     getNearbyDrivers.lat,
  //     getNearbyDrivers.radius,
  //     getNearbyDrivers.unit,
  //   );
  //   if (result.length === 0) {
  //     return 'No drivers avaliable in this area';
  //   }
  //   console.log(result, 'drivers');

  //   return result;
  // }
  async getNearbyDrivers(getNearbyDrivers: GetNearbyDriversDto) {
    const driverIds = await this.redisClient.georadius(
      'driverLocations',
      getNearbyDrivers.long,
      getNearbyDrivers.lat,
      getNearbyDrivers.radius,
      getNearbyDrivers.unit,
    );

    // Check for empty array to avoid unnecessary operations
    if (driverIds.length === 0) {
      return 'No drivers available in this area';
    }

    // Initialize the pipeline
    const pipeline = this.redisClient.pipeline();

    // Add GEOPOS commands for each driverId to the pipeline
    driverIds.forEach((driverId: string) => {
      // Explicitly type `driverId` as string
      pipeline.geopos('driverLocations', driverId);
    });

    // Execute the pipeline
    const results = await pipeline.exec();

    // Process results
    const driverLocations = results
      .map((result, index) => {
        const position = result[1]; // Extracting the result part of the response
        if (position[0]) {
          // Check if position data exists
          return {
            driverId: driverIds[index],
            long: position[0][0], // longitude
            lat: position[0][1], // latitude
          };
        }
        return null; // Handle cases where position might not be available
      })
      .filter((location) => location !== null); // Remove null values if any
    console.log(driverLocations);

    return driverLocations;
  }

  async removeDriverLocation(driverId: number): Promise<void> {
    await this.redisClient.zrem('driverLocations', driverId);
  }
}
