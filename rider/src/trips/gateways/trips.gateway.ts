import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { TripsService } from '../services/trips.service';
import { Server } from 'socket.io';
import { AppEvents } from '../../helpers/event-emitter.provider';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TripsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tripsService: TripsService) {}

  onModuleInit() {
    AppEvents.on('returnRequestedRide', (data) => {
      this.server.emit('returnRideDetails', data);
    });
  }

  @SubscribeMessage('getRequestRideDetails')
  async saveCurrentLocation(@MessageBody() rideData: any) {
    const data = await this.tripsService.requestRide(rideData);

    return data;
  }
}
