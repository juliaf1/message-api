import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatadogLoggerService } from '../logger/datadog-logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForbiddenException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

describe('UsersController', () => {
  let app: TestingModule;
  let controller: UsersController;
  let usersService: UsersService;
  let logger: DatadogLoggerService;

  beforeAll(async () => {
    const mockUsersService = {
      create: jest.fn(),
      repository: {
        // Add minimal mock methods if needed
      },
    };

    const mockLogger = {
      log: jest.fn(),
      getTraceInfo: jest.fn(),
      options: {},
      registerLocalInstanceRef: jest.fn(),
    };

    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: DatadogLoggerService,
          useValue: mockLogger,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
    logger = app.get<DatadogLoggerService>(DatadogLoggerService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user if system user', async () => {
      const dto: CreateUserDto = { externalId: 'juliafrederico@usp.br' };
      const user = { isSystemUser: () => true } as User;
      const req: Request = { user } as Request;

      (usersService.create as jest.Mock).mockResolvedValue('created');

      const result = await controller.create(dto, req);

      expect(result).toBe('created');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.create).toHaveBeenCalledWith(dto);
    });

    it('should throw ForbiddenException if not system user', async () => {
      const dto: CreateUserDto = { externalId: 'juliafrederico@usp.br' };
      const user = { isSystemUser: () => false } as User;
      const req: Request = { user } as Request;

      try {
        await controller.create(dto, req);
        fail('Expected ForbiddenException to be thrown');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect((error as ForbiddenException).message).toBe(
          'Unauthorized access to this resource',
        );
      }

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });
});
