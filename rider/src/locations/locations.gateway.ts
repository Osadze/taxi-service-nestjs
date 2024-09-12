import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dtos/create-location.dto';
import { Server } from 'socket.io';
import { GetNearbyDriversDto } from './dtos/getNearbyDrivers.dto';
import { AppEvents } from '../helpers/event-emitter.provider';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LocationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly locationService: LocationsService) {}

  onModuleInit() {
    AppEvents.on('returnNearbyDrivers', (drivers) => {
      this.server.emit('sentCurrentLocation', drivers);
    });
  }

  @SubscribeMessage('getCurrentLocation')
  async GetNearbyDrivers(
    @MessageBody() getNearbyDriversDto: GetNearbyDriversDto,
  ) {
    const drivers =
      await this.locationService.getNearbyDrivers(getNearbyDriversDto);
    return drivers;
  }
}
