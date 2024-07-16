import { Body, Controller, Get, NotFoundException, Post, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserDto } from './dtos/userDto.dto';
import { Serialize } from './interceptors/serialize.interceptor'
import { UserService } from './user.service';
import { CoordinateInterceptor } from './interceptors/coordinate.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { AuthGuard } from './guards/auth.guard';

@Controller('user')
@Serialize(UserDto)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    /**
  * Retrieves a user by their ID.
  * 
  * @param {string} id - The ID of the user to retrieve.
  * @returns {Promise<User>} - The user with the specified ID.
  * @throws {Error} - If the user cannot be found.
  */
    @Get()
    @UseGuards(AuthGuard)
    async profileData(@Query('user_id') id: string): Promise<User> {
        const user = await this.userService.findUser(+id);
        if (!user) {
            throw new NotFoundException("user not found");
        }
        return user;
    }
    /**
   * Signs up a new user.
   * 
   * @param {CreateUserDto} createUserDto - The DTO containing the user details.
   * @returns {Promise<User>} - The created user.
   * @throws {Error} - If the coordinates are not in Egypt or the user cannot be created.
   */

    @Post('/signUp')
    @UseInterceptors(CoordinateInterceptor)
    async signUp(@Body() body: CreateUserDto,@Session() session: any): Promise<User> {
        const city = this.getCityFromCoordinates(body.longitude, body.latitude);
        const user = await this.userService.create(body.name, body.password, body.email, city);
        session.userId = user.id
        return user;
    }

    /**
  * Derives the city from the given coordinates.
  * 
  * @param {number} latitude - The latitude of the location.
  * @param {number} longitude - The longitude of the location.
  * @returns {string} - The name of the city.
  * @returns {NULL} - uf Geocoding API error or Error fetching city
  */
    private async getCityFromCoordinates(lng: number, lat: number) {
        const apiKey = process.env.API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

        try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.status === 'OK') {
            const addressComponents = data.results[0].address_components;
            const city = addressComponents.find(component => component.types.includes('locality'));
            return city ? city.long_name : null;
          } else {
            console.error('Geocoding API error:', data.status);
            return null;
          }
        } catch (error) {
          console.error('Error fetching city:', error);
          return null;
        }

        // for simple test
        // return 'Cairo'
    }

}
