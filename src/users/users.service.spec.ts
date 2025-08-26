import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HashingService } from 'src/auth/hashing/hash.service';
import { QueryFailedError, Repository } from 'typeorm';
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

      const passwordHash = 'HASHPASSWORD';
      const newUser = {
        id: 1,
        name: createUserDto.name,
        passwordHash,
        email: createUserDto.email,
        picture: createUserDto.picture,
      }

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(newUser as any);

      const result = await sut.create(createUserDto);

      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);

      expect(userRepository.create).toHaveBeenCalledWith({
        name: createUserDto.name,
        passwordHash: passwordHash,
        email: createUserDto.email,
        picture: createUserDto.picture
      })
      expect(userRepository.save).toHaveBeenCalledWith(newUser)
      expect(result).toEqual(newUser);
    });

    it('Should launch ConflictException when e-mail already exists', async () => {

      const userDto = {
        email: 'a@a.com',
        name: 'Gabriel',
        password: '123456'
      };

      const error = new QueryFailedError('', [], new Error()) as any;
      error.code = '23505';
      jest.spyOn(userRepository, 'save').mockRejectedValue(error)

      await expect(sut.create(userDto)).rejects.toThrow(
        ConflictException
      )
    })

    it('Should launch ConflictException when e-mail already exists', async () => {

      const userDto = {
        email: 'a@a.com',
        name: 'Gabriel',
        password: '123456'
      };
   
      jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Erro genérico'))

      await expect(sut.create(userDto)).rejects.toThrow(
        new Error('Erro genérico')
      )
    })

  });


});
