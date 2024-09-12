import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { TripsService } from '../services/trips.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TripsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tripsService: TripsService) {}

  // @SubscribeMessage('getRequestRideDetails')
  // async saveCurrentLocation(@MessageBody() rideData: any) {
  //   const data = await this.tripsService.calculateTrip(
  //     rideData.riderId,
  //     rideData.pickUp.Lat,
  //     rideData.pickUp.Lng,
  //     rideData.dropOff.Lat,
  //     rideData.dropOff.Lng,
  //   );

  //   this.server.emit('returnRideDetails', data);

  //   return data;
  // }
}
