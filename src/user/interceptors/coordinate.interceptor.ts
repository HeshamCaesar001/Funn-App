import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CoordinateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { latitude, longitude } = request.body;

    if (!this.isInEgypt(latitude, longitude)) {
      throw new BadRequestException('Coordinates are not in Egypt');
    }

    return next.handle();
  }

  /**
   * Checks if the given coordinates are in Egypt.
   * 
   * @param {number} latitude - The latitude to check.
   * @param {number} longitude - The longitude to check.
   * @returns {boolean} - True if the coordinates are in Egypt, false otherwise.
   */
  private isInEgypt(lat: number, lng: number): boolean {
    const egyptBounds = {
      north: 31.5,
      south: 22,
      west: 25,
      east: 37
    };
  
    return lat >= egyptBounds.south && lat <= egyptBounds.north && lng >= egyptBounds.west && lng <= egyptBounds.east;
  }
}
