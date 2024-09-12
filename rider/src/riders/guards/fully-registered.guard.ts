import { RidersService } from 'src/riders/services/riders.service';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FullyRegisteredGuard implements CanActivate {
  constructor(
    private ridersService: RidersService 
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    return this.validateRequest(user);
  }

  async validateRequest(user): Promise<boolean> {
    const fullUser = await this.ridersService.findOne(user.id);
    if (!fullUser || !fullUser.isFullyRegistered) {
      throw new UnauthorizedException('User is not fully registered');
    }
    return true;
  }
}
