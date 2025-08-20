import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HashingService } from 'src/auth/hashing/hash.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let sut: UsersService;
  let userRepository: Repository<UserEntity>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    sut = module.get(UsersService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    hashingService = module.get(HashingService);
  });
  it('UserService should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('Create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'a@a.com',
        name: 'Gabriel',
        password: '123456',
      };

      jest.spyOn(hashingService, 'hash').mockResolvedValue('HASHPASSWORD');

      await sut.create(createUserDto);

      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);
    });
  });
});
