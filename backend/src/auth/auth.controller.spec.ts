import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn((email, password) => {
              if (email === 'test@test.com' && password === '123456') {
                return { access_token: 'dummy-token' };
              }
              throw new Error('Invalid credentials');
            }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return access_token for valid login', async () => {
    const result = await authController.login('test@test.com', '123456');
    expect(result).toEqual({ access_token: 'dummy-token' });
  });

  it('should throw error for invalid login', async () => {
    await expect(
      authController.login('wrong@test.com', 'wrongpass'),
    ).rejects.toThrow('Invalid credentials');
  });
});