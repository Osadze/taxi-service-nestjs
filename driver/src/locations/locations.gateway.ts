import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { LocationsService } from './locations.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LocationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly locationService: LocationsService) {}

  @SubscribeMessage('sendCurrentLocation')
  async saveCurrentLocation(@MessageBody() locationData: any) {
    const location = await this.locationService.updateDriverLocation(
      locationData.id,
      locationData.updateLocation,
    );

    this.server.emit('CurrentLocation', location);

    return location;
  }

  // async getNearbyDrivers(@MessageBody() locationData: any) {
  //   const locations = await this.locationService.getNearbyDrivers(
  //     locationData.id,
  //     locationData.updateLocation,
  //   );

  //   this.server.emit('CurrentLocation', location);

  //   return location;
  // }
}
