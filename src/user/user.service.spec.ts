import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { BadRequestException, CallHandler, ExecutionContext } from '@nestjs/common';
import { CoordinateInterceptor } from './interceptors/coordinate.interceptor';
import { of } from 'rxjs';

const mockUser = {
    id: 1,
    name: 'hesham',
    email: 'heshamsayed@example.com',
    password: 'password',
    city: 'cairo'
};


describe('UserService', () => {
    let service: UserService;
    let repository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            // jest.spyOn(interceptorsService, 'isInEgypt').mockReturnValue('Cairo');

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null); // Mock no existing user
            jest.spyOn(repository, 'create').mockReturnValue(mockUser as User);
            jest.spyOn(repository, 'save').mockResolvedValue(mockUser as User);

            const result = await service.create(mockUser.name, mockUser.password, mockUser.email, mockUser.city);
            expect(result).toEqual(mockUser);
        });

        it('should throw an error if user already exists', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser as any);

            await expect(service.create(mockUser.name, mockUser.password, mockUser.email, mockUser.city)).rejects.toThrowError(BadRequestException);
        });
   
    });
    describe('CoordinateInterceptor', () => {
        let interceptor: CoordinateInterceptor;
      
        beforeEach(() => {
          interceptor = new CoordinateInterceptor();
        });
      
        it('should allow the request if coordinates are in Egypt', (done) => {
          const mockContext = {
            switchToHttp: () => ({
              getRequest: () => ({
                body: { latitude: 30, longitude: 31 }
              }),
            }),
          } as ExecutionContext;
          const mockNext = {
            handle: () => of('next')
          } as unknown as CallHandler;
      
          interceptor.intercept(mockContext, mockNext).subscribe((result) => {
            expect(result).toBe('next');
            done();
          });
        });
      
        it('should throw an error if coordinates are outside Egypt', () => {
          const mockContext = {
            switchToHttp: () => ({
              getRequest: () => ({
                body: { latitude: 35, longitude: 40 }
              }),
            }),
          } as ExecutionContext;
          const mockNext = {
            handle: () => of('next')
          } as unknown as CallHandler;
      
          expect(() => interceptor.intercept(mockContext, mockNext)).toThrowError('Coordinates are not in Egypt');
        });
      });

    describe('findOne', () => {
        it('should find a user by ID', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser as any);

            const result = await service.findUser(mockUser.id);
            expect(result).toEqual(mockUser);
        });

        it('should return null if user not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

            const result = await service.findUser(2);
            expect(result).toBeNull();
        });
    });
});
